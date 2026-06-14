import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineShoppingCart } from 'react-icons/hi';
import useWishlistStore from '../../store/wishlistStore';
import useCartStore from '../../store/cartStore';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product) => {
    addItem(product);
    removeItem(product._id);
    toast.success('Moved to cart!');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="h-24 w-24 bg-pink-50 rounded-full flex items-center justify-center mb-6">
          <HiOutlineHeart className="w-10 h-10 text-pink-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Save items you love here and buy them later.</p>
        <Link to="/products">
          <Button size="lg">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              {product.logo ? (
                <img src={product.logo} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300 text-4xl font-bold">
                  {product.title?.charAt(0)}
                </div>
              )}
              
              <button 
                onClick={() => removeItem(product._id)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-pink-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                title="Remove from wishlist"
              >
                <HiOutlineHeart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">{product.title}</h3>
                </Link>
                <span className="font-bold text-indigo-600 shrink-0">₹{product.price.toLocaleString()}</span>
              </div>
              
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
              
              <div className="mt-auto pt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <HiOutlineShoppingCart className="w-4 h-4" /> Move to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
