import { useState, useEffect } from 'react';
import { getAllProducts, updateProductStatus } from '../../services/admin.service';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts(1, 100);
      setProducts(response.data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await updateProductStatus(productId, newStatus);
      toast.success('Product status updated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Manage Products</h1>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="p-4">Product</th>
              <th className="p-4">Seller</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500 text-sm">Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500 text-sm">No products found.</td></tr>
            ) : (
              products.map(product => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{product.title}</td>
                  <td className="p-4 text-gray-600">{product.seller?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-900 font-medium">₹{product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge variant={product.status === 'active' ? 'success' : product.status === 'inactive' ? 'gray' : 'warning'}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <select
                      className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={product.status}
                      onChange={(e) => handleStatusChange(product._id, e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
