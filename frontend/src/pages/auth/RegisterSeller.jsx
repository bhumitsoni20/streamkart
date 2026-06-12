import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi';
import { signUpWithEmail } from '../../firebase/auth';
import { registerUser } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const RegisterSeller = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      // Explicitly pass role: 'seller' to the backend
      await registerUser({ name, email, role: 'seller' });
      toast.success('Seller Account created!');
      navigate('/verify-email');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-indigo-700 mb-1">Become a Seller 🚀</h1>
      <p className="text-gray-500 mb-8">Create your seller account to start reaching customers.</p>
      <form onSubmit={handleRegister} className="space-y-4">
        <Input label="Store Name / Full Name" icon={HiUser} placeholder="Prime Store" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Business Email" type="email" icon={HiMail} placeholder="business@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" icon={HiLockClosed} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" size="lg" loading={loading}>Register as Seller <span className="ml-1">→</span></Button>
      </form>
      
      <p className="text-center text-xs text-gray-400 mt-6">
        By registering as a seller, you agree to our <Link to="/terms" className="text-indigo-600 hover:underline">Seller Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
};

export default RegisterSeller;
