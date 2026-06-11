import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Cart } from '../models/Cart';
import { sendSuccess, sendError } from '../utils/response';

// GET /api/cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'title logo price category status'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return sendSuccess(res, cart);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// POST /api/cart/add
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity: 1 }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        return sendError(res, 'Product already in cart.', 400);
      }

      cart.items.push({ product: productId, quantity: 1 });
      await cart.save();
    }

    await cart.populate('items.product', 'title logo price category status');
    return sendSuccess(res, cart, 'Added to cart.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// DELETE /api/cart/remove/:productId
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return sendError(res, 'Cart not found.', 404);

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await cart.save();

    await cart.populate('items.product', 'title logo price category status');
    return sendSuccess(res, cart, 'Removed from cart.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// DELETE /api/cart/clear
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return sendError(res, 'Cart not found.', 404);

    cart.items = [];
    await cart.save();

    return sendSuccess(res, cart, 'Cart cleared.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
