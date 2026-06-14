import { Link } from 'react-router-dom';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import Badge from '../ui/Badge';
import Rating from '../ui/Rating';
import Button from '../ui/Button';
import useCart from '../../hooks/useCart';
import useWishlistStore from '../../store/wishlistStore';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const liked = isInWishlist(product._id);

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover-lift">
      <Link to={`/products/${product._id}`}>
        <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 p-4">
          {product.logo ? (
            <img src={product.logo} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm rounded-lg" />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
              {product.title?.[0]}
            </div>
          )}
          {/* Verified badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="verified" className="text-[10px]">✓ Verified</Badge>
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleItem(product); }}
            className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            {liked ? <HiHeart className="w-4 h-4 text-red-500" /> : <HiOutlineHeart className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-gray-900 font-semibold text-base mb-0.5 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 line-clamp-1">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            <span className="text-sm text-gray-400">/mo</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            <span className="text-sm font-medium text-gray-600">{(product.ratings || 4.9).toFixed(1)}</span>
          </div>
        </div>

        <Button size="sm" className="w-full" onClick={() => addToCart(product)}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
