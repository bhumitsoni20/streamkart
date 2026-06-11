import Spinner from '../../components/ui/Spinner';
import OrderCard from '../../components/cards/OrderCard';

const Orders = () => {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Orders</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-gray-500 text-sm">Your order history will appear here once you make your first purchase.</p>
      </div>
    </div>
  );
};

export default Orders;
