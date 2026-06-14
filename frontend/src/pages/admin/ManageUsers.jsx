import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../../services/admin.service';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { HiTrash, HiExclamation } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await getUsers(1, 100);
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id);
      toast.success('User deleted successfully');
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Manage Users</h1>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500 text-sm">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500 text-sm">No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <Badge variant={user.role === 'admin' ? 'purple' : user.role === 'seller' ? 'blue' : 'gray'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{dayjs(user.createdAt).format('MMM DD, YYYY')}</td>
                  <td className="p-4 flex items-center gap-2">
                    <select
                      className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => setUserToDelete(user)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Delete User" size="sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <HiExclamation className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete {userToDelete?.name}?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to permanently delete <strong>{userToDelete?.email}</strong>? This action cannot be undone and will erase all their data.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setUserToDelete(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500 border-transparent text-white" onClick={confirmDelete}>Delete User</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
