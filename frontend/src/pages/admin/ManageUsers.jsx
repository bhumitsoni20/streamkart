import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUsers, 
  updateUserRole, 
  deleteUser, 
  verifySeller, 
  unverifySeller 
} from '../../services/admin.service';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import VerifiedBadge from '../../components/common/VerifiedBadge';
import { 
  HiTrash, 
  HiExclamation, 
  HiSearch, 
  HiUsers, 
  HiShieldCheck, 
  HiShoppingBag,
  HiUser,
  HiCheckCircle,
  HiXCircle,
  HiCheck,
  HiBadgeCheck,
  HiFilter
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [userToDelete, setUserToDelete] = useState(null);
  const [sellerToVerify, setSellerToVerify] = useState(null);
  const [sellerToUnverify, setSellerToUnverify] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'user' | 'seller' | 'admin'
  const [verificationFilter, setVerificationFilter] = useState('all'); // 'all' | 'verified' | 'unverified'

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const response = await getUsers(1, 100);
      return response.data || [];
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, newRole }) => updateUserRole(userId, newRole),
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: () => toast.error('Failed to update user role'),
  });

  const verifyMutation = useMutation({
    mutationFn: (sellerId) => verifySeller(sellerId),
    onMutate: async (sellerId) => {
      await queryClient.cancelQueries({ queryKey: ['adminUsers'] });
      const previousUsers = queryClient.getQueryData(['adminUsers']);
      
      // Optimistic update
      queryClient.setQueryData(['adminUsers'], (old) => 
        old?.map(u => u._id === sellerId ? { ...u, isVerified: true, verificationSource: 'admin' } : u)
      );
      setSellerToVerify(null);
      return { previousUsers };
    },
    onError: (err, sellerId, context) => {
      queryClient.setQueryData(['adminUsers'], context.previousUsers);
      toast.error(err.message || 'Failed to verify seller');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onSuccess: () => toast.success('Seller marked as verified successfully!'),
  });

  const unverifyMutation = useMutation({
    mutationFn: (sellerId) => unverifySeller(sellerId),
    onMutate: async (sellerId) => {
      await queryClient.cancelQueries({ queryKey: ['adminUsers'] });
      const previousUsers = queryClient.getQueryData(['adminUsers']);
      
      // Optimistic update
      queryClient.setQueryData(['adminUsers'], (old) => 
        old?.map(u => u._id === sellerId ? { ...u, isVerified: false, verificationSource: 'none' } : u)
      );
      setSellerToUnverify(null);
      return { previousUsers };
    },
    onError: (err, sellerId, context) => {
      queryClient.setQueryData(['adminUsers'], context.previousUsers);
      toast.error(err.message || 'Failed to remove verification');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onSuccess: () => toast.success('Seller verification removed successfully.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onMutate: async (deletedUserId) => {
      await queryClient.cancelQueries({ queryKey: ['adminUsers'] });
      const previousUsers = queryClient.getQueryData(['adminUsers']);
      
      queryClient.setQueryData(['adminUsers'], (old) => old?.filter(u => u._id !== deletedUserId));
      setUserToDelete(null);
      return { previousUsers };
    },
    onError: (err, deletedUserId, context) => {
      queryClient.setQueryData(['adminUsers'], context.previousUsers);
      toast.error(err.message || 'Failed to delete user');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onSuccess: () => toast.success('User deleted successfully'),
  });

  const handleRoleChange = (userId, newRole) => {
    roleMutation.mutate({ userId, newRole });
  };

  const confirmVerify = () => {
    if (!sellerToVerify) return;
    verifyMutation.mutate(sellerToVerify._id);
  };

  const confirmUnverify = () => {
    if (!sellerToUnverify) return;
    unverifyMutation.mutate(sellerToUnverify._id);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    deleteMutation.mutate(userToDelete._id);
  };

  const filteredUsers = (users || []).filter(user => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = 
      user.name?.toString().toLowerCase().includes(searchStr) || 
      user.email?.toString().toLowerCase().includes(searchStr);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    const isUserVerified = Boolean(user.isVerified || (user.totalSales || 0) >= 5);
    const matchesVerification = 
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && isUserVerified) ||
      (verificationFilter === 'unverified' && !isUserVerified);

    return matchesSearch && matchesRole && matchesVerification;
  });

  const counts = {
    all: users.length,
    user: users.filter(u => u.role === 'user').length,
    seller: users.filter(u => u.role === 'seller').length,
    admin: users.filter(u => u.role === 'admin').length,
    verifiedSellers: users.filter(u => u.role === 'seller' && (u.isVerified || (u.totalSales || 0) >= 5)).length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-[24px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#0F172A] tracking-[-0.03em]">
              User Directory
            </h1>
            <span className="text-[12px] font-bold text-[#5B4BFF] bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              {users.length} Total
            </span>
          </div>
          <p className="text-[#64748B] text-[14.5px]">
            Manage platform members, merchant verification tags, permission roles, and account security.
          </p>
        </div>

        <div className="relative w-full sm:w-[320px]">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] py-2.5 pl-11 pr-4 text-[14px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#5B4BFF] focus:ring-4 focus:ring-[#5B4BFF]/10 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Role & Verification Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Role Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Accounts', icon: HiUsers, count: counts.all },
            { id: 'user', label: 'Buyers', icon: HiUser, count: counts.user },
            { id: 'seller', label: 'Merchants', icon: HiShoppingBag, count: counts.seller },
            { id: 'admin', label: 'Admins', icon: HiShieldCheck, count: counts.admin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-[#5B4BFF] text-white shadow-sm shadow-[#5B4BFF]/30'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                roleFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#64748B]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Verification Status Filter */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1 rounded-[12px] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
            <HiFilter className="w-3.5 h-3.5" />
            <span>Badge:</span>
          </div>
          {[
            { id: 'all', label: 'All' },
            { id: 'verified', label: 'Verified' },
            { id: 'unverified', label: 'Not Verified' },
          ].map((vTab) => (
            <button
              key={vTab.id}
              onClick={() => setVerificationFilter(vTab.id)}
              className={`px-3 py-1.5 rounded-[9px] text-[12px] font-bold transition-all cursor-pointer ${
                verificationFilter === vTab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              {vTab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-[#F1F5F9] text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] bg-[#F8FAFC]">
                <th className="p-5 pl-7">Member Info</th>
                <th className="p-5">Email Address</th>
                <th className="p-5">Current Role</th>
                <th className="p-5">Verification Status</th>
                <th className="p-5">Registration Date</th>
                <th className="p-5 pr-7 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-[#94A3B8] font-medium animate-pulse">
                    Loading subscriber records...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-[#64748B] font-medium bg-[#F8FAFC]">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isUserVerified = Boolean(user.isVerified || (user.totalSales || 0) >= 5);
                  const isSeller = user.role === 'seller';

                  return (
                    <tr key={user._id} className="hover:bg-indigo-50/20 transition-colors group">
                      <td className="p-5 pl-7">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#5B4BFF]/15 to-[#7C3AED]/15 border border-[#5B4BFF]/30 text-[#5B4BFF] flex items-center justify-center font-extrabold text-[15px] shadow-sm flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[14.5px] text-[#0F172A] group-hover:text-[#5B4BFF] transition-colors">
                                {user.name || 'Anonymous User'}
                              </p>
                              {isUserVerified && (
                                <VerifiedBadge seller={user} size="xs" showLabel={false} />
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-[#94A3B8]">
                              ID: {user._id?.substring(0, 10)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-5 text-[13.5px] font-medium text-[#475569]">
                        {user.email}
                      </td>

                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider border ${
                          user.role === 'admin' 
                            ? 'bg-purple-50 text-[#7C3AED] border-purple-200' 
                            : user.role === 'seller'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.role === 'admin' ? 'bg-[#7C3AED]' : user.role === 'seller' ? 'bg-emerald-600' : 'bg-blue-600'
                          }`} />
                          {user.role}
                        </span>
                      </td>

                      {/* Verification Status & Admin Override Actions */}
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          {isUserVerified ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                <HiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Verified</span>
                                {user.verificationSource === 'admin' ? (
                                  <span className="text-[9px] px-1 py-0.2 bg-emerald-200/60 text-emerald-800 rounded font-black uppercase">Admin</span>
                                ) : (
                                  <span className="text-[9px] px-1 py-0.2 bg-slate-200/80 text-slate-700 rounded font-black uppercase">Auto</span>
                                )}
                              </span>

                              <button
                                onClick={() => setSellerToUnverify(user)}
                                className="px-2.5 py-1 rounded-[8px] text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-all cursor-pointer whitespace-nowrap"
                                title="Remove verification badge"
                                disabled={unverifyMutation.isPending}
                              >
                                Remove Verification
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                Not Verified
                              </span>

                              <button
                                onClick={() => setSellerToVerify(user)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[11px] font-bold text-[#5B4BFF] hover:text-white bg-[#5B4BFF]/10 hover:bg-[#5B4BFF] border border-[#5B4BFF]/20 hover:border-[#5B4BFF] transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                                title="Mark as Verified Seller"
                                disabled={verifyMutation.isPending}
                              >
                                <HiCheck className="w-3 h-3" />
                                <span>Verify Seller</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-5 text-[13px] font-medium text-[#64748B]">
                        {dayjs(user.createdAt).format('MMM DD, YYYY')}
                      </td>

                      <td className="p-5 pr-7">
                        <div className="flex items-center justify-end gap-3">
                          <div className="relative w-[120px]">
                            <select
                              className="w-full appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3 py-2 pr-8 text-[12px] font-bold text-[#334155] focus:outline-none focus:ring-[3px] focus:ring-[#5B4BFF]/10 focus:border-[#5B4BFF] focus:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              disabled={roleMutation.isPending}
                            >
                              <option value="user">User</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Admin</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-[#94A3B8]">
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                          </div>
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => setUserToDelete(user)}
                              className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-rose-50 rounded-[10px] border border-transparent hover:border-rose-100 transition-all disabled:opacity-50 cursor-pointer"
                              title="Delete User"
                              disabled={deleteMutation.isPending}
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Seller Confirmation Modal */}
      <Modal isOpen={!!sellerToVerify} onClose={() => setSellerToVerify(null)} title="Verify Seller?">
        <div className="flex flex-col items-center text-center p-3">
          <div className="w-16 h-16 rounded-[20px] bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5 text-emerald-600 shadow-sm">
            <HiCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-[20px] font-extrabold text-[#0F172A] mb-2">
            Verify Seller?
          </h3>
          <p className="text-[#64748B] text-[14.5px] mb-7 leading-relaxed max-w-md">
            Are you sure you want to mark this seller as verified? This will immediately grant <strong className="text-[#0F172A]">{sellerToVerify?.name || sellerToVerify?.email}</strong> the public Verified badge across the marketplace.
          </p>
          <div className="flex gap-3 w-full">
            <Button 
              variant="secondary" 
              size="lg" 
              className="flex-1 border-[#E2E8F0] font-bold" 
              onClick={() => setSellerToVerify(null)}
            >
              Cancel
            </Button>
            <Button 
              size="lg" 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20" 
              onClick={confirmVerify}
              isLoading={verifyMutation.isPending}
            >
              Verify Seller
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Verification Confirmation Modal */}
      <Modal isOpen={!!sellerToUnverify} onClose={() => setSellerToUnverify(null)} title="Remove Verification?">
        <div className="flex flex-col items-center text-center p-3">
          <div className="w-16 h-16 rounded-[20px] bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 text-amber-600 shadow-sm">
            <HiExclamation className="w-8 h-8" />
          </div>
          <h3 className="text-[20px] font-extrabold text-[#0F172A] mb-2">
            Remove Verification?
          </h3>
          <p className="text-[#64748B] text-[14.5px] mb-7 leading-relaxed max-w-md">
            This will remove the Verified badge from this seller (<strong className="text-[#0F172A]">{sellerToUnverify?.name || sellerToUnverify?.email}</strong>).
          </p>
          <div className="flex gap-3 w-full">
            <Button 
              variant="secondary" 
              size="lg" 
              className="flex-1 border-[#E2E8F0] font-bold" 
              onClick={() => setSellerToUnverify(null)}
            >
              Cancel
            </Button>
            <Button 
              size="lg" 
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20" 
              onClick={confirmUnverify}
              isLoading={unverifyMutation.isPending}
            >
              Remove Verification
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Delete Subscriber Account">
        <div className="flex flex-col items-center text-center p-3">
          <div className="w-16 h-16 rounded-[20px] bg-rose-50 border border-rose-200 flex items-center justify-center mb-5 text-rose-500 shadow-sm">
            <HiExclamation className="w-8 h-8" />
          </div>
          <h3 className="text-[20px] font-extrabold text-[#0F172A] mb-2">
            Delete {userToDelete?.name || 'User'}?
          </h3>
          <p className="text-[#64748B] text-[14.5px] mb-7 leading-relaxed max-w-md">
            Are you sure you want to permanently delete <strong className="text-[#0F172A]">{userToDelete?.email}</strong>? This action will immediately revoke platform access and remove their saved credentials.
          </p>
          <div className="flex gap-3 w-full">
            <Button 
              variant="secondary" 
              size="lg" 
              className="flex-1 border-[#E2E8F0] font-bold" 
              onClick={() => setUserToDelete(null)}
            >
              Cancel
            </Button>
            <Button 
              size="lg" 
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20" 
              onClick={confirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;

