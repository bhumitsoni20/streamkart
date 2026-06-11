import NotificationCard from '../../components/cards/NotificationCard';

const Notifications = () => {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Notifications</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-gray-500 text-sm">No notifications yet. You'll receive alerts for orders, reviews, and system updates.</p>
      </div>
    </div>
  );
};

export default Notifications;
