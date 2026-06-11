import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../../hooks/useProducts';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const categories = [
  { value: 'ott', label: 'OTT Platforms' },
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'vpn', label: 'VPN Services' },
  { value: 'education', label: 'Education' },
  { value: 'software', label: 'Software Licenses' },
  { value: 'cloud-storage', label: 'Cloud Storage' },
  { value: 'premium-membership', label: 'Premium Membership' },
];

const AddProduct = () => {
  const [form, setForm] = useState({
    title: '', description: '', category: 'ott', price: '', originalPrice: '', logo: '', duration: '1 month', features: '',
  });
  const createProduct = useCreateProduct();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync({
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        features: form.features.split('\n').filter(Boolean),
      });
      toast.success('Product created! Pending approval.');
      navigate('/seller/products');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Add New Product</h1>
      <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} required />
            <Input label="Original Price (₹)" name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} />
          </div>
          <Input label="Logo URL" name="logo" value={form.logo} onChange={handleChange} placeholder="https://..." />
          <Input label="Duration" name="duration" value={form.duration} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Features (one per line)</label>
            <textarea name="features" value={form.features} onChange={handleChange} rows={4} placeholder="Feature 1&#10;Feature 2" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
          </div>
          <Button type="submit" loading={createProduct.isPending}>Create Product</Button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
