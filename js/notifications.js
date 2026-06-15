/* ============================================================
 * notifications.js — توليد الإشعارات وإدارتها
 * ------------------------------------------------------------
 * أنواع الإشعارات:
 *  1) طلب تبادل وارد بانتظار ردّك.
 *  2) غداً يوم استراحتك.
 *  3) هذا الأسبوع أنت مسؤول الصيانة (أربعاء قادم خلال 7 أيام).
 * ============================================================ */

const Notifications = (() => {

  // بناء قائمة الإشعارات للمستخدم الحالي
  async function build(user) {
    if (!user) return [];
    const list = [];
    const settings = await Storage.getSettings();
    if (!settings.notificationsEnabled) return [];

    const overrides = await Storage.getOverrides();
    const exchanges = await Storage.getExchanges();

    // (1) طلبات التبادل الواردة المعلّقة
    exchanges
      .filter(x => x.status === 'pending' && x.to === user)
      .forEach(x => list.push({
        type: 'exchange',
        icon: '🔄',
        title: 'طلب تبادل جديد',
        text: `${x.from} يطلب تبادل يوم ${formatKey(x.date)}`,
        refId: x.id,
      }));

    // (2) غداً يوم استراحتك  / (3) الصيانة خلال الأسبوع
    const today = new Date();
    for (let offset = 0; offset <= 7; offset++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      const info = Calendar.dayInfo(d, overrides);

      if (offset === 1 && !info.isMaintenance && info.owner === user) {
        list.push({ type: 'rest', icon: '🌙', title: 'استراحتك غداً',
          text: `غداً (${formatKey(info.key)}) يوم استراحتك.` });
      }
      if (info.isMaintenance && info.owner === user) {
        const label = offset === 0 ? 'اليوم' : offset === 1 ? 'غداً' : `بعد ${offset} أيام`;
        list.push({ type: 'maint', icon: '🛠', title: 'مسؤولية صيانة',
          text: `صيانة ${label} (${formatKey(info.key)}) من مسؤوليتك.` });
      }
    }

    return list;
  }

  function formatKey(key) {
    const [y, m, d] = key.split('-');
    return `${d}/${m}`;
  }

  // إشعار المتصفح (اختياري، يتطلب إذن المستخدم)
  async function maybeBrowserNotify(title, body) {
    const settings = await Storage.getSettings();
    if (!settings.browserNotifications) return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }

  async function requestBrowserPermission() {
    if (!('Notification' in window)) return false;
    const res = await Notification.requestPermission();
    return res === 'granted';
  }

  return { build, maybeBrowserNotify, requestBrowserPermission, formatKey };
})();

window.Notifications = Notifications;
