import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { useProduct, useUpdateProduct } from '../../hooks/useProducts';
import Spinner from '../../components/ui/Spinner';

const categories = ['ott', 'ai-tools', 'vpn', 'education', 'software', 'cloud-storage', 'premium-membership'];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productData, isLoading } = useProduct(id);
  const updateMutation = useUpdateProduct();
  
  const [form, setForm] = useState({ title: '', logo: '', description: '', price: '', category: 'ai-tools', features: '', deliveryType: 'instant' });

  useEffect(() => {
    if (productData?.data) {
      const p = productData.data;
      setForm({
        title: p.title || '',
        logo: p.logo || '',
        description: p.description || '',
        price: p.price?.toString() || '',
        category: p.category || 'ai-tools',
        features: p.features ? p.features.join(', ') : '',
      });
    }
  }, [productData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const featuresArray = form.features ? form.features.split(',').map(f => f.trim()).filter(f => f) : [];
    
    updateMutation.mutate({
      id,
      data: {
        ...form,
        price: Number(form.price),
        features: featuresArray
      }
    }, {
      onSuccess: () => {
        toast.success('Product updated!');
        navigate('/seller/products');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update product');
      }
    });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div>
      <Link to="/seller/products" className="text-indigo-600 text-sm font-medium hover:text-indigo-500 mb-4 inline-block">← Back to Products</Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl space-y-5">
        <Input label="Product Title" placeholder="e.g. ChatGPT Plus" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input label="App Logo URL" placeholder="https://example.com/logo.png" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (₹)" type="number" placeholder="999" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
              {categories.map((c) => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
            </select>
          </div>
        </div>
        <Input label="Features (comma-separated)" placeholder="Feature 1, Feature 2, Feature 3" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={updateMutation.isPending}>Save Changes</Button>
          <Button variant="secondary" onClick={() => navigate('/seller/products')} disabled={updateMutation.isPending}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
