const Terms = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
    <div className="space-y-6 text-gray-400 leading-relaxed">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
      <p>By accessing or using Prime Net, you agree to be bound by these Terms of Service.</p>
      <h2 className="text-xl font-semibold text-white">2. User Accounts</h2>
      <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account.</p>
      <h2 className="text-xl font-semibold text-white">3. Marketplace</h2>
      <p>Prime Net acts as a marketplace connecting buyers and sellers of digital subscriptions. We do not guarantee the quality of third-party services.</p>
      <h2 className="text-xl font-semibold text-white">4. Payments & Refunds</h2>
      <p>All payments are processed securely through Razorpay or Stripe. Refund policies are subject to individual seller terms.</p>
      <h2 className="text-xl font-semibold text-white">5. Contact</h2>
      <p>For questions about these terms, contact us at legal@primenet.com.</p>
    </div>
  </div>
);

export default Terms;
