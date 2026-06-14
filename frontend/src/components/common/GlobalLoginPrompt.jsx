import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Modal from '../ui/Modal';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';

const GlobalLoginPrompt = () => {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is authenticated or already on an auth page, don't show the prompt
    if (isAuthenticated || location.pathname.startsWith('/login') || location.pathname.startsWith('/register')) {
      setIsOpen(false);
      return;
    }

    const interval = setInterval(() => {
      setIsOpen(true);
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname]);

  if (isAuthenticated) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="">
      <div className="-mt-4">
        {mode === 'login' ? <Login /> : <Register />}
        
        {/* Toggle */}
        <div className="flex justify-center pt-8">
          <div className="relative flex items-center bg-gray-50/80 backdrop-blur-xl border border-gray-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] rounded-full p-1 w-56">
            <div 
              className={`absolute top-1 bottom-1 w-[108px] bg-white/90 rounded-full shadow-sm border border-gray-100 transition-transform duration-300 ease-out ${mode === 'login' ? 'translate-x-0' : 'translate-x-[108px]'}`}
            />
            <button onClick={() => setMode('login')} className={`relative z-10 flex-1 text-center py-2.5 text-sm font-medium transition-colors duration-300 ${mode === 'login' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Log in
            </button>
            <button onClick={() => setMode('register')} className={`relative z-10 flex-1 text-center py-2.5 text-sm font-medium transition-colors duration-300 ${mode === 'register' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalLoginPrompt;
