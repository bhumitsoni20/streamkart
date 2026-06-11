import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { HiClipboardList } from 'react-icons/hi';

const OrderCard = ({ order }) => {
  return (
    <Link to={`/dashboard/orders/${order._id}`} className="block">
      <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
        <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <HiClipboardList className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium text-sm">#{order._id?.slice(-6).toUpperCase()}</p>
          <p className="text-gray-500 text-xs">{order.product?.title}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-gray-900 font-semibold text-sm">₹{order.amount}</p>
          <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <Badge variant={order.paymentStatus === 'paid' ? 'active' : order.paymentStatus === 'pending' ? 'pending' : 'danger'}>
          {order.paymentStatus}
        </Badge>
      </div>
    </Link>
  );
};

export default OrderCard;
