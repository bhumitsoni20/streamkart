import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { sendPushNotification } from '../services/notification.service';

// POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, paymentMethod, paymentId, sessionId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return sendError(res, 'Product not found.', 404);
    if (product.status !== 'active') return sendError(res, 'Product is not available.', 400);

    const order = await Order.create({
      user: req.user._id,
      product: product._id,
      seller: product.seller,
      amount: product.price,
      paymentMethod,
      paymentId: paymentId || '',
      sessionId,
      paymentStatus: 'pending',
      orderStatus: 'placed',
    });

    // Increment product sales
    await Product.findByIdAndUpdate(productId, { $inc: { totalSales: 1 } });

    // Notify seller
    await sendPushNotification(
      product.seller.toString(),
      'New Order!',
      `You received a new order for ${product.title}`,
      'order'
    );

    return sendSuccess(res, order, 'Order placed successfully.', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// GET /api/orders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .populate('product', 'title logo price category')
        .populate('seller', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: req.user._id }),
    ]);

    return sendPaginated(res, orders, page, limit, total);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// GET /api/orders/:id
export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('seller', 'name email')
      .populate('user', 'name email')
      .lean();

    if (!order) return sendError(res, 'Order not found.', 404);

    // Only the buyer, seller, or admin can view the order
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isSeller = order.seller._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isSeller && !isAdmin) {
      return sendError(res, 'Not authorized.', 403);
    }

    return sendSuccess(res, order);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 'Order not found.', 404);

    order.orderStatus = orderStatus;
    await order.save();

    // Notify buyer
    await sendPushNotification(
      order.user.toString(),
      'Order Update',
      `Your order status has been updated to: ${orderStatus}`,
      'order'
    );

    return sendSuccess(res, order, 'Order status updated.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// GET /api/orders/seller/me
export const getSellerOrders = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ seller: req.user._id })
        .populate('product', 'title logo price')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ seller: req.user._id }),
    ]);

    return sendPaginated(res, orders, page, limit, total);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
