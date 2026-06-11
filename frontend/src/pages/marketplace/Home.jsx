import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/common/HeroSection';
import ProductCard from '../../components/cards/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const categories = [
  { icon: '🎬', label: 'OTT Platforms', value: 'ott' },
  { icon: '🤖', label: 'AI Tools', value: 'ai-tools' },
  { icon: '🔒', label: 'VPN Services', value: 'vpn' },
  { icon: '📚', label: 'Education', value: 'education' },
  { icon: '💻', label: 'Software', value: 'software' },
  { icon: '☁️', label: 'Cloud Storage', value: 'cloud-storage' },
  { icon: '⭐', label: 'Premium', value: 'premium-membership' },
];

const Home = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useProducts('limit=8&sort=rating');

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <HeroSection onSearch={handleSearch} />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="group flex flex-col items-center gap-3 p-5 bg-gray-900/60 border border-white/5 rounded-2xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              <span className="text-sm text-gray-400 group-hover:text-white text-center transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Top Rated Subscriptions</h2>
          <Link to="/products">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.data?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && (!data?.data || data.data.length === 0) && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products available yet. Be the first to list!</p>
            <Link to="/register" className="mt-4 inline-block">
              <Button>Start Selling</Button>
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Selling?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join thousands of sellers on Prime Net and reach a global audience for your digital subscriptions.</p>
            <Link to="/register"><Button size="lg">Create Seller Account</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
