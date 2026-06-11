import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { updateProfile } from '../../services/auth.service';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({ name, phone });
      setUser(res.data);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-8">
          <Avatar src={user?.avatar} name={user?.name} size="xl" />
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <Badge variant="primary" className="mt-2">{user?.role}</Badge>
          </div>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
          <Input label="Email" value={user?.email || ''} disabled />
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
