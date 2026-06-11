import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✉️</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
        <p className="text-gray-500 mb-6">We sent a password reset link to <span className="text-white">{email}</span></p>
        <Link to="/login"><Button variant="secondary">Back to Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
      <p className="text-gray-500 mb-8">Enter your email to receive a reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" icon={HiMail} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">← Back to Sign In</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
