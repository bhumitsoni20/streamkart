import { useParams } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrders';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useOrder(id);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  const order = data?.data;
  if (!order) return <p className="text-gray-500 text-center py-16">Order not found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Order Details</h1>
      <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Order ID</p>
            <p className="text-white font-mono text-sm">{order._id}</p>
          </div>
          <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge>
        </div>
        <hr className="border-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Product</p>
            <p className="text-white font-medium">{order.product?.title}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Amount</p>
            <p className="text-white font-bold text-xl">₹{order.amount}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Payment Method</p>
            <p className="text-white capitalize">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Order Status</p>
            <Badge variant={order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'danger' : 'warning'}>{order.orderStatus}</Badge>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Date</p>
            <p className="text-white">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
