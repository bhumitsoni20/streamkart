import { useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import useCart from '../../hooks/useCart';
import Rating from '../../components/ui/Rating';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ReviewCard from '../../components/cards/ReviewCard';
import { HiShoppingCart, HiShieldCheck } from 'react-icons/hi';

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useProduct(id);
  const { addToCart } = useCart();

  if (isLoading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  const product = data?.data;
  if (!product) return <div className="text-center py-32 text-gray-500">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left — Image */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 flex items-center justify-center min-h-[400px] border border-white/5">
          {product.logo ? (
            <img src={product.logo} alt={product.title} className="max-h-48 object-contain" />
          ) : (
            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-6xl font-bold text-blue-400">
              {product.title?.[0]}
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div>
          <Badge variant="primary" className="mb-4">{product.category?.replace('-', ' ')}</Badge>
          <h1 className="text-3xl font-bold text-white mb-3">{product.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <Rating value={product.ratings || 0} />
            <span className="text-gray-500 text-sm">({product.totalReviews || 0} reviews)</span>
            <span className="text-gray-500 text-sm">• {product.totalSales || 0} sold</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-white">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                <Badge variant="danger">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>

          <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>

          {product.features?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                    <HiShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <span>Duration: <span className="text-white">{product.duration}</span></span>
            <span>•</span>
            <span>Seller: <span className="text-white">{product.seller?.name}</span></span>
          </div>

          <div className="flex gap-3">
            <Button size="lg" onClick={() => addToCart(product)} className="flex-1">
              <HiShoppingCart className="w-5 h-5" /> Add to Cart
            </Button>
            <Button variant="secondary" size="lg" className="flex-1">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
