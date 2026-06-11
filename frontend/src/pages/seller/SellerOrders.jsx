const SellerOrders = () => {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Seller Orders</h1>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="p-4">Order ID</th><th className="p-4">Product</th><th className="p-4">Buyer</th><th className="p-4">Amount</th><th className="p-4">Status</th>
          </tr></thead>
          <tbody><tr><td colSpan={5} className="p-8 text-center text-gray-500 text-sm">Orders will appear once customers purchase your products</td></tr></tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;
