import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBell, HiX, HiSparkles } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import { requestNotificationPermission } from '../../firebase/messaging';
import toast from 'react-hot-toast';

const EnablePushPrompt = () => {
  const { isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsVisible(false);
      return;
    }

    // Check if Notification API is available in browser
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    // If permission is already granted or denied, don't show the floating prompt
    if (Notification.permission !== 'default') {
      return;
    }

    // Check if user dismissed it in this session
    const dismissed = sessionStorage.getItem('streamkart_push_prompt_dismissed');
    if (dismissed) {
      return;
    }

    // Show prompt after a slight delay (3 seconds) for a smooth UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const handleEnable = async () => {
    setIsEnabling(true);
    try {
      const result = await requestNotificationPermission();
      if (result.success) {
        toast.success('Push notifications enabled successfully! 🔔');
        setIsVisible(false);
      } else if (result.permission === 'denied') {
        toast.error('Notification permission was blocked in browser settings. Please allow notifications in your browser address bar.');
        setIsVisible(false);
      } else {
        toast.error(result.error || 'Could not register push token. Please check your network or VAPID key in .env');
        setIsVisible(false);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to enable notifications.');
      setIsVisible(false);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('streamkart_push_prompt_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full mx-4 sm:mx-0 bg-white border border-[#E2E8F0] rounded-[24px] p-5 shadow-[0_12px_40px_rgba(91,75,255,0.15)] overflow-hidden"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5B4BFF] to-[#7C3AED] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#5B4BFF]/20">
            <HiBell className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#5B4BFF] mb-0.5">
              <HiSparkles className="w-3.5 h-3.5" />
              <span>Stay Updated</span>
            </div>
            <h4 className="text-[15px] font-bold text-[#0F172A] leading-snug">
              Enable Push Notifications
            </h4>
            <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">
              Get instant alerts for new orders, customer chats, and payment verifications on this device.
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 pt-3.5 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
          <button
            onClick={handleDismiss}
            className="px-3.5 py-2 text-[13px] font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-all cursor-pointer"
          >
            Not Now
          </button>
          <button
            onClick={handleEnable}
            disabled={isEnabling}
            className="px-4 py-2 bg-[#5B4BFF] hover:bg-[#4838FF] text-white text-[13px] font-bold rounded-xl shadow-sm shadow-[#5B4BFF]/30 transition-all cursor-pointer disabled:opacity-60"
          >
            {isEnabling ? 'Enabling...' : 'Enable Notifications'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnablePushPrompt;
