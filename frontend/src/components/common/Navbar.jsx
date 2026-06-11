import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiShoppingCart, HiBell, HiUser } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { signOut } from '../../firebase/auth';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const itemCount = useCartStore((s) => s.items.length);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { label: 'Marketplace', to: '/products' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
              PN
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Prime<span className="text-blue-400">Net</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <HiBell className="w-5 h-5" />
                </Link>
                <Link to="/products" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <HiShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-2 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-white text-sm font-medium">{user?.name}</p>
                        <p className="text-gray-500 text-xs">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Dashboard</Link>
                      <Link to="/dashboard/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Profile</Link>
                      {(user?.role === 'seller' || user?.role === 'admin') && (
                        <Link to="/seller" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Seller Panel</Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Admin Panel</Link>
                      )}
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors">Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/register"><Button size="sm">Get Started</Button></Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/5 animate-fadeIn">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block py-2 text-gray-400 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
