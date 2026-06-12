import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { HiShieldCheck, HiLockClosed } from 'react-icons/hi';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <Link to="/" className="text-xl font-bold text-gray-900"><span className="text-indigo-600">Stream</span>kart</Link>
        <div className="flex items-center gap-2 text-gray-500 text-sm"><HiLockClosed className="w-4 h-4" /> Secure Checkout</div>
        <Link to="/products" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — Payment Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Step 1: Payment Method */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-7 w-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {['Credit Card', 'UPI', 'Net Banking'].map((m) => (
                <button key={m} onClick={() => setPaymentMethod(m.toLowerCase())} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${paymentMethod === m.toLowerCase() ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>{m}</button>
              ))}
            </div>
            <div className="space-y-4">
              <Input label="CARDHOLDER NAME" placeholder="John Doe" />
              <Input label="CARD NUMBER" placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="EXPIRY DATE" placeholder="MM/YY" />
                <Input label="CVV" placeholder="123" />
              </div>
            </div>
          </div>

          {/* Step 2: Billing Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-7 w-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-lg font-bold text-gray-900">Billing Address</h2>
            </div>
            <div className="space-y-4">
              <Input label="STREET ADDRESS" placeholder="123 Innovation Way" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="CITY" placeholder="Mumbai" />
                <Input label="STATE / PROVINCE" placeholder="Maharashtra" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="ZIP / POSTAL CODE" placeholder="400001" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">COUNTRY</label>
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 py-4">
            <span className="flex items-center gap-1.5"><HiShieldCheck className="w-4 h-4 text-gray-400" /> PCI DSS Compliant</span>
            <span className="flex items-center gap-1.5"><HiLockClosed className="w-4 h-4 text-gray-400" /> 256-bit SSL Encryption</span>
            <span className="flex items-center gap-1.5"><HiShieldCheck className="w-4 h-4 text-gray-400" /> Fraud Protection</span>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <div className="h-14 w-14 rounded-xl bg-gray-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-semibold text-sm">Premium Subscription</p>
                <p className="text-gray-500 text-xs">Annual Subscription</p>
                <Badge variant="success" className="mt-1 text-[10px]">SAVE 20%</Badge>
              </div>
              <p className="text-gray-900 font-bold">₹2,400</p>
            </div>

            <div className="space-y-3 mb-5 pb-5 border-b border-gray-100 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">₹2,400.00</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Platform Fee (2%)</span><span className="text-gray-900">₹48.00</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Taxes</span><span className="text-gray-900">₹0.00</span></div>
            </div>

            <div className="flex justify-between items-baseline mb-5">
              <span className="text-gray-900 font-bold text-lg">Total</span>
              <div className="text-right">
                <p className="text-indigo-600 font-bold text-2xl">₹2,448.00</p>
                <p className="text-gray-400 text-xs">Billed in INR</p>
              </div>
            </div>

            <Button size="lg" className="w-full mb-3">Complete Purchase</Button>
            <p className="text-xs text-gray-400 text-center">By clicking 'Complete Purchase', you agree to our <Link to="/terms" className="text-indigo-600 underline">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 underline">Privacy Policy</Link>.</p>

            {/* Guarantee */}
            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100 bg-gray-50 rounded-xl p-4 -mx-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <HiShieldCheck className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">Streamkart Money-Back Guarantee</p>
                <p className="text-gray-500 text-xs">Full refund within 30 days if not satisfied.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
