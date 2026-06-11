import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const ManageUsers = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Manage Users</h1>
      <div className="bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/10 text-left">
            <th className="p-4 text-gray-500 text-sm font-medium">Name</th>
            <th className="p-4 text-gray-500 text-sm font-medium">Email</th>
            <th className="p-4 text-gray-500 text-sm font-medium">Role</th>
            <th className="p-4 text-gray-500 text-sm font-medium">Joined</th>
            <th className="p-4 text-gray-500 text-sm font-medium">Actions</th>
          </tr></thead>
          <tbody>
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Connect your database to manage users</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
