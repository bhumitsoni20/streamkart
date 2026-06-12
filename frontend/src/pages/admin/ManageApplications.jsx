import { useState, useEffect } from 'react';
import { apiGet, apiPut } from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { HiCheck, HiX } from 'react-icons/hi';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await apiGet('/admin/applications');
      setApplications(res.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiPut(`/admin/applications/${id}/status`, { status: newStatus });
      toast.success(`Application ${newStatus}!`);
      fetchApplications();
    } catch (error) {
      toast.error(error.message || 'Failed to update application');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading applications...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Seller Applications</h1>
          <p className="text-gray-500 text-sm">Review and approve requests to become a seller.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Applicant</th>
                <th className="p-4">Business</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No applications found.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="text-gray-900 font-medium text-sm">{app.fullName}</p>
                      <p className="text-gray-400 text-xs">{app.email}</p>
                      <p className="text-gray-400 text-xs">{app.phone}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900 font-medium text-sm">{app.businessName}</p>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-gray-600 text-sm truncate" title={app.description}>{app.description}</p>
                      {app.additionalInfo && (
                        <p className="text-gray-400 text-xs truncate" title={app.additionalInfo}>{app.additionalInfo}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant={app.status === 'approved' ? 'active' : app.status === 'rejected' ? 'inactive' : 'pending'}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'pending' && (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => handleStatusChange(app._id, 'approved')} className="!text-green-600 !bg-green-50 hover:!bg-green-100 border-none">
                              <HiCheck className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => handleStatusChange(app._id, 'rejected')} className="!text-red-600 !bg-red-50 hover:!bg-red-100 border-none">
                              <HiX className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {app.status !== 'pending' && (
                           <span className="text-gray-400 text-xs italic">Reviewed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
