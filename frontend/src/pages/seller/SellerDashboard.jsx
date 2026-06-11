import { HiCube, HiShoppingBag, HiCurrencyRupee, HiStar } from 'react-icons/hi';
import StatsCard from '../../components/common/StatsCard';
import OrderCard from '../../components/cards/OrderCard';
import { useSellerOrders } from '../../hooks/useOrders';
import Spinner from '../../components/ui/Spinner';

const SellerDashboard = () => {
  const { data, isLoading } = useSellerOrders('limit=5');

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard icon={HiCube} label="Total Products" value={0} color="blue" />
        <StatsCard icon={HiShoppingBag} label="Total Orders" value={data?.pagination?.total || 0} color="purple" />
        <StatsCard icon={HiCurrencyRupee} label="Revenue" value="₹0" color="green" />
        <StatsCard icon={HiStar} label="Avg. Rating" value="0.0" color="amber" />
      </div>
      <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
      {isLoading ? <div className="flex justify-center py-8"><Spinner /></div> : (
        <div className="space-y-3">
          {data?.data?.map((o) => <OrderCard key={o._id} order={o} />)}
          {(!data?.data || data.data.length === 0) && <p className="text-gray-500 text-center py-8">No orders yet</p>}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
