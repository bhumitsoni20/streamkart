const Privacy = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
    <div className="space-y-6 text-gray-600 leading-relaxed">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
      <p>We collect information you provide directly, including name, email, phone number, and payment details when you create an account or make a purchase.</p>
      <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
      <p>We use your information to provide and improve our services, process transactions, send notifications, and communicate with you about your account.</p>
      <h2 className="text-xl font-semibold text-gray-900">3. Data Security</h2>
      <p>We implement appropriate security measures to protect your personal information. Payment processing is handled by trusted third-party providers (Razorpay and Stripe).</p>
      <h2 className="text-xl font-semibold text-gray-900">4. Contact</h2>
      <p>For privacy concerns, contact us at privacy@primenet.com.</p>
    </div>
  </div>
);

export default Privacy;
