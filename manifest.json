/* ============================================================
 * storage.js — طبقة تخزين موحّدة (Data Access Layer)
 * ------------------------------------------------------------
 * الهدف: عزل بقية التطبيق عن مصدر البيانات.
 * حالياً نستخدم localStorage، لكن كل الدوال async (تُعيد Promise)
 * حتى يمكن استبدال المصدر مستقبلاً بـ Firebase / Supabase / REST API
 * دون تغيير أي سطر في باقي الملفات.
 *
 * للترقية لقاعدة بيانات سحابية لاحقاً: غيّر فقط جسم الدوال
 * read() / write() / removeKey() لتنادي الـ Backend، وابقِ التواقيع كما هي.
 * ============================================================ */

const Storage = (() => {
  const PREFIX = 'estraha_v1_';

  // ---- محرك التخزين منخفض المستوى (قابل للاستبدال) -------------------
  async function read(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.error('Storage.read', key, e);
      return fallback;
    }
  }

  async function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.write', key, e);
      return false;
    }
  }

  async function removeKey(key) {
    localStorage.removeItem(PREFIX + key);
    return true;
  }

  // ---- القيم الافتراضية عند أول تشغيل --------------------------------
  // ملاحظة: ترتيب الشركاء يحدّد دورة المناوبة الحسابية. لا تغيّره عشوائياً.
  const DEFAULT_PARTNERS = ['جلند', 'سعيد', 'سالم'];

  const DEFAULT_USERS = {
    'جلند': { password: 'Juland2026', color: '#C0533F' },
    'سعيد': { password: 'Said2026',   color: '#D98A2B' },
    'سالم': { password: 'Salim2026',  color: '#2E7D8A' },
  };

  const DEFAULT_SETTINGS = {
    notificationsEnabled: true,
    browserNotifications: false,
  };

  // ---- التهيئة (تُنفّذ مرة واحدة) ------------------------------------
  async function init() {
    if (await read('partners') === null) await write('partners', DEFAULT_PARTNERS);
    if (await read('users') === null)    await write('users', DEFAULT_USERS);
    if (await read('settings') === null) await write('settings', DEFAULT_SETTINGS);
    if (await read('exchanges') === null) await write('exchanges', []);
    if (await read('overrides') === null) await write('overrides', {});
    if (await read('history') === null)   await write('history', []);
  }

  // ---- واجهات عالية المستوى ------------------------------------------
  const getPartners  = () => read('partners', DEFAULT_PARTNERS);
  const getUsers     = () => read('users', DEFAULT_USERS);
  const setUsers     = (u) => write('users', u);
  const getSettings  = () => read('settings', DEFAULT_SETTINGS);
  const setSettings  = (s) => write('settings', s);
  const getExchanges = () => read('exchanges', []);
  const setExchanges = (x) => write('exchanges', x);
  const getOverrides = () => read('overrides', {});
  const setOverrides = (o) => write('overrides', o);
  const getHistory   = () => read('history', []);
  const setHistory   = (h) => write('history', h);

  const getSession   = () => read('session', null);
  const setSession   = (s) => write('session', s);
  const clearSession = () => removeKey('session');

  // إضافة سطر للسجل التاريخي
  async function addHistory(entry) {
    const hist = await getHistory();
    hist.unshift({ id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
                   timestamp: new Date().toISOString(), ...entry });
    await setHistory(hist);
    return hist;
  }

  // تصدير كل البيانات ككائن واحد
  async function exportAll() {
    return {
      version: 'estraha_v1',
      exportedAt: new Date().toISOString(),
      users: await getUsers(),
      settings: await getSettings(),
      exchanges: await getExchanges(),
      overrides: await getOverrides(),
      history: await getHistory(),
      partners: await getPartners(),
    };
  }

  // استيراد البيانات من كائن
  async function importAll(data) {
    if (!data || data.version !== 'estraha_v1') {
      throw new Error('صيغة الملف غير متوافقة');
    }
    if (data.partners)  await write('partners', data.partners);
    if (data.users)     await setUsers(data.users);
    if (data.settings)  await setSettings(data.settings);
    if (data.exchanges) await setExchanges(data.exchanges);
    if (data.overrides) await setOverrides(data.overrides);
    if (data.history)   await setHistory(data.history);
    return true;
  }

  return {
    init,
    getPartners,
    getUsers, setUsers,
    getSettings, setSettings,
    getExchanges, setExchanges,
    getOverrides, setOverrides,
    getHistory, setHistory, addHistory,
    getSession, setSession, clearSession,
    exportAll, importAll,
    DEFAULT_USERS, DEFAULT_PARTNERS,
  };
})();

window.Storage = Storage;
