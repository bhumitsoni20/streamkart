import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

const statusVariant = {
  placed: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

const paymentVariant = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
  refunded: 'primary',
};

const OrderCard = ({ order }) => {
  return (
    <Link to={`/dashboard/orders/${order._id}`} className="block">
      <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              {order.product?.logo ? (
                <img src={order.product.logo} alt="" className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-lg font-bold text-blue-400">{order.product?.title?.[0]}</span>
              )}
            </div>
            <div>
              <h4 className="text-white font-medium">{order.product?.title}</h4>
              <p className="text-sm text-gray-500">Order #{order._id?.slice(-8)}</p>
            </div>
          </div>
          <span className="text-lg font-bold text-white">₹{order.amount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[order.orderStatus]}>{order.orderStatus}</Badge>
          <Badge variant={paymentVariant[order.paymentStatus]}>{order.paymentStatus}</Badge>
          <span className="ml-auto text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
