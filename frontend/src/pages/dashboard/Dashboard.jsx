import { HiShoppingBag, HiClipboardList, HiBell, HiCreditCard } from 'react-icons/hi';
import StatsCard from '../../components/common/StatsCard';
import OrderCard from '../../components/cards/OrderCard';
import useAuthStore from '../../store/authStore';
import { useMyOrders } from '../../hooks/useOrders';
import Spinner from '../../components/ui/Spinner';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useMyOrders('limit=5');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard icon={HiShoppingBag} label="Total Orders" value={data?.pagination?.total || 0} color="blue" />
        <StatsCard icon={HiCreditCard} label="Total Spent" value={`₹${0}`} color="purple" />
        <StatsCard icon={HiClipboardList} label="Active Subs" value={0} color="green" />
        <StatsCard icon={HiBell} label="Notifications" value={0} color="amber" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <div className="space-y-3">
            {data?.data?.map((order) => <OrderCard key={order._id} order={order} />)}
            {(!data?.data || data.data.length === 0) && (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
