const ManageProducts = () => {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Manage Products</h1>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="p-4">Product</th><th className="p-4">Seller</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Actions</th>
          </tr></thead>
          <tbody><tr><td colSpan={5} className="p-8 text-center text-gray-500 text-sm">Connect your database to manage products</td></tr></tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
