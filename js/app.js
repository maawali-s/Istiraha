/* ============================================================
 * app.js — المتحكّم الرئيسي وربط كل الوحدات
 * ============================================================ */

const App = (() => {
  let displayDate = new Date();
  const realToday = new Date();
  let users = {};
  let partners = [];
  let settings = {};
  let visibleUsers = {};
  let activeView = 'calendar';
  let pendingDay = null; // اليوم المختار في نافذة التبادل

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ---------- التهيئة ----------------------------------------------------
  async function start() {
    await Storage.init();
    partners = await Storage.getPartners();
    Calendar.setPartners(partners);
    users = await Storage.getUsers();
    settings = await Storage.getSettings();
    partners.forEach(p => visibleUsers[p] = true);

    applyUserColors();
    bindGlobalEvents();

    const restored = await Auth.restore();
    if (restored) enterApp();
    else showLogin();
  }

  // حقن ألوان الشركاء كمتغيرات CSS
  function applyUserColors() {
    const root = document.documentElement;
    partners.forEach(p => {
      root.style.setProperty(`--c-${slug(p)}`, users[p].color);
    });
  }
  function slug(name) {
    return partners.indexOf(name); // فهرس مستقر للأسماء العربية
  }

  // ---------- شاشة الدخول ------------------------------------------------
  function showLogin() {
    $('#loginScreen').classList.add('show');
    $('#appShell').classList.remove('show');
    const sel = $('#loginPartner');
    sel.innerHTML = partners.map(p => `<option value="${p}">${p}</option>`).join('');
    $('#loginError').textContent = '';
    $('#loginPassword').value = '';
  }

  async function doLogin() {
    const name = $('#loginPartner').value;
    const pass = $('#loginPassword').value;
    const res = await Auth.login(name, pass);
    if (!res.ok) { $('#loginError').textContent = res.error; return; }
    enterApp();
  }

  function enterApp() {
    $('#loginScreen').classList.remove('show');
    $('#appShell').classList.add('show');
    $('#currentUserName').textContent = Auth.getCurrentUser();
    switchView('calendar');
    refreshAll();
  }

  async function doLogout() {
    await Auth.logout();
    showLogin();
  }

  // ---------- التنقل بين الصفحات ----------------------------------------
  function switchView(view) {
    activeView = view;
    $$('.view').forEach(v => v.classList.remove('view--active'));
    $(`#view-${view}`).classList.add('view--active');
    $$('.tab').forEach(t => t.classList.toggle('tab--active', t.dataset.view === view));
    if (view === 'calendar') renderCalendar();
    if (view === 'dashboard') renderDashboard();
    if (view === 'history') renderHistory();
    if (view === 'settings') renderSettings();
  }

  async function refreshAll() {
    users = await Storage.getUsers();
    settings = await Storage.getSettings();
    await renderHero();
    await renderNotifications();
    if (activeView === 'calendar') renderCalendar();
    if (activeView === 'dashboard') renderDashboard();
    if (activeView === 'history') renderHistory();
  }

  // ---------- البانر العلوي: من له الاستراحة اليوم ----------------------
  async function renderHero() {
    const overrides = await Storage.getOverrides();
    const info = Calendar.dayInfo(realToday, overrides);
    const color = users[info.owner].color;
    $('#heroOwner').textContent = info.owner;
    $('#heroDate').textContent = new Intl.DateTimeFormat('ar', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(realToday);
    $('#heroLabel').textContent = info.isMaintenance ? 'مسؤول الصيانة اليوم' : 'صاحب الاستراحة اليوم';
    const hero = $('#hero');
    hero.style.setProperty('--hero-accent', info.isMaintenance ? 'var(--gold)' : color);
    $('#heroBadge').textContent = info.isMaintenance ? '🛠 يوم صيانة' : '🌙 يوم استراحة';
    $('#heroBadge').classList.toggle('hero-badge--maint', info.isMaintenance);
  }

  // ---------- التقويم -----------------------------------------------------
  async function renderCalendar() {
    const overrides = await Storage.getOverrides();
    $('#currentMonthYear').textContent = new Intl.DateTimeFormat('ar', {
      month: 'long', year: 'numeric'
    }).format(displayDate);

    Calendar.renderMonthGrid($('#calendarGrid'), displayDate, {
      overrides, users, visibleUsers, realToday,
      onDayClick: openExchangeModal,
    });
    renderVisibilityFilters();
  }

  function renderVisibilityFilters() {
    const wrap = $('#filters');
    wrap.innerHTML = partners.map(p => `
      <label class="chip" style="--chip:${users[p].color}">
        <input type="checkbox" data-partner="${p}" ${visibleUsers[p] ? 'checked' : ''}>
        <span class="chip-dot"></span>${p}
      </label>`).join('');
    wrap.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('change', e => {
        visibleUsers[e.target.dataset.partner] = e.target.checked;
        renderCalendar();
      });
    });
  }

  function changeMonth(diff) {
    displayDate.setMonth(displayDate.getMonth() + diff);
    renderCalendar();
  }
  function goToToday() { displayDate = new Date(); renderCalendar(); }

  // ---------- نافذة التبادل ----------------------------------------------
  function openExchangeModal(info) {
    const me = Auth.getCurrentUser();
    pendingDay = info;
    const dateLabel = new Intl.DateTimeFormat('ar', {
      weekday: 'long', day: 'numeric', month: 'long'
    }).format(info.date);
    $('#modalDate').textContent = dateLabel;
    $('#modalOwner').textContent = info.owner;
    $('#modalOwner').style.color = users[info.owner].color;

    // إن كان اليوم لي: أعطيه لشريك آخر. إن كان لغيري: أطلب أخذه.
    const targets = info.owner === me ? partners.filter(p => p !== me) : [info.owner];
    $('#modalDirection').textContent = info.owner === me
      ? 'أنت صاحب هذا اليوم — اختر شريكاً لتسليمه إليه:'
      : `هذا اليوم لـ ${info.owner} — أرسل طلباً لأخذه:`;

    $('#exchangeWith').innerHTML = targets.map(p => `<option value="${p}">${p}</option>`).join('');
    $('#modalOverlay').classList.add('show');
    $('#exchangeModal').classList.add('show');
  }

  function closeModal() {
    $('#modalOverlay').classList.remove('show');
    $('#exchangeModal').classList.remove('show');
    pendingDay = null;
  }

  async function sendRequest() {
    const me = Auth.getCurrentUser();
    const info = pendingDay;
    const other = $('#exchangeWith').value;
    // newOwner = من سيملك اليوم إذا قُبل الطلب
    const newOwner = info.owner === me ? other : me;
    // approver = من سيوافق (الطرف الآخر)
    const approver = other;

    const exchanges = await Storage.getExchanges();
    exchanges.push({
      id: 'ex-' + Date.now(),
      date: info.key,
      from: me,
      to: approver,
      newOwner,
      previousOwner: info.owner,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    await Storage.setExchanges(exchanges);
    await Storage.addHistory({ type: 'exchange_request', actor: me,
      text: `${me} طلب تبادل يوم ${Notifications.formatKey(info.key)} مع ${approver}` });

    Notifications.maybeBrowserNotify('طلب تبادل', `${me} يطلب تبادل يوم ${Notifications.formatKey(info.key)}`);
    closeModal();
    toast('تم إرسال طلب التبادل');
    refreshAll();
  }

  // ---------- مركز الإشعارات ---------------------------------------------
  async function renderNotifications() {
    const me = Auth.getCurrentUser();
    const list = await Notifications.build(me);
    $('#notifCount').textContent = list.length;
    $('#notifCount').style.display = list.length ? 'flex' : 'none';

    const body = $('#notifList');
    if (!list.length) {
      body.innerHTML = `<p class="empty">لا توجد إشعارات حالياً.</p>`;
      return;
    }
    body.innerHTML = list.map(n => {
      const actions = n.type === 'exchange'
        ? `<div class="notif-actions">
             <button class="btn btn-accept" data-accept="${n.refId}">قبول</button>
             <button class="btn btn-reject" data-reject="${n.refId}">رفض</button>
           </div>` : '';
      return `<div class="notif-item">
                <span class="notif-icon">${n.icon}</span>
                <div class="notif-body"><b>${n.title}</b><span>${n.text}</span>${actions}</div>
              </div>`;
    }).join('');

    body.querySelectorAll('[data-accept]').forEach(b =>
      b.addEventListener('click', () => respondExchange(b.dataset.accept, true)));
    body.querySelectorAll('[data-reject]').forEach(b =>
      b.addEventListener('click', () => respondExchange(b.dataset.reject, false)));
  }

  async function respondExchange(id, accepted) {
    const exchanges = await Storage.getExchanges();
    const ex = exchanges.find(x => x.id === id);
    if (!ex || ex.status !== 'pending') return;
    ex.status = accepted ? 'accepted' : 'rejected';
    ex.resolvedAt = new Date().toISOString();
    await Storage.setExchanges(exchanges);

    if (accepted) {
      const overrides = await Storage.getOverrides();
      overrides[ex.date] = ex.newOwner;
      await Storage.setOverrides(overrides);
      await Storage.addHistory({ type: 'exchange_accepted', actor: ex.to,
        text: `قُبل تبادل يوم ${Notifications.formatKey(ex.date)} — أصبح لـ ${ex.newOwner}` });
      toast('تم قبول التبادل وتحديث الجدول');
    } else {
      await Storage.addHistory({ type: 'exchange_rejected', actor: ex.to,
        text: `رُفض طلب تبادل يوم ${Notifications.formatKey(ex.date)}` });
      toast('تم رفض الطلب');
    }
    refreshAll();
  }

  // ---------- لوحة التحكم (Dashboard) ------------------------------------
  async function renderDashboard() {
    const overrides = await Storage.getOverrides();
    const y = displayDate.getFullYear();
    const m = displayDate.getMonth();
    const mStats = Calendar.monthStats(y, m, overrides);
    const yStats = Calendar.yearStats(y, overrides);

    $('#dashMonthLabel').textContent = new Intl.DateTimeFormat('ar', { month: 'long', year: 'numeric' }).format(displayDate);
    $('#dashYearLabel').textContent = y;

    // بطاقات ملخّص لكل شريك (الشهر)
    $('#dashCards').innerHTML = partners.map(p => `
      <div class="stat-card" style="--c:${users[p].color}">
        <span class="stat-name">${p}</span>
        <span class="stat-big">${mStats.rest[p]}</span>
        <span class="stat-sub">يوم استراحة</span>
        <span class="stat-maint">🛠 ${mStats.maint[p]} صيانة</span>
      </div>`).join('');

    // رسم بياني شريطي لأيام الراحة (الشهر)
    drawBars($('#restChart'), partners.map(p => ({
      label: p, value: mStats.rest[p], color: users[p].color
    })));

    // رسم دائري (Donut) لتوزيع الصيانة السنوي
    drawDonut($('#maintDonut'), partners.map(p => ({
      label: p, value: yStats.maint[p], color: users[p].color
    })));

    // جدول الإحصاء السنوي
    $('#yearTable').innerHTML = `
      <div class="ytable-row ytable-head">
        <span>الشريك</span><span>أيام الراحة</span><span>مرات الصيانة</span><span>الإجمالي</span>
      </div>` + partners.map(p => `
      <div class="ytable-row">
        <span><i class="dot" style="background:${users[p].color}"></i>${p}</span>
        <span>${yStats.rest[p]}</span>
        <span>${yStats.maint[p]}</span>
        <span>${yStats.rest[p] + yStats.maint[p]}</span>
      </div>`).join('');
  }

  // رسم أعمدة بسيطة (بدون مكتبات)
  function drawBars(container, data) {
    const max = Math.max(1, ...data.map(d => d.value));
    container.innerHTML = data.map(d => `
      <div class="bar-row">
        <span class="bar-label">${d.label}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${(d.value / max) * 100}%;background:${d.color}"></div>
        </div>
        <span class="bar-val">${d.value}</span>
      </div>`).join('');
  }

  // رسم Donut عبر SVG (بدون مكتبات)
  function drawDonut(container, data) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const R = 70, C = 2 * Math.PI * R;
    let offset = 0;
    const segments = total === 0
      ? `<circle cx="90" cy="90" r="${R}" fill="none" stroke="#e5e7eb" stroke-width="26"/>`
      : data.map(d => {
          const frac = d.value / total;
          const dash = frac * C;
          const seg = `<circle cx="90" cy="90" r="${R}" fill="none" stroke="${d.color}"
            stroke-width="26" stroke-dasharray="${dash} ${C - dash}"
            stroke-dashoffset="${-offset}" transform="rotate(-90 90 90)"/>`;
          offset += dash;
          return seg;
        }).join('');

    const legend = data.map(d => `
      <div class="legend-item"><i style="background:${d.color}"></i>${d.label}: <b>${d.value}</b></div>`).join('');

    container.innerHTML = `
      <svg viewBox="0 0 180 180" class="donut-svg">${segments}
        <text x="90" y="86" text-anchor="middle" class="donut-total">${total}</text>
        <text x="90" y="104" text-anchor="middle" class="donut-cap">صيانة/سنة</text>
      </svg>
      <div class="legend">${legend}</div>`;
  }

  // ---------- السجل التاريخي ---------------------------------------------
  let historyFilter = 'all';
  async function renderHistory() {
    const hist = await Storage.getHistory();
    const map = {
      exchange_request: { icon: '📨', cls: 'h-req' },
      exchange_accepted: { icon: '✅', cls: 'h-acc' },
      exchange_rejected: { icon: '❌', cls: 'h-rej' },
      password_change: { icon: '🔑', cls: 'h-sys' },
      settings_change: { icon: '⚙️', cls: 'h-sys' },
    };
    const filtered = hist.filter(h => {
      if (historyFilter === 'all') return true;
      if (historyFilter === 'exchange') return h.type.startsWith('exchange');
      if (historyFilter === 'maint') return h.type === 'maintenance';
      if (historyFilter === 'system') return h.type === 'password_change' || h.type === 'settings_change';
      return true;
    });

    $('#historyList').innerHTML = filtered.length ? filtered.map(h => {
      const meta = map[h.type] || { icon: '•', cls: '' };
      const when = new Date(h.timestamp).toLocaleString('ar', {
        dateStyle: 'medium', timeStyle: 'short'
      });
      return `<div class="hist-item ${meta.cls}">
                <span class="hist-icon">${meta.icon}</span>
                <div class="hist-body"><span>${h.text}</span><time>${when}</time></div>
              </div>`;
    }).join('') : `<p class="empty">لا توجد عمليات مسجّلة بعد.</p>`;
  }

  // ---------- الإعدادات ---------------------------------------------------
  async function renderSettings() {
    const me = Auth.getCurrentUser();
    users = await Storage.getUsers();
    settings = await Storage.getSettings();
    $('#setColor').value = users[me].color;
    $('#colorPreview').style.background = users[me].color;
    $('#setNotif').checked = settings.notificationsEnabled;
    $('#setBrowserNotif').checked = settings.browserNotifications;
    $('#pwOld').value = $('#pwNew').value = '';
    $('#settingsMsg').textContent = '';
  }

  async function saveColor() {
    const me = Auth.getCurrentUser();
    const color = $('#setColor').value;
    users = await Storage.getUsers();
    users[me].color = color;
    await Storage.setUsers(users);
    applyUserColors();
    await Storage.addHistory({ type: 'settings_change', actor: me, text: `${me} غيّر لونه المميّز` });
    toast('تم حفظ اللون');
    refreshAll();
  }

  async function savePassword() {
    const res = await Auth.changePassword($('#pwOld').value, $('#pwNew').value);
    $('#settingsMsg').textContent = res.ok ? '✅ تم تغيير كلمة المرور' : '⚠️ ' + res.error;
    $('#settingsMsg').style.color = res.ok ? 'var(--accent)' : 'var(--danger)';
    if (res.ok) { $('#pwOld').value = $('#pwNew').value = ''; }
  }

  async function saveNotifPrefs() {
    settings = await Storage.getSettings();
    settings.notificationsEnabled = $('#setNotif').checked;
    settings.browserNotifications = $('#setBrowserNotif').checked;
    if (settings.browserNotifications) {
      const granted = await Notifications.requestBrowserPermission();
      if (!granted) { settings.browserNotifications = false; $('#setBrowserNotif').checked = false; }
    }
    await Storage.setSettings(settings);
    toast('تم حفظ تفضيلات الإشعارات');
    refreshAll();
  }

  // ---------- تصدير / استيراد --------------------------------------------
  async function exportData() {
    const data = await Storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estraha-backup-${Calendar.dateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('تم تصدير نسخة JSON');
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result);
        await Storage.importAll(data);
        partners = await Storage.getPartners();
        Calendar.setPartners(partners);
        users = await Storage.getUsers();
        partners.forEach(p => { if (!(p in visibleUsers)) visibleUsers[p] = true; });
        applyUserColors();
        toast('تم استيراد البيانات بنجاح');
        refreshAll();
        if (activeView === 'settings') renderSettings();
      } catch (e) {
        toast('فشل الاستيراد: ' + e.message);
      }
    };
    reader.readAsText(file);
  }

  // ---------- أدوات مساعدة -----------------------------------------------
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  function toggleNotifPanel() {
    $('#notifPanel').classList.toggle('show');
  }

  // ---------- ربط الأحداث العامة -----------------------------------------
  function bindGlobalEvents() {
    $('#loginBtn').addEventListener('click', doLogin);
    $('#loginPassword').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    $('#logoutBtn').addEventListener('click', doLogout);

    $$('.tab').forEach(t => t.addEventListener('click', () => switchView(t.dataset.view)));

    $('#prevMonth').addEventListener('click', () => changeMonth(-1));
    $('#nextMonth').addEventListener('click', () => changeMonth(1));
    $('#todayBtn').addEventListener('click', goToToday);

    $('#modalOverlay').addEventListener('click', closeModal);
    $('#modalClose').addEventListener('click', closeModal);
    $('#sendRequestBtn').addEventListener('click', sendRequest);

    $('#notifBell').addEventListener('click', toggleNotifPanel);
    $('#notifCloseBtn').addEventListener('click', () => $('#notifPanel').classList.remove('show'));

    $('#saveColorBtn').addEventListener('click', saveColor);
    $('#setColor').addEventListener('input', e => $('#colorPreview').style.background = e.target.value);
    $('#savePwBtn').addEventListener('click', savePassword);
    $('#saveNotifBtn').addEventListener('click', saveNotifPrefs);

    $('#exportBtn').addEventListener('click', exportData);
    $('#importInput').addEventListener('change', e => {
      if (e.target.files[0]) importData(e.target.files[0]);
      e.target.value = '';
    });

    $$('.hfilter').forEach(b => b.addEventListener('click', () => {
      historyFilter = b.dataset.filter;
      $$('.hfilter').forEach(x => x.classList.toggle('hfilter--active', x === b));
      renderHistory();
    }));
  }

  return { start };
})();

document.addEventListener('DOMContentLoaded', App.start);
