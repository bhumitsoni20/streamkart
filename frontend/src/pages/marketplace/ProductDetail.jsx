import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import useCart from '../../hooks/useCart';
import useWishlistStore from '../../store/wishlistStore';
import Rating from '../../components/ui/Rating';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ReviewCard from '../../components/cards/ReviewCard';
import Avatar from '../../components/ui/Avatar';
import { HiShieldCheck, HiCheckCircle, HiHeart, HiOutlineHeart } from 'react-icons/hi';

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useProduct(id);
  const { addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [billing, setBilling] = useState('monthly');

  if (isLoading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  const product = data?.data;
  const liked = product ? isInWishlist(product._id) : false;

  if (!product) return <div className="text-center py-32 text-gray-500">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/products" className="hover:text-indigo-600">Marketplace</Link>
        <span>›</span>
        <span className="text-gray-400">{product.category?.replace('-', ' ')}</span>
        <span>›</span>
        <span className="text-gray-900 font-medium">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Images + Description */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden h-80 flex items-center justify-center mb-4">
            {product.logo ? (
              <img src={product.logo} alt={product.title} className="max-h-64 object-contain" />
            ) : (
              <div className="h-24 w-24 rounded-3xl bg-white/10 flex items-center justify-center text-5xl font-bold text-white">{product.title?.[0]}</div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-3 mb-8">
            {[1,2,3,4].map((i) => (
              <div key={i} className={`h-20 w-24 rounded-xl bg-gray-200 overflow-hidden border-2 ${i === 1 ? 'border-indigo-500' : 'border-transparent'} cursor-pointer`}>
                <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white text-xs">
                  {i === 4 ? `+12` : ''}
                </div>
              </div>
            ))}
          </div>

          {/* Product Info */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Feature cards */}
          {product.features?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <HiShieldCheck className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{f}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
              <Rating value={product.ratings || 4.8} />
              <span className="text-sm text-gray-500">({product.totalReviews || 0} reviews)</span>
            </div>
            <div className="space-y-4">
              {/* Placeholder reviews */}
              <ReviewCard review={{ user: { name: 'Julianne Davis' }, rating: 5, comment: 'This service has transformed our workflow. Worth every penny.', createdAt: new Date() }} />
              <ReviewCard review={{ user: { name: 'Marcus Rodriguez' }, rating: 4, comment: 'Great integration capabilities. Seamless experience overall.', createdAt: new Date() }} />
            </div>
            <Button variant="secondary" className="w-full mt-4">Read All Reviews</Button>
          </div>
        </div>

        {/* Right — Pricing Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="verified">BEST SELLER</Badge>
              <span className="text-indigo-600 text-sm font-medium">Save 20%</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">Billed annually</p>

            {/* Billing toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              <button onClick={() => setBilling('monthly')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Monthly</button>
              <button onClick={() => setBilling('yearly')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Yearly</button>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {['Unlimited Data Retention', '24/7 Priority Support', 'Custom SSO Integration'].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <HiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <Button size="lg" className="w-full mb-3" onClick={() => addToCart(product)}>Buy Now</Button>
            <Button variant="secondary" size="lg" className="w-full mb-2">Start Free Trial</Button>
            <Button 
              variant="outline" 
              size="lg" 
              className={`w-full mb-2 flex items-center justify-center gap-2 ${liked ? 'text-pink-600 border-pink-200 bg-pink-50' : 'text-gray-600 border-gray-200'}`}
              onClick={() => toggleItem(product)}
            >
              {liked ? <HiHeart className="w-5 h-5 text-pink-500" /> : <HiOutlineHeart className="w-5 h-5" />}
              {liked ? 'Added to Wishlist' : 'Save to Wishlist'}
            </Button>
            <p className="text-xs text-gray-400 text-center">No credit card required for trial</p>

            {/* Seller Card */}
            <div className="border-t border-gray-100 mt-5 pt-5">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={product.seller?.name || 'Seller'} size="md" />
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{product.seller?.name || 'Seller'}</p>
                  <p className="text-emerald-600 text-xs flex items-center gap-1"><HiCheckCircle className="w-3.5 h-3.5" /> Verified Vendor</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-bold text-sm">{product.totalSales || '50k'}+</p>
                  <p className="text-gray-400 text-xs">SALES</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-bold text-sm">{(product.ratings || 4.9).toFixed(1)}/5</p>
                  <p className="text-gray-400 text-xs">RATING</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">✉ Contact Seller</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
