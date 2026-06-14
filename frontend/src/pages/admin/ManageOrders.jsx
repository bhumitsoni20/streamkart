import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrders } from '../../services/admin.service';
import { updateOrderStatus } from '../../services/order.service';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ManageOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const response = await getAllOrders(1, 100);
      return response.data || [];
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }) => updateOrderStatus(orderId, newStatus),
    onMutate: async ({ orderId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['adminOrders'] });
      const previousOrders = queryClient.getQueryData(['adminOrders']);
      
      // Optimistically update the UI to instantly reflect the new status
      queryClient.setQueryData(['adminOrders'], (old) => 
        old?.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order)
      );
      
      return { previousOrders };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['adminOrders'], context.previousOrders);
      toast.error('Failed to update status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
    onSuccess: () => toast.success('Order status updated'),
  });

  const handleStatusChange = (orderId, newStatus) => {
    statusMutation.mutate({ orderId, newStatus });
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
            {isLoading ? (
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
                      className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={statusMutation.isPending && statusMutation.variables?.orderId === order._id}
                    >
                      <option value="placed">Placed</option>
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
