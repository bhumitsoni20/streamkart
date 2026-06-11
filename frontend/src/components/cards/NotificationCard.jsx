const typeIcons = { order: '📦', payment: '💳', system: '🔐', promotion: '⭐' };
const typeColors = { order: 'bg-purple-100', payment: 'bg-green-100', system: 'bg-blue-100', promotion: 'bg-amber-100' };

const NotificationCard = ({ notification, onMarkRead }) => {
  return (
    <div
      onClick={() => !notification.isRead && onMarkRead?.(notification._id)}
      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        notification.isRead ? 'bg-white border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm'
      }`}
    >
      <div className={`h-10 w-10 rounded-xl ${typeColors[notification.type] || 'bg-gray-100'} flex items-center justify-center flex-shrink-0 text-lg`}>
        {typeIcons[notification.type] || '🔔'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-gray-900 font-semibold text-sm">{notification.title}</h4>
          {!notification.isRead && <span className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />}
        </div>
        <p className="text-gray-500 text-sm">{notification.message}</p>
        <p className="text-gray-400 text-xs mt-1.5 uppercase tracking-wider font-medium">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
