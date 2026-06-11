import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
              PN
            </div>
            <span className="text-2xl font-bold text-white">
              Prime<span className="text-blue-400">Net</span>
            </span>
          </Link>
          <Outlet />
        </div>
      </div>

      {/* Right — Decoration */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-12">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-4xl mx-auto mb-8 shadow-2xl shadow-blue-500/25">
              PN
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to Prime Net</h2>
            <p className="text-gray-400 text-lg">Your marketplace for premium digital subscriptions</p>
          </div>
        </div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default AuthLayout;
