import { Link } from 'react-router-dom';
import { HiShoppingCart } from 'react-icons/hi';
import Badge from '../ui/Badge';
import Rating from '../ui/Rating';
import Button from '../ui/Button';
import useCart from '../../hooks/useCart';

const categoryColors = {
  ott: 'primary',
  'ai-tools': 'purple',
  vpn: 'success',
  education: 'warning',
  software: 'primary',
  'cloud-storage': 'success',
  'premium-membership': 'purple',
  other: 'default',
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
      <Link to={`/products/${product._id}`}>
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
          {product.logo ? (
            <img src={product.logo} alt={product.title} className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-3xl font-bold text-blue-400">
              {product.title?.[0]}
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant={categoryColors[product.category] || 'default'}>
              {product.category?.replace('-', ' ')}
            </Badge>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-3 left-3">
              <Badge variant="danger">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <Rating value={product.ratings || 0} size="sm" />
          <span className="text-xs text-gray-500">({product.totalReviews || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <Button size="sm" onClick={() => addToCart(product)}>
            <HiShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
