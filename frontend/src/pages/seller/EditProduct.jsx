import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useUpdateProduct } from '../../hooks/useProducts';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      setForm({ title: p.title, description: p.description, category: p.category, price: p.price, originalPrice: p.originalPrice || '', logo: p.logo || '', duration: p.duration || '1 month', features: p.features?.join('\n') || '' });
    }
  }, [data]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct.mutateAsync({ id, data: { ...form, price: parseFloat(form.price), originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined, features: form.features.split('\n').filter(Boolean) } });
      toast.success('Product updated!');
      navigate('/seller/products');
    } catch (error) { toast.error(error.message); }
  };

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Product</h1>
      <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" name="title" value={form.title || ''} onChange={handleChange} required />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹)" name="price" type="number" value={form.price || ''} onChange={handleChange} required />
            <Input label="Original Price (₹)" name="originalPrice" type="number" value={form.originalPrice || ''} onChange={handleChange} />
          </div>
          <Input label="Logo URL" name="logo" value={form.logo || ''} onChange={handleChange} />
          <Input label="Duration" name="duration" value={form.duration || ''} onChange={handleChange} />
          <Button type="submit" loading={updateProduct.isPending}>Update Product</Button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
