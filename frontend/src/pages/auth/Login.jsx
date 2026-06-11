import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
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
      navigate('/dashboard');
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
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Google login failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
      <p className="text-gray-500 mb-8">Welcome back! Sign in to your account.</p>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          icon={HiMail}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          icon={HiLockClosed}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" className="rounded border-white/20 bg-white/5" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-950 px-4 text-sm text-gray-500">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={handleGoogleLogin} className="w-full">
          <FcGoogle className="w-5 h-5" /> Google
        </Button>
        <Link to="/phone-login" className="w-full">
          <Button variant="secondary" className="w-full">📱 Phone OTP</Button>
        </Link>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
