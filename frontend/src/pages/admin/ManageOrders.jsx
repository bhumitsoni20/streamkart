import { useState, useEffect } from 'react';
import { getAllOrders } from '../../services/admin.service';
import { updateOrderStatus } from '../../services/order.service';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders(1, 100);
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Manage Orders</h1>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="p-4">Order ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Product</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 text-sm">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 text-sm">No orders found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500">{order._id.substring(0, 8)}</td>
                  <td className="p-4 text-sm text-gray-900">{order.user?.email || 'Unknown'}</td>
                  <td className="p-4 text-sm text-gray-900">{order.product?.title || 'Unknown Product'}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">₹{(order.amount || order.totalAmount || 0).toLocaleString()}</td>
                  <td className="p-4 text-xs text-gray-500">{dayjs(order.createdAt).format('MMM DD, YYYY')}</td>
                  <td className="p-4">
                    <select
                      className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
