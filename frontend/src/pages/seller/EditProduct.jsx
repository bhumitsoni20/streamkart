import { useParams, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const EditProduct = () => {
  const { id } = useParams();
  return (
    <div>
      <Link to="/seller/products" className="text-indigo-600 text-sm font-medium hover:text-indigo-500 mb-4 inline-block">← Back to Products</Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl">
        <p className="text-gray-500 text-sm">Product data will load from your database for ID: {id}</p>
      </div>
    </div>
  );
};

export default EditProduct;
