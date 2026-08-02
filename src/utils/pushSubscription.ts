export const checkPushSubscription = (): boolean => {
  if (typeof window === 'undefined') return false;

  // 1. Check localStorage flags
  if (
    localStorage.getItem('norcet_subscribed_push') === 'true' ||
    localStorage.getItem('user_subscribed_notifications') === 'true'
  ) {
    return true;
  }

  // 2. Check browser Notification permission
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    return true;
  }

  // 3. Check OneSignal PushSubscription
  const OneSignal = (window as any).OneSignal;
  if (OneSignal?.User?.PushSubscription?.optedIn) {
    return true;
  }

  return false;
};

export const subscribeToPushNotifications = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  try {
    const OneSignal = (window as any).OneSignal;
    if (OneSignal?.User?.PushSubscription) {
      await OneSignal.User.PushSubscription.optIn();
    } else if (typeof Notification !== 'undefined') {
      await Notification.requestPermission();
    }

    localStorage.setItem('norcet_subscribed_push', 'true');
    localStorage.setItem('user_subscribed_notifications', 'true');
    return true;
  } catch (err) {
    console.error('Push notification subscription error:', err);
    localStorage.setItem('norcet_subscribed_push', 'true');
    localStorage.setItem('user_subscribed_notifications', 'true');
    return true;
  }
};
