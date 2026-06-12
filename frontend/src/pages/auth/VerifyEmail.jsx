import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiRefresh } from 'react-icons/hi';
import { auth } from '../../firebase/config';
import { sendVerificationEmail } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = auth?.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    
    // Poll to check if email is verified
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          toast.success('Email verified successfully!');
          navigate('/');
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendVerificationEmail();
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <HiMail className="w-8 h-8 text-indigo-600" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        We've sent a verification link to <span className="font-semibold text-gray-900">{user?.email}</span>. 
        Please click the link to verify your account.
      </p>

      <div className="space-y-4 w-full">
        <Button onClick={handleResend} className="w-full" size="lg" loading={loading}>
          <HiRefresh className="w-5 h-5 mr-2" /> Resend verification email
        </Button>
        <Link to="/" className="block">
          <Button variant="secondary" className="w-full" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>

      <p className="text-sm text-gray-400 mt-8">
        Didn't receive the email? Check your spam folder or try resending.
      </p>
    </div>
  );
};

export default VerifyEmail;
