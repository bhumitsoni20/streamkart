import { HiShoppingBag, HiUsers, HiStar, HiExclamation, HiPlus, HiPencil, HiDotsVertical } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.name}. Here's your shop performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" placeholder="Search data..." className="bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <Avatar src={user?.avatar} name={user?.name} size="sm" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={HiShoppingBag} label="Total Sales" value="₹1,28,430" color="blue" trend={12.5} />
        <StatsCard icon={HiUsers} label="Active Customers" value="1,248" color="green" trend={4.2} />
        <StatsCard icon={HiStar} label="Avg Rating" value="4.9 / 5.0" color="amber" />
        <StatsCard icon={HiExclamation} label="Pending Orders" value="42" color="red" alert />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Forecast */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Revenue Forecast</h2>
              <p className="text-gray-500 text-sm">Estimated earnings for Q3 2024</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button className="px-3 py-1.5 text-xs font-medium bg-white rounded-md shadow-sm text-gray-900">Monthly</button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-500">Yearly</button>
            </div>
          </div>
          {/* Chart placeholder — bar chart */}
          <div className="flex items-end gap-2 h-48 pt-4">
            {[30, 45, 38, 52, 60, 80, 72, 55, 48, 42, 35, 28].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full rounded-t-lg transition-all duration-500 ${i === 5 ? 'bg-indigo-600' : 'bg-indigo-200'}`} style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>

        {/* Payout Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Available for Payout</h3>
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">Balance</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">₹14,205.50</p>
          <p className="text-gray-500 text-sm mb-5">Last payout: 3 days ago</p>
          <Button className="w-full mb-2">Withdraw Funds</Button>
          <Button variant="secondary" className="w-full mb-3">Payout Settings</Button>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Auto-payout</span>
            <span className="text-indigo-600 font-medium">Enabled (Weekly)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Notifications */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <Link to="/dashboard/notifications" className="text-indigo-600 text-sm font-medium hover:text-indigo-500">View all</Link>
          </div>
          <div className="space-y-4">
            {[
              { icon: '📦', title: 'New Order #8429', desc: 'Premium Design Kit purchased by Alex Reed.', time: '2 MINS AGO' },
              { icon: '⭐', title: '5-Star Review Received', desc: '"Prime Net is the fastest platform I\'ve used!"', time: '1 HOUR AGO' },
              { icon: '🔐', title: 'Security Alert', desc: 'New login detected from San Francisco, CA.', time: '3 HOURS AGO' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${i === 2 ? 'bg-blue-50' : i === 1 ? 'bg-amber-50' : 'bg-purple-50'}`}>{n.icon}</div>
                <div>
                  <p className="text-gray-900 font-medium text-sm">{n.title}</p>
                  <p className="text-gray-500 text-sm">{n.desc}</p>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-medium">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Management Table */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Product Management</h3>
            <Link to="/seller/products/new"><Button size="sm"><HiPlus className="w-4 h-4" /> Add Product</Button></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Product Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Price</th>
                <th className="p-4">Actions</th>
              </tr></thead>
              <tbody>
                {[
                  { name: 'Stripe UI Kit', status: 'Active', inv: 'Unlimited', price: '₹89.00' },
                  { name: 'Neon Analytics Pro', status: 'Draft', inv: '50 Seats', price: '₹149.00' },
                  { name: 'Global Edge Node', status: 'Out of Stock', inv: '0 Units', price: '₹299.00' },
                ].map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gray-800 flex items-center justify-center text-white text-sm font-bold">{p.name[0]}</div>
                        <span className="text-gray-900 font-medium text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant={p.status === 'Active' ? 'active' : p.status === 'Draft' ? 'draft' : 'danger'}>{p.status.toUpperCase()}</Badge></td>
                    <td className="p-4"><span className="text-gray-600 text-sm">{p.inv}</span></td>
                    <td className="p-4"><span className="text-gray-900 font-medium text-sm">{p.price}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><HiPencil className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><HiDotsVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500">
            <span>Showing 3 of 124 products</span>
            <div className="flex gap-1">
              <Button variant="secondary" size="sm">Prev</Button>
              <Button variant="secondary" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
