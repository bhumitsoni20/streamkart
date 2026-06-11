const ManageOrders = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Orders</h1>
      <div className="bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/10 text-left">
            <th className="p-4 text-gray-500 text-sm font-medium">Order ID</th>
            <th className="p-4 text-gray-500 text-sm font-medium">User</th>
            <th className="p-4 text-gray-500 text-sm font-medium">Product</th>
            <th className="p-4 text-gray-500 text-sm font-medium">Amount</th>
            <th className="p-4 text-gray-500 text-sm font-medium">Status</th>
          </tr></thead>
          <tbody>
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Connect your database to manage orders</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
