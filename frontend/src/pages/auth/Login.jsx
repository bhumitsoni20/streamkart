import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { signInWithEmail, signInWithGoogle } from '../../firebase/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Google login failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back 👋</h1>
      <p className="text-gray-500 mb-8">Login to access your Prime Net account</p>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <Input label="Email" type="email" icon={HiMail} placeholder="you@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div>
          <Input label="Password" type="password" icon={HiLockClosed} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="flex justify-end mt-1.5">
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Log in <span className="ml-1">→</span>
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400">or</span></div>
      </div>

      <div className="space-y-3">
        <Button variant="secondary" onClick={handleGoogleLogin} className="w-full" size="lg">
          <FcGoogle className="w-5 h-5" /> Continue with Google
        </Button>
        <Button variant="secondary" className="w-full" size="lg">
          <FaApple className="w-5 h-5 text-gray-900" /> Continue with Apple
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        By continuing, you agree to our <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
};

export default Login;
