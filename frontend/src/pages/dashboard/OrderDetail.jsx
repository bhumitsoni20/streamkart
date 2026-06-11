import { useParams, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const OrderDetail = () => {
  const { id } = useParams();
  return (
    <div>
      <Link to="/dashboard/orders" className="text-indigo-600 text-sm font-medium hover:text-indigo-500 mb-4 inline-block">← Back to Orders</Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Order #{id?.slice(-6).toUpperCase()}</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-gray-500 text-sm">Order details will load from your database.</p>
      </div>
    </div>
  );
};

export default OrderDetail;
