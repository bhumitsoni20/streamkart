import NotificationCard from '../../components/cards/NotificationCard';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';

const Notifications = () => {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkAsRead();
  const markAllRead = useMarkAllAsRead();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()}>Mark all read</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="space-y-3">
          {data?.data?.map((n) => (
            <NotificationCard key={n._id} notification={n} onMarkRead={(id) => markRead.mutate(id)} />
          ))}
          {(!data?.data || data.data.length === 0) && <p className="text-gray-500 text-center py-12">No notifications</p>}
        </div>
      )}
    </div>
  );
};

export default Notifications;
