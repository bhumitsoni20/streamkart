import { useNavigate, Link } from 'react-router-dom';
import HeroSection from '../../components/common/HeroSection';
import CategoryFilter from '../../components/common/CategoryFilter';
import ProductCard from '../../components/cards/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const Home = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useProducts('limit=4&sort=rating');

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-white">
      <HeroSection onSearch={handleSearch} />

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategoryFilter selected="" onSelect={(cat) => navigate(`/products?category=${cat}`)} variant="cards" />
      </section>

      {/* Trending */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Subscriptions</h2>

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
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-lg mb-4">No products available yet.</p>
            <Link to="/register"><Button>Start Selling</Button></Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
