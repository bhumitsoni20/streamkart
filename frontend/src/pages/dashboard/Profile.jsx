import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = () => { toast.success('Profile updated!'); };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Avatar src={user?.avatar} name={user?.name} size="xl" />
          <div>
            <h2 className="text-gray-900 font-semibold text-lg">{user?.name || 'User'}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <Button variant="ghost" size="sm" className="mt-1 !text-indigo-600">Change photo</Button>
          </div>
        </div>
        <div className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" value={email} disabled className="!bg-gray-50" />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {/* Seller Account Upgrade */}
      {user?.role === 'user' && (
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Want to sell on Prime Net?</h3>
          <p className="text-indigo-700 text-sm mb-4">Upgrade your account to a seller profile to access the Seller Dashboard, manage inventory, and receive orders.</p>
          <Button 
            onClick={async () => {
              try {
                const { becomeSeller } = await import('../../services/auth.service');
                const res = await becomeSeller();
                useAuthStore.getState().setUser(res.data);
                toast.success('You are now a Seller!');
                window.location.href = '/seller'; // Force a full navigation to ensure sidebar updates
              } catch (err) {
                toast.error(err.message || 'Failed to upgrade');
              }
            }}
          >
            Upgrade to Seller Account
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
