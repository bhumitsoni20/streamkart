import { HiCube, HiCurrencyDollar, HiHeart, HiBell } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Command Center</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.name || 'User'}. Here's your enterprise overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-gray-700 font-medium">Live System Status</span>
            </div>
            <button className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <HiBell className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard icon={HiCube} label="Active Subscriptions" value="1,284" color="blue" trend={12.5} />
        <StatsCard icon={HiCurrencyDollar} label="Monthly Spend" value="₹42,900" color="purple" />
        <StatsCard icon={HiHeart} label="Wishlist Items" value="18 Items" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Subscriptions Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Active Subscriptions</h2>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Export CSV</Button>
              <Button size="sm">Add New</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Service</th>
                <th className="p-4">Status</th>
                <th className="p-4">Billing</th>
                <th className="p-4">Amount</th>
              </tr></thead>
              <tbody>
                {[
                  { name: 'CloudCore Enterprise', category: 'Infrastructure', status: 'Active', billing: 'Monthly', renewal: 'Jan 12', amount: '₹2,400' },
                  { name: 'Shield AI Pro', category: 'Security', status: 'Active', billing: 'Annual', renewal: 'Mar 05', amount: '₹12,000' },
                  { name: 'Prime Mail Service', category: 'Communication', status: 'Pending', billing: 'Monthly', renewal: 'Jan 01', amount: '₹89' },
                ].map((s, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">{s.name[0]}</div>
                        <div><p className="text-gray-900 font-medium text-sm">{s.name}</p><p className="text-gray-400 text-xs">{s.category}</p></div>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant={s.status === 'Active' ? 'active' : 'pending'}>{s.status}</Badge></td>
                    <td className="p-4"><p className="text-gray-700 text-sm">{s.billing}</p><p className="text-gray-400 text-xs">Renewing {s.renewal}</p></td>
                    <td className="p-4"><span className="text-gray-900 font-semibold text-sm">{s.amount}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Recent Orders */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {[{ id: 'ORD-9021', date: 'Dec 20, 2023' }, { id: 'ORD-8854', date: 'Dec 15, 2023' }].map((o) => (
                <div key={o.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">📋</div>
                  <div><p className="text-gray-900 font-semibold text-sm">#{o.id}</p><p className="text-gray-400 text-xs">{o.date}</p></div>
                </div>
              ))}
            </div>
            <Link to="/dashboard/orders" className="block text-center text-indigo-600 text-sm font-medium mt-4 hover:text-indigo-500">View All History</Link>
          </div>

          {/* Need Help? */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">💬</div>
            <h3 className="font-semibold mb-1">Need Help?</h3>
            <p className="text-gray-400 text-sm mb-4">Our dedicated account managers are available 24/7 to assist with your enterprise needs.</p>
            <Button variant="secondary" size="sm" className="!bg-white !text-gray-900">Start Live Chat</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
