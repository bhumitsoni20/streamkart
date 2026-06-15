import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { useSellerProducts, useDeleteProduct } from '../../hooks/useProducts';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const SellerProducts = () => {
  const { data, isLoading } = useSellerProducts();
  const deleteMutation = useDeleteProduct();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Product deleted successfully')
      });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  const products = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Products</h1>
        <Link to="/seller/products/new"><Button size="sm"><HiPlus className="w-4 h-4" /> Add Product</Button></Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-gray-500 text-sm">Your products will appear here. Start by adding your first product.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      {product.logo ? (
                        <img src={product.logo} alt={product.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-white" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">{product.title.charAt(0)}</div>
                      )}
                      <span>{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{product.category}</td>
                  <td className="p-4 text-sm text-gray-900">₹{product.price}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-right space-x-2">
                    <Link to={`/seller/products/${product._id}/edit`} className="inline-flex p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <HiPencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
