import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { useCreateProduct } from '../../hooks/useProducts';
import ImageCropperModal from '../../components/ui/ImageCropperModal';

const categories = ['ott', 'ai-tools', 'vpn', 'education', 'software', 'cloud-storage', 'premium-membership'];

const AddProduct = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'ai-tools', features: '', deliveryType: 'instant' });
  
  // Image Upload States
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCropComplete = (blob) => {
    setImageSrc(null);
    setCroppedBlob(blob);
    // Create preview URL
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process features into an array
    const featuresArray = form.features ? form.features.split(',').map(f => f.trim()).filter(f => f) : [];
    
    let base64Logo = '';
    if (croppedBlob) {
      base64Logo = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(croppedBlob);
      });
    }
    
    createMutation.mutate({
      ...form,
      logo: base64Logo,
      price: Number(form.price),
      features: featuresArray
    }, {
      onSuccess: () => {
        toast.success('Product created!');
        navigate('/seller/products');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to create product');
      }
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl space-y-5">
        <Input label="Product Title" placeholder="e.g. ChatGPT Plus" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">App Logo</label>
          <div className="flex items-center gap-4">
            {previewUrl ? (
              <img src={previewUrl} alt="Logo Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm bg-white" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center p-1">No Image</div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Upload Logo
            </Button>
            {previewUrl && (
              <button type="button" className="text-sm text-red-500 hover:text-red-700 font-medium" onClick={() => { setPreviewUrl(null); setCroppedBlob(null); }}>Remove</button>
            )}
          </div>
        </div>

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
          <Button type="submit" loading={createMutation.isPending}>Create Product</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/seller/products')} disabled={createMutation.isPending}>Cancel</Button>
        </div>
      </form>

      {imageSrc && (
        <ImageCropperModal
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageSrc(null)}
        />
      )}
    </div>
  );
};

export default AddProduct;
