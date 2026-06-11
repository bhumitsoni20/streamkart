import { HiBell } from 'react-icons/hi';

const typeIcons = {
  order: '📦',
  payment: '💳',
  system: '⚙️',
  promotion: '🎉',
};

const NotificationCard = ({ notification, onMarkRead }) => {
  return (
    <div
      onClick={() => !notification.isRead && onMarkRead?.(notification._id)}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        notification.isRead
          ? 'bg-gray-900/40 border-white/5 opacity-60'
          : 'bg-gray-900/80 border-white/10 hover:border-blue-500/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{typeIcons[notification.type] || '🔔'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-medium text-sm">{notification.title}</h4>
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-gray-400 text-sm mt-0.5">{notification.message}</p>
          <p className="text-gray-600 text-xs mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
