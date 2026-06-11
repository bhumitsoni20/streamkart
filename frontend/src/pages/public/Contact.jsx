import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-gray-400 mb-6">Have a question or need help? Reach out to us.</p>
          <div className="space-y-4 text-gray-400">
            <p>📧 support@primenet.com</p>
            <p>📱 +91 98765 43210</p>
            <p>📍 Mumbai, India</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={5} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
