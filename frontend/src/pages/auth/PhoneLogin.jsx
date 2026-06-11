import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiPhone } from 'react-icons/hi';
import { setupRecaptcha, sendOTP, verifyOTP } from '../../firebase/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const PhoneLogin = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef(null);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    setLoading(true);
    try {
      const recaptcha = setupRecaptcha('recaptcha-container');
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;
      const result = await sendOTP(phoneNumber, recaptcha);
      confirmationRef.current = result;
      setStep('otp');
      toast.success('OTP sent!');
    } catch (error) { toast.error(error.message || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { toast.error('Enter a valid 6-digit OTP'); return; }
    setLoading(true);
    try {
      await verifyOTP(confirmationRef.current, otp);
      toast.success('Phone verified!');
      navigate('/dashboard');
    } catch (error) { toast.error(error.message || 'Invalid OTP'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Phone Login 📱</h1>
      <p className="text-gray-500 mb-8">Sign in with your phone number.</p>
      {step === 'phone' ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <Input label="Phone Number" icon={HiPhone} placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div id="recaptcha-container" />
          <Button type="submit" className="w-full" size="lg" loading={loading}>Send OTP →</Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <Input label="Enter OTP" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
          <Button type="submit" className="w-full" size="lg" loading={loading}>Verify & Sign In →</Button>
          <button onClick={() => setStep('phone')} className="text-sm text-indigo-600 hover:text-indigo-500 w-full text-center font-medium">Change phone number</button>
        </form>
      )}
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/login" className="text-indigo-600 font-medium hover:underline">← Back to Sign In</Link>
      </p>
    </div>
  );
};

export default PhoneLogin;
