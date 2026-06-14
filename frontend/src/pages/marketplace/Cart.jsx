import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineTrash, HiShoppingCart, HiArrowRight } from 'react-icons/hi';
import useCartStore from '../../store/cartStore';
import Button from '../../components/ui/Button';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <HiShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added any products or services to your cart yet.</p>
        <Link to="/products">
          <Button size="lg">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="h-24 w-24 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.logo ? (
                  <img src={item.logo} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-2xl font-bold">{item.title?.charAt(0)}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                  {item.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.category}</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-200 text-sm font-medium w-12 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-right sm:w-32">
                <p className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500 mt-1">₹{item.price.toLocaleString()} each</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({items.length} items)</span>
                <span className="text-gray-900 font-medium">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxes</span>
                <span className="text-gray-900 font-medium">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 mb-8">
              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Estimated Total</span>
                <span className="text-2xl font-bold text-indigo-600">₹{total.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <HiArrowRight className="w-4 h-4" />
            </Button>
            
            <div className="mt-4 text-center">
              <Link to="/products" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
