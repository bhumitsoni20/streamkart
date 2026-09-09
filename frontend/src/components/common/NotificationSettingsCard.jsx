import { useState, useEffect } from 'react';
import { 
  HiBell, 
  HiOutlineShieldCheck, 
  HiOutlineChatAlt2, 
  HiOutlineCurrencyRupee, 
  HiOutlineShoppingBag,
  HiCheckCircle,
  HiExclamationCircle,
  HiOutlineSparkles,
  HiOutlineDeviceMobile
} from 'react-icons/hi';
import { 
  useNotificationSettings, 
  useUpdateNotificationSettings, 
  useSendTestNotification 
} from '../../hooks/useNotifications';
import { requestNotificationPermission, unregisterPushToken } from '../../firebase/messaging';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';

const NotificationSettingsCard = () => {
  const { data: settings, isLoading } = useNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();
  const testPushMutation = useSendTestNotification();

  const [browserPermission, setBrowserPermission] = useState('default');
  const [isProcessingToggle, setIsProcessingToggle] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
      // Auto-register FCM token with backend if permission is already granted in browser
      if (Notification.permission === 'granted') {
        requestNotificationPermission().catch((err) => {
          console.warn('[Push] Auto-registration check:', err);
        });
      }
    }
  }, []);

  const pushEnabled = settings?.pushEnabled ?? (browserPermission === 'granted');

  const handleMasterToggle = async () => {
    setIsProcessingToggle(true);
    try {
      if (!pushEnabled) {
        // Enable push: request browser permission & register token
        const res = await requestNotificationPermission();
        if (res.success) {
          setBrowserPermission('granted');
          await updateMutation.mutateAsync({ pushEnabled: true });
          toast.success('Push notifications enabled for this device!');
        } else if (res.permission === 'denied') {
          setBrowserPermission('denied');
          toast.error('Permission denied. Please enable notifications in your browser settings.');
        } else {
          toast.error(res.error || 'Failed to initialize push notifications.');
        }
      } else {
        // Disable push
        await unregisterPushToken();
        await updateMutation.mutateAsync({ pushEnabled: false });
        toast.success('Push notifications disabled for this device.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update push status');
    } finally {
      setIsProcessingToggle(false);
    }
  };

  const handleCategoryToggle = async (key) => {
    const currentVal = settings?.[key] ?? true;
    try {
      await updateMutation.mutateAsync({ [key]: !currentVal });
      toast.success('Preference updated');
    } catch (err) {
      toast.error('Failed to save preference');
    }
  };

  const handleSendTest = async () => {
    setIsProcessingToggle(true);
    try {
      // 1. Request or verify browser permission
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          toast.error('Please allow notification permissions in your browser.');
          return;
        }
        setBrowserPermission('granted');
      }

      // 2. Trigger immediate native Windows Action Center notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready
            .then((reg) => {
              reg.showNotification('StreamKart Push Active! 🚀', {
                body: 'Browser push notifications are successfully configured and working on this device.',
                icon: '/notification-icon.png',
                badge: '/notification-icon.png',
                tag: `test_${Date.now()}`,
                requireInteraction: true,
                renotify: true,
                data: { actionUrl: '/notifications' },
              });
            })
            .catch(() => {
              try {
                new Notification('StreamKart Push Active! 🚀', {
                  body: 'Browser push notifications are successfully configured and working on this device.',
                  icon: '/notification-icon.png',
                  requireInteraction: true,
                });
              } catch (e) {}
            });
        }
      }

      // 3. Attempt background FCM token sync
      requestNotificationPermission().catch((err) => {
        console.warn('[Push] Background FCM sync:', err);
      });

      // 4. Trigger backend notification endpoint
      await testPushMutation.mutateAsync();
      toast.success('Test notification sent! Check your Windows pop-up banner. 🚀');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to send test notification';
      toast.error(msg);
    } finally {
      setIsProcessingToggle(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 flex items-center justify-center min-h-[200px]">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#5B4BFF]/10 border border-[#5B4BFF]/20 flex items-center justify-center text-[#5B4BFF]">
            <HiBell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
              <span>Notification Preferences</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#5B4BFF] border border-[#C7D2FE]">
                Real-Time Push
              </span>
            </h3>
            <p className="text-[14px] text-[#64748B]">Manage device push alerts and individual category channels.</p>
          </div>
        </div>

        {/* Browser Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {browserPermission === 'granted' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <HiCheckCircle className="w-4 h-4 text-emerald-500" />
              Browser: Allowed
            </span>
          ) : browserPermission === 'denied' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <HiExclamationCircle className="w-4 h-4 text-rose-500" />
              Browser: Blocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <HiOutlineDeviceMobile className="w-4 h-4 text-amber-500" />
              Browser: Not Set
            </span>
          )}
        </div>
      </div>

      {/* Master Push Toggle */}
      <div className="py-6 border-b border-[#F1F5F9] flex items-center justify-between gap-4">
        <div>
          <h4 className="text-[15px] font-bold text-[#0F172A]">Desktop & Mobile Web Push</h4>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Receive instant alerts directly to this device when the browser is minimized or tab is in background.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMasterToggle}
          disabled={isProcessingToggle}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            pushEnabled ? 'bg-[#5B4BFF]' : 'bg-[#CBD5E1]'
          } ${isProcessingToggle ? 'opacity-50 cursor-wait' : ''}`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              pushEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Category Toggles */}
      <div className="py-6 space-y-4">
        <h5 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
          Notification Categories
        </h5>

        {/* Order Updates */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] hover:bg-white hover:border-[#E2E8F0] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5B4BFF]">
              <HiOutlineShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#0F172A] block">Order & Purchase Alerts</span>
              <span className="text-[12px] text-[#64748B]">New orders, credentials delivery, and progress updates</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCategoryToggle('orderUpdates')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              (settings?.orderUpdates ?? true) ? 'bg-[#5B4BFF]' : 'bg-[#CBD5E1]'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                (settings?.orderUpdates ?? true) ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] hover:bg-white hover:border-[#E2E8F0] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED]">
              <HiOutlineChatAlt2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#0F172A] block">Chat Messages</span>
              <span className="text-[12px] text-[#64748B]">Real-time message notifications from buyers and sellers</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCategoryToggle('chatMessages')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              (settings?.chatMessages ?? true) ? 'bg-[#5B4BFF]' : 'bg-[#CBD5E1]'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                (settings?.chatMessages ?? true) ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Payment Updates */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] hover:bg-white hover:border-[#E2E8F0] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <HiOutlineCurrencyRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#0F172A] block">Payment & Wallet Notifications</span>
              <span className="text-[12px] text-[#64748B]">Payment verifications, approvals, top-ups, and payouts</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCategoryToggle('paymentUpdates')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              (settings?.paymentUpdates ?? true) ? 'bg-[#5B4BFF]' : 'bg-[#CBD5E1]'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                (settings?.paymentUpdates ?? true) ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Account Alerts */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] hover:bg-white hover:border-[#E2E8F0] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <HiOutlineShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#0F172A] block">Account & Security Alerts</span>
              <span className="text-[12px] text-[#64748B]">Important status updates, verification status, and announcements</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCategoryToggle('accountAlerts')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              (settings?.accountAlerts ?? true) ? 'bg-[#5B4BFF]' : 'bg-[#CBD5E1]'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                (settings?.accountAlerts ?? true) ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Test Push Button */}
      <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[13px] text-[#64748B]">
          Want to test push delivery on this device?
        </p>
        <button
          onClick={handleSendTest}
          disabled={testPushMutation.isPending || browserPermission !== 'granted'}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-[13px] font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <HiOutlineSparkles className="w-4 h-4 text-[#5B4BFF]" />
          <span>{testPushMutation.isPending ? 'Sending...' : 'Send Test Notification'}</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsCard;
