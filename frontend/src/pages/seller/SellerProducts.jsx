import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { HiPlus } from 'react-icons/hi';

const SellerProducts = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Products</h1>
        <Link to="/seller/products/new"><Button size="sm"><HiPlus className="w-4 h-4" /> Add Product</Button></Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-gray-500 text-sm">Your products will appear here. Start by adding your first product.</p>
      </div>
    </div>
  );
};

export default SellerProducts;
