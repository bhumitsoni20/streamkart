import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiClock, HiXCircle } from 'react-icons/hi';

const SellerApplication = () => {
  const [status, setStatus] = useState(null); // 'none', 'pending', 'approved', 'rejected'
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    description: '',
    additionalInfo: ''
  });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await apiGet('/seller/application/me');
      if (res.data) {
        setStatus(res.data.status);
      } else {
        setStatus('none');
      }
    } catch (error) {
      toast.error('Failed to load application status');
      setStatus('none');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiPost('/seller/application', formData);
      toast.success('Application submitted successfully!');
      setStatus('pending');
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  if (status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center bg-white p-10 rounded-2xl border border-gray-200">
        <HiClock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h2>
        <p className="text-gray-500">Your seller application is currently being reviewed by our team. We will notify you once a decision has been made.</p>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center bg-white p-10 rounded-2xl border border-gray-200">
        <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Approved!</h2>
        <p className="text-gray-500 mb-6">Congratulations! You are now a seller on Prime Net.</p>
        <Button onClick={() => window.location.href = '/seller'}>Go to Seller Dashboard</Button>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center bg-white p-10 rounded-2xl border border-gray-200">
        <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Rejected</h2>
        <p className="text-gray-500 mb-6">Unfortunately, your application to become a seller has been rejected at this time. You may try again later or contact support.</p>
        <Button onClick={() => setStatus('none')} variant="secondary">Submit New Application</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Seller Application</h1>
      <p className="text-gray-500 mb-8">Tell us about your business to start selling on Prime Net.</p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
          <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
          <Input label="Business / Store Name" name="businessName" value={formData.businessName} onChange={handleChange} required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Description *</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required
            rows={4}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Tell us what you sell and why you want to join Prime Net..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
          <textarea 
            name="additionalInfo" 
            value={formData.additionalInfo} 
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Links to your website, social media, or current store..."
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" size="lg" loading={submitting}>Submit Application</Button>
        </div>
      </form>
    </div>
  );
};

export default SellerApplication;
