import { useOutlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getPublicStats } from '../../services/public.service';

const AuthLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const isLogin = location.pathname === '/login' || location.pathname === '/phone-login' || location.pathname === '/forgot-password';

  const { data: stats } = useQuery({
    queryKey: ['publicStats'],
    queryFn: async () => {
      const response = await getPublicStats();
      return response.data;
    },
  });

  const userCountText = stats?.totalUsers !== undefined
    ? `${stats.totalUsers.toLocaleString()}+` 
    : '10K+';

  return (
    <div className="min-h-screen flex">
      {/* Left — Dark branded panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23]">
        {/* Orbital glow lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-indigo-500/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-blue-500/10" />
        </div>

        <div className="relative z-10 flex flex-col h-full w-full p-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <span className="text-white font-bold">Streamkart</span>
          </Link>

          {/* Headline */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              All your <span className="text-indigo-400">subscriptions.</span><br />
              One seamless place.
            </h1>
            <p className="text-gray-400 text-base mb-10">
              Discover, manage and pay for the best digital products and services.
            </p>

            {/* Floating brand icons */}
            <div className="relative h-64 mb-8">
              <div className="absolute top-0 left-0 h-16 w-16 rounded-2xl glass-dark flex items-center justify-center animate-float">
                <span className="text-2xl font-bold text-red-500">N</span>
              </div>
              <div className="absolute top-4 left-28 h-14 w-14 rounded-2xl glass-dark flex items-center justify-center animate-float-delayed">
                <span className="text-2xl text-green-400">♪</span>
              </div>
              <div className="absolute top-12 right-20 h-16 w-16 rounded-2xl glass-dark flex items-center justify-center animate-float-slow">
                <span className="text-lg font-bold text-white">N</span>
              </div>
              <div className="absolute top-32 left-16 h-20 w-20 rounded-2xl bg-indigo-600/90 flex items-center justify-center animate-float shadow-lg shadow-indigo-500/30">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div className="absolute top-24 right-8 h-14 w-14 rounded-2xl glass-dark flex items-center justify-center animate-float-delayed">
                <span className="text-sm font-bold text-blue-400">D+</span>
              </div>
              <div className="absolute bottom-4 left-32 h-14 w-14 rounded-2xl glass-dark flex items-center justify-center animate-float-slow">
                <span className="text-lg">🎨</span>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <span className="flex items-center gap-1.5">✓ Secure payments</span>
            <span className="flex items-center gap-1.5">⏱ Cancel anytime</span>
            <span className="flex items-center gap-1.5">👥 Trusted by {userCountText} users</span>
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex justify-end p-6 h-14">
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 pb-20 overflow-x-hidden">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom login/signup toggle */}
        <div className="flex justify-center pb-8">
          <div className="relative flex items-center bg-gray-50/80 backdrop-blur-xl border border-gray-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] rounded-full p-1 w-56">
            {/* Sliding Pill */}
            <div 
              className={`absolute top-1 bottom-1 w-[108px] bg-white/90 rounded-full shadow-sm border border-gray-100 transition-transform duration-300 ease-out ${isLogin ? 'translate-x-0' : 'translate-x-[108px]'}`}
            />
            
            <Link to="/login" className={`relative z-10 flex-1 text-center py-2.5 text-sm font-medium transition-colors duration-300 ${isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Log in
            </Link>
            <Link to="/register" className={`relative z-10 flex-1 text-center py-2.5 text-sm font-medium transition-colors duration-300 ${!isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
