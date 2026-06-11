import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import SearchBar from '../ui/SearchBar';

const HeroSection = ({ onSearch }) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-sm font-medium">Digital Subscription Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Buy & Sell Premium
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Digital Subscriptions</span>
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover the best deals on OTT platforms, AI tools, VPN services, software licenses, and more. Your one-stop marketplace for digital subscriptions.
          </p>

          <SearchBar onSearch={onSearch} className="max-w-xl mx-auto mb-8" />

          <div className="flex items-center justify-center gap-4">
            <Link to="/products">
              <Button size="lg">Explore Marketplace</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg">Start Selling</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '500+', label: 'Products' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
