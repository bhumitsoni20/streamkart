import NotificationCard from '../../components/cards/NotificationCard';
import Button from '../../components/ui/Button';
import { HiOutlineCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Notifications = () => {
  const handleMarkAllRead = () => {
    toast.success('All notifications marked as read');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <Button variant="secondary" size="sm" onClick={handleMarkAllRead} className="flex items-center gap-2">
          <HiOutlineCheck className="w-4 h-4" />
          Mark all as read
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">You're all caught up!</h3>
        <p className="text-gray-500">No new notifications. You'll receive alerts for orders, reviews, and system updates here.</p>
      </div>
    </div>
  );
};

export default Notifications;
