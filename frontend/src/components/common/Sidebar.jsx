import { NavLink } from 'react-router-dom';
import { HiHome, HiShoppingBag, HiClipboardList, HiUser, HiBell, HiCube, HiPlus, HiUsers, HiChartBar } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';

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
    { to: '/seller', icon: HiChartBar, label: 'Seller Dashboard', end: true },
    { to: '/seller/products', icon: HiCube, label: 'My Products' },
    { to: '/seller/products/new', icon: HiPlus, label: 'Add Product' },
    { to: '/seller/orders', icon: HiClipboardList, label: 'Orders' },
  ];

  const adminLinks = [
    { to: '/admin', icon: HiChartBar, label: 'Admin Dashboard', end: true },
    { to: '/admin/users', icon: HiUsers, label: 'Manage Users' },
    { to: '/admin/products', icon: HiCube, label: 'Manage Products' },
    { to: '/admin/orders', icon: HiShoppingBag, label: 'Manage Orders' },
  ];

  const renderLinks = (links, title) => (
    <div className="mb-6">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">{title}</p>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-gray-950 border-r border-white/5 z-30 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          {renderLinks(userLinks, 'General')}
          {(user?.role === 'seller' || user?.role === 'admin') && renderLinks(sellerLinks, 'Seller')}
          {user?.role === 'admin' && renderLinks(adminLinks, 'Admin')}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
