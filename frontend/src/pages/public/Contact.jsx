import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { HiCurrencyDollar, HiShieldCheck, HiShoppingBag, HiSearch, HiPaperClip } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ topic: '', subject: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Ticket submitted! We\'ll get back to you soon.');
    setForm({ topic: '', subject: '', description: '' });
  };

  const topicCards = [
    { icon: HiCurrencyDollar, title: 'Payments & Billing', desc: 'Invoices, Refunds, Payment Methods', bg: 'bg-blue-50', color: 'text-blue-600' },
    { icon: HiShieldCheck, title: 'Account & Security', desc: 'Login Issues, Profile Settings, 2FA', bg: 'bg-blue-50', color: 'text-blue-600' },
    { icon: HiShoppingBag, title: 'Seller Center', desc: 'Listing, Payouts, Policies', bg: 'bg-blue-50', color: 'text-blue-600' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">How can we help you?</h1>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-4">
            <input
              type="text"
              placeholder="How can we help you today?"
              className="w-full bg-white rounded-2xl pl-5 pr-14 py-4 text-gray-900 placeholder-gray-400 focus:outline-none shadow-lg text-base"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <HiSearch className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <p className="text-blue-200 text-sm">Browse our Knowledge Base or contact our support team.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {topicCards.map((t) => (
            <div key={t.title} className="bg-white border border-gray-200 rounded-2xl p-6 hover-lift cursor-pointer">
              <div className={`h-14 w-14 rounded-2xl ${t.bg} flex items-center justify-center mb-4`}>
                <t.icon className={`w-7 h-7 ${t.color}`} />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-1">{t.title}</h3>
              <p className="text-gray-500 text-sm">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Still need help? Contact Support</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Choose a Topic</label>
                  <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
                    <option value="">Choose a Topic</option>
                    <option>Payments & Billing</option>
                    <option>Account & Security</option>
                    <option>Seller Center</option>
                    <option>Technical Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                <Input label="Subject" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={5}
                  placeholder="Description"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button variant="secondary" size="sm" type="button">
                  <HiPaperClip className="w-4 h-4" /> Attach Files
                </Button>
                <Button type="submit">Submit Ticket</Button>
              </div>
            </form>
          </div>

          {/* Right side info */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Email support</h3>
              <p className="text-indigo-600 text-sm mb-5">email @primenet.com</p>
              <h3 className="font-semibold text-gray-900 mb-2">Response time</h3>
              <p className="text-gray-500 text-sm">20 minutes - 5 responses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
