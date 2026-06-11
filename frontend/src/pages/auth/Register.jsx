import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { signUpWithEmail, signInWithGoogle } from '../../firebase/auth';
import { registerUser } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      await registerUser({ name, email });
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Google login failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
      <p className="text-gray-500 mb-8">Start your journey with Prime Net.</p>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input label="Full Name" icon={HiUser} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" icon={HiMail} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" icon={HiLockClosed} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
        <div className="relative flex justify-center"><span className="bg-gray-950 px-4 text-sm text-gray-500">or</span></div>
      </div>

      <Button variant="secondary" onClick={handleGoogleLogin} className="w-full">
        <FcGoogle className="w-5 h-5" /> Sign up with Google
      </Button>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
