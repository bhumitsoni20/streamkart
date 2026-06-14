import { HiUsers, HiCube, HiShoppingBag, HiCurrencyRupee } from 'react-icons/hi';
import StatsCard from '../../components/common/StatsCard';
import { getDashboardStats } from '../../services/admin.service';
import { useQuery } from '@tanstack/react-query';

const AdminDashboard = () => {
  const { data: stats = { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 }, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await getDashboardStats();
      return response.data;
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={HiUsers} label="Total Users" value={isLoading ? '...' : stats.totalUsers} color="blue" />
        <StatsCard icon={HiCube} label="Total Products" value={isLoading ? '...' : stats.totalProducts} color="purple" />
        <StatsCard icon={HiShoppingBag} label="Total Orders" value={isLoading ? '...' : stats.totalOrders} color="green" />
        <StatsCard icon={HiCurrencyRupee} label="Revenue" value={isLoading ? '...' : `₹${stats.totalRevenue.toLocaleString()}`} color="amber" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Platform Overview</h2>
        {isLoading ? (
          <p className="text-gray-500 text-sm animate-pulse">Loading live statistics...</p>
        ) : (
          <p className="text-gray-500 text-sm">
            The platform is currently serving <span className="font-semibold text-gray-900">{stats.totalUsers}</span> active users. 
            There are <span className="font-semibold text-gray-900">{stats.totalProducts}</span> products listed across the catalog, generating a total of <span className="font-semibold text-gray-900">{stats.totalOrders}</span> orders.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
