import { Link } from 'react-router-dom';
import { useSellerProducts, useDeleteProduct } from '../../hooks/useProducts';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const SellerProducts = () => {
  const { data, isLoading } = useSellerProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success('Product deleted');
      } catch (e) { toast.error(e.message); }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Products</h1>
        <Link to="/seller/products/new"><Button size="sm"><HiPlus className="w-4 h-4" /> Add Product</Button></Link>
      </div>
      {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : (
        <div className="bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-white/10 text-left">
              <th className="p-4 text-gray-500 text-sm font-medium">Product</th>
              <th className="p-4 text-gray-500 text-sm font-medium">Category</th>
              <th className="p-4 text-gray-500 text-sm font-medium">Price</th>
              <th className="p-4 text-gray-500 text-sm font-medium">Status</th>
              <th className="p-4 text-gray-500 text-sm font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {data?.data?.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{p.title}</td>
                  <td className="p-4"><Badge variant="primary">{p.category}</Badge></td>
                  <td className="p-4 text-white">₹{p.price}</td>
                  <td className="p-4"><Badge variant={p.status === 'active' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}>{p.status}</Badge></td>
                  <td className="p-4 flex gap-2">
                    <Link to={`/seller/products/${p._id}/edit`}><Button variant="ghost" size="sm"><HiPencil className="w-4 h-4" /></Button></Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(p._id)}><HiTrash className="w-4 h-4 text-red-400" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data?.data || data.data.length === 0) && <p className="text-gray-500 text-center py-12">No products yet</p>}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
