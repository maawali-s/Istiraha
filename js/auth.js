/* ============================================================
 * auth.js — تسجيل الدخول والجلسة وكلمات المرور
 * ============================================================ */

const Auth = (() => {
  let currentUser = null;

  // استرجاع الجلسة المحفوظة عند بدء التشغيل
  async function restore() {
    const session = await Storage.getSession();
    if (session && session.user) {
      const users = await Storage.getUsers();
      if (users[session.user]) {
        currentUser = session.user;
        return currentUser;
      }
    }
    return null;
  }

  // تسجيل الدخول: التحقق من الاسم وكلمة المرور
  async function login(name, password) {
    const users = await Storage.getUsers();
    if (!users[name]) return { ok: false, error: 'الشريك غير موجود' };
    if (users[name].password !== password) {
      return { ok: false, error: 'كلمة المرور غير صحيحة' };
    }
    currentUser = name;
    await Storage.setSession({ user: name, at: Date.now() });
    return { ok: true, user: name };
  }

  async function logout() {
    currentUser = null;
    await Storage.clearSession();
  }

  function getCurrentUser() {
    return currentUser;
  }

  // تغيير كلمة المرور (يتطلب الكلمة الحالية)
  async function changePassword(oldPass, newPass) {
    if (!currentUser) return { ok: false, error: 'سجّل الدخول أولاً' };
    if (!newPass || newPass.length < 4) {
      return { ok: false, error: 'كلمة المرور يجب أن تكون 4 أحرف على الأقل' };
    }
    const users = await Storage.getUsers();
    if (users[currentUser].password !== oldPass) {
      return { ok: false, error: 'كلمة المرور الحالية غير صحيحة' };
    }
    users[currentUser].password = newPass;
    await Storage.setUsers(users);
    await Storage.addHistory({ type: 'password_change', actor: currentUser,
      text: `غيّر ${currentUser} كلمة المرور` });
    return { ok: true };
  }

  return { restore, login, logout, getCurrentUser, changePassword };
})();

window.Auth = Auth;
