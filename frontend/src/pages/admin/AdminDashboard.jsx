import { HiUsers, HiCube, HiShoppingBag, HiCurrencyRupee } from 'react-icons/hi';
import StatsCard from '../../components/common/StatsCard';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={HiUsers} label="Total Users" value="0" color="blue" trend={12} />
        <StatsCard icon={HiCube} label="Total Products" value="0" color="purple" trend={8} />
        <StatsCard icon={HiShoppingBag} label="Total Orders" value="0" color="green" trend={15} />
        <StatsCard icon={HiCurrencyRupee} label="Revenue" value="₹0" color="amber" trend={20} />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Platform Overview</h2>
        <p className="text-gray-500 text-sm">Connect your MongoDB database and Firebase to see live statistics.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
