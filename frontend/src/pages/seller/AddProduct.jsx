import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const categories = ['ott', 'ai-tools', 'vpn', 'education', 'software', 'cloud-storage', 'premium-membership'];

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'ai-tools', features: '', deliveryType: 'instant' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      toast.success('Product created!');
      navigate('/seller/products');
    } catch { toast.error('Failed to create product'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl space-y-5">
        <Input label="Product Title" placeholder="e.g. ChatGPT Plus" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
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
          <Button type="submit" loading={loading}>Create Product</Button>
          <Button variant="secondary" onClick={() => navigate('/seller/products')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
