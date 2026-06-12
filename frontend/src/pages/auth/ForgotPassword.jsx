import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { requestPasswordReset } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Email is required'); return; }
    setLoading(true);
    try { 
      await requestPasswordReset(email); 
      setSent(true); 
      toast.success('Reset link sent!'); 
    }
    catch (error) { toast.error(error.message || 'Failed to send reset email'); }
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✉️</span></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        <p className="text-gray-500 mb-6">We sent a password reset link to <span className="text-gray-900 font-medium">{email}</span></p>
        <Link to="/login"><Button variant="secondary">Back to Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset Password 🔐</h1>
      <p className="text-gray-500 mb-8">Enter your email to receive a reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" icon={HiMail} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" className="w-full" size="lg" loading={loading}>Send Reset Link →</Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/login" className="text-indigo-600 font-medium hover:underline">← Back to Sign In</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
