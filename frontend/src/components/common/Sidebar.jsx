import { NavLink } from 'react-router-dom';
import { HiHome, HiShoppingBag, HiClipboardList, HiUser, HiBell, HiCube, HiPlus, HiUsers, HiChartBar, HiCog, HiSupport, HiChat, HiSparkles } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';
import Button from '../ui/Button';

const Sidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  const userLinks = [
    { to: '/dashboard', icon: HiHome, label: 'Dashboard', end: true },
    { to: '/dashboard/orders', icon: HiClipboardList, label: 'My Orders' },
    { to: '/dashboard/notifications', icon: HiBell, label: 'Notifications' },
    { to: '/dashboard/profile', icon: HiUser, label: 'Profile' },
  ];

  const sellerLinks = [
    { to: '/seller', icon: HiChartBar, label: 'Dashboard', end: true },
    { to: '/seller/products', icon: HiCube, label: 'Inventory' },
    { to: '/seller/products/new', icon: HiPlus, label: 'Add Product' },
    { to: '/seller/orders', icon: HiClipboardList, label: 'Orders' },
  ];

  const adminLinks = [
    { to: '/admin', icon: HiChartBar, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: HiUsers, label: 'Subscribers' },
    { to: '/admin/products', icon: HiCube, label: 'Integrations' },
    { to: '/admin/orders', icon: HiCog, label: 'Settings' },
  ];

  const renderLinks = (links) => (
    <ul className="space-y-0.5">
      {links.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            end={link.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-16 left-0 bottom-0 w-60 bg-white border-r border-gray-100 z-30 overflow-y-auto transition-transform duration-300 lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-indigo-600 font-bold text-sm">Prime Net</p>
          <p className="text-gray-900 font-semibold text-sm">Dashboard</p>
          <p className="text-gray-400 text-xs">{user?.role === 'admin' ? 'Enterprise Tier' : 'Standard'}</p>
        </div>

        <div className="p-3 flex-1">
          {renderLinks(userLinks)}
          {(user?.role === 'seller' || user?.role === 'admin') && (
            <>
              <div className="h-px bg-gray-100 my-3" />
              {renderLinks(sellerLinks)}
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <div className="h-px bg-gray-100 my-3" />
              {renderLinks(adminLinks)}
            </>
          )}
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100">
          <div className="bg-indigo-50 rounded-xl p-3 mb-3">
            <p className="text-indigo-600 font-semibold text-sm">Pro Plan</p>
            <p className="text-gray-500 text-xs mt-0.5">Unlock advanced tools.</p>
            <Button size="sm" className="w-full mt-2.5 !text-xs">Upgrade Plan</Button>
          </div>
          <NavLink to="/contact" className="flex items-center gap-2.5 px-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
            <HiSupport className="w-4 h-4" /> Support
          </NavLink>
          <NavLink to="/contact" className="flex items-center gap-2.5 px-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
            <HiChat className="w-4 h-4" /> Feedback
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
