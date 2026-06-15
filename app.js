/* ============================================================
 * style.css — هوية بصرية: "مجلس/واحة" — أخضر النخيل + لمسة ذهبية
 * تصميم متجاوب (هاتف / لوحي / كمبيوتر) بدون مكتبات خارجية
 * ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700&display=swap');

:root {
  /* اللوحة اللونية */
  --ink:        #123A2E;   /* أخضر النخيل العميق — مرساة الهوية */
  --ink-2:      #0C2A21;
  --surface:    #FBFAF6;   /* ورق دافئ */
  --surface-2:  #F1EFE7;
  --line:       #E3E0D6;
  --text:       #1E2A25;
  --muted:      #6B7770;
  --gold:       #C8A24B;   /* لمسة عُمانية ذهبية */
  --gold-soft:  #E7D9AE;
  --accent:     #2E7D5B;
  --danger:     #B23A3A;
  --maint-bg:   #16181A;   /* بلاطة الصيانة الداكنة */

  --radius: 14px;
  --radius-sm: 9px;
  --shadow: 0 6px 22px rgba(18,58,46,.10);
  --shadow-lg: 0 18px 50px rgba(18,58,46,.20);

  --font-display: 'Cairo', 'Tahoma', sans-serif;
  --font-body: 'Tajawal', 'Segoe UI', Tahoma, sans-serif;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  font-family: var(--font-body);
  color: var(--text);
  background:
    radial-gradient(120% 60% at 100% 0%, rgba(200,162,75,.10), transparent 60%),
    radial-gradient(120% 60% at 0% 100%, rgba(18,58,46,.07), transparent 55%),
    var(--surface-2);
  min-height: 100vh;
  -webkit-text-size-adjust: 100%;
}

button { font-family: inherit; cursor: pointer; }
:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }

/* ====================== شاشة الدخول ====================== */
#loginScreen {
  display: none;
  position: fixed; inset: 0;
  align-items: center; justify-content: center;
  padding: 20px;
  background:
    radial-gradient(140% 80% at 50% -10%, #1c5341, var(--ink) 55%, var(--ink-2));
  z-index: 100;
}
#loginScreen.show { display: flex; }

.login-card {
  width: 100%; max-width: 380px;
  background: var(--surface);
  border-radius: 20px;
  padding: 34px 26px;
  box-shadow: var(--shadow-lg);
  border-top: 4px solid var(--gold);
  animation: rise .5s ease;
}
@keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }

.brand-mark {
  width: 56px; height: 56px; margin: 0 auto 14px;
  display: grid; place-items: center;
  background: var(--ink); color: var(--gold-soft);
  border-radius: 16px; font-size: 28px;
  box-shadow: inset 0 0 0 2px var(--gold);
}
.login-card h1 { font-family: var(--font-display); font-weight: 900; font-size: 22px; text-align: center; margin: 0 0 2px; color: var(--ink); }
.login-card .sub { text-align: center; color: var(--muted); font-size: 13px; margin: 0 0 22px; }

.field { margin-bottom: 14px; }
.field label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: var(--ink); }
.field select, .field input {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid var(--line); border-radius: var(--radius-sm);
  font-family: inherit; font-size: 15px; background: #fff; color: var(--text);
  transition: border-color .2s;
}
.field select:focus, .field input:focus { border-color: var(--ink); outline: none; }

.btn-primary {
  width: 100%; padding: 13px; border: none; border-radius: var(--radius-sm);
  background: var(--ink); color: #fff; font-weight: 700; font-size: 15px;
  font-family: var(--font-display); transition: transform .12s, background .2s;
}
.btn-primary:hover { background: var(--ink-2); }
.btn-primary:active { transform: scale(.98); }
.login-error { color: var(--danger); font-size: 13px; text-align: center; min-height: 18px; margin-top: 10px; }
.login-hint { margin-top: 18px; font-size: 11px; color: var(--muted); text-align: center; line-height: 1.7; }

/* ====================== الهيكل العام ====================== */
#appShell { display: none; }
#appShell.show { display: block; }

.topbar {
  position: sticky; top: 0; z-index: 40;
  background: var(--ink);
  color: #fff;
  padding: 12px 16px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 2px 14px rgba(0,0,0,.18);
}
.topbar .logo { font-family: var(--font-display); font-weight: 900; font-size: 18px; display: flex; align-items: center; gap: 8px; }
.topbar .logo .dotmark { width: 26px; height: 26px; border-radius: 8px; background: var(--gold); color: var(--ink); display: grid; place-items: center; font-size: 15px; }
.topbar .spacer { flex: 1; }

.user-pill {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.12); padding: 6px 12px; border-radius: 999px; font-size: 13px;
}
.user-pill b { font-weight: 700; }
.icon-btn {
  position: relative; background: rgba(255,255,255,.12); border: none; color: #fff;
  width: 38px; height: 38px; border-radius: 11px; font-size: 17px; display: grid; place-items: center;
  transition: background .2s;
}
.icon-btn:hover { background: rgba(255,255,255,.22); }
.notif-count {
  position: absolute; top: -5px; left: -5px;
  background: var(--gold); color: var(--ink); font-weight: 700;
  min-width: 18px; height: 18px; border-radius: 999px; font-size: 11px;
  display: none; align-items: center; justify-content: center; padding: 0 4px;
  border: 2px solid var(--ink);
}

.container { max-width: 980px; margin: 0 auto; padding: 16px; }

/* ====================== البانر (الثيسيس) ====================== */
#hero {
  --hero-accent: var(--gold);
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, var(--ink), var(--ink-2));
  color: #fff; border-radius: var(--radius);
  padding: 22px 22px 22px 110px;
  margin-bottom: 18px; box-shadow: var(--shadow);
}
#hero::before {
  content: ''; position: absolute; inset: 0 auto 0 0; width: 6px; background: var(--hero-accent);
}
#hero::after {
  content: ''; position: absolute; left: -30px; top: 50%; transform: translateY(-50%);
  width: 150px; height: 150px; border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--hero-accent) 55%, transparent), transparent 70%);
  opacity: .5;
}
.hero-label { font-size: 13px; color: var(--gold-soft); margin: 0 0 4px; }
.hero-owner { font-family: var(--font-display); font-weight: 900; font-size: 40px; line-height: 1; margin: 0; }
.hero-date { font-size: 13px; color: #cfe0d8; margin-top: 8px; }
.hero-badge {
  position: absolute; left: 18px; top: 18px;
  background: rgba(255,255,255,.14); color: #fff; padding: 6px 12px; border-radius: 999px;
  font-size: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,.2);
}
.hero-badge--maint { background: var(--gold); color: var(--ink); border-color: var(--gold); }

/* ====================== التبويبات ====================== */
.tabs {
  display: flex; gap: 6px; background: var(--surface); padding: 6px;
  border-radius: 999px; margin-bottom: 18px; box-shadow: var(--shadow);
  overflow-x: auto;
}
.tab {
  flex: 1; min-width: max-content; border: none; background: transparent; color: var(--muted);
  padding: 10px 14px; border-radius: 999px; font-weight: 700; font-size: 13px;
  font-family: var(--font-display); white-space: nowrap; transition: all .2s;
}
.tab--active { background: var(--ink); color: #fff; }

/* ====================== العروض ====================== */
.view { display: none; animation: fade .3s ease; }
.view--active { display: block; }
@keyframes fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.panel {
  background: var(--surface); border-radius: var(--radius);
  padding: 16px; box-shadow: var(--shadow); margin-bottom: 16px;
}
.panel h2 { font-family: var(--font-display); font-size: 16px; margin: 0 0 12px; color: var(--ink); display: flex; align-items: center; gap: 8px; }

/* أدوات التنقل الشهري */
.month-nav { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.month-nav b { font-family: var(--font-display); font-size: 16px; flex: 1; text-align: center; color: var(--ink); }
.nav-btn { width: 40px; height: 40px; border: 1.5px solid var(--line); background: #fff; border-radius: 11px; font-size: 15px; color: var(--ink); transition: all .15s; }
.nav-btn:hover { border-color: var(--ink); }
.today-btn { padding: 0 16px; height: 40px; border: none; background: var(--accent); color: #fff; border-radius: 11px; font-weight: 700; font-family: var(--font-display); }

/* فلاتر الإظهار */
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.chip { display: flex; align-items: center; gap: 6px; font-size: 13px; background: var(--surface-2); padding: 6px 12px; border-radius: 999px; cursor: pointer; user-select: none; }
.chip input { display: none; }
.chip .chip-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--chip); opacity: .35; transition: opacity .2s; }
.chip input:checked ~ .chip-dot { opacity: 1; }

/* شبكة التقويم */
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.day-header {
  background: var(--ink); color: var(--gold-soft); text-align: center;
  padding: 8px 0; border-radius: 8px; font-size: 12px; font-weight: 700; font-family: var(--font-display);
}
.day {
  min-height: 76px; background: #fff; border: 1px solid var(--line);
  border-radius: 10px; padding: 6px; display: flex; flex-direction: column;
  transition: transform .12s, box-shadow .12s; cursor: pointer;
}
.day:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.day--empty { background: transparent; border: none; cursor: default; }
.day--empty:hover { transform: none; box-shadow: none; }
.day-top { display: flex; align-items: center; gap: 4px; }
.day-num { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--text); }
.swap-mark { font-size: 11px; color: var(--accent); }
.maint-mark { font-size: 11px; margin-inline-start: auto; }
.is-today { border: 2px solid var(--gold); box-shadow: 0 0 0 3px rgba(200,162,75,.18); }
.is-today .day-num { color: var(--ink); }

.owner-tag {
  margin-top: auto; text-align: center; color: #fff; font-size: 11px; font-weight: 700;
  padding: 3px 4px; border-radius: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.owner-tag--maint { background: var(--maint-bg) !important; color: var(--gold-soft) !important; border: 1px solid var(--gold); }
.day--maint { background: #fffdf6; border-color: var(--gold-soft); }
.hide-tag { visibility: hidden; }

/* ====================== لوحة التحكم ====================== */
.dash-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
.stat-card {
  background: #fff; border: 1px solid var(--line); border-radius: var(--radius);
  padding: 14px; text-align: center; position: relative; overflow: hidden;
}
.stat-card::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 4px; background: var(--c); }
.stat-name { font-family: var(--font-display); font-weight: 700; color: var(--ink); font-size: 14px; display: block; }
.stat-big { font-family: var(--font-display); font-weight: 900; font-size: 34px; color: var(--c); display: block; line-height: 1.1; }
.stat-sub { font-size: 11px; color: var(--muted); display: block; }
.stat-maint { font-size: 11px; color: var(--text); display: block; margin-top: 6px; background: var(--surface-2); border-radius: 999px; padding: 2px 0; }

.chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* أعمدة */
.bar-row { display: grid; grid-template-columns: 56px 1fr 28px; align-items: center; gap: 8px; margin-bottom: 10px; }
.bar-label { font-size: 13px; font-weight: 500; }
.bar-track { background: var(--surface-2); border-radius: 999px; height: 16px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 999px; transition: width .6s cubic-bezier(.2,.8,.2,1); }
.bar-val { font-family: var(--font-display); font-weight: 700; font-size: 13px; text-align: center; }

/* donut */
.donut-wrap { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: center; }
.donut-svg { width: 150px; height: 150px; }
.donut-total { font-family: var(--font-display); font-weight: 900; font-size: 26px; fill: var(--ink); }
.donut-cap { font-size: 9px; fill: var(--muted); }
.legend { display: flex; flex-direction: column; gap: 6px; }
.legend-item { font-size: 13px; display: flex; align-items: center; gap: 6px; }
.legend-item i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }

/* جدول السنة */
.ytable-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 6px; padding: 10px 8px; border-bottom: 1px solid var(--line); font-size: 13px; align-items: center; }
.ytable-row span:not(:first-child) { text-align: center; font-family: var(--font-display); font-weight: 600; }
.ytable-head { font-family: var(--font-display); font-weight: 700; color: var(--ink); background: var(--surface-2); border-radius: 8px; }
.ytable-head span { text-align: center; }
.ytable-head span:first-child { text-align: start; }
.ytable-row .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-inline-end: 6px; }

/* ====================== السجل التاريخي ====================== */
.hfilters { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.hfilter { border: 1.5px solid var(--line); background: #fff; color: var(--muted); padding: 7px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; font-family: var(--font-display); }
.hfilter--active { background: var(--ink); color: #fff; border-color: var(--ink); }
.hist-item { display: flex; gap: 12px; padding: 12px; border-radius: 11px; background: #fff; border: 1px solid var(--line); margin-bottom: 8px; }
.hist-icon { font-size: 18px; }
.hist-body { display: flex; flex-direction: column; gap: 2px; }
.hist-body span { font-size: 14px; }
.hist-body time { font-size: 11px; color: var(--muted); }
.h-acc { border-inline-start: 3px solid var(--accent); }
.h-rej { border-inline-start: 3px solid var(--danger); }
.h-req { border-inline-start: 3px solid var(--gold); }

/* ====================== الإعدادات ====================== */
.set-group { margin-bottom: 18px; }
.set-group label.h { display: block; font-weight: 700; font-family: var(--font-display); color: var(--ink); margin-bottom: 8px; font-size: 14px; }
.color-row { display: flex; align-items: center; gap: 12px; }
.color-row input[type=color] { width: 56px; height: 44px; border: none; background: none; cursor: pointer; padding: 0; }
.color-preview { width: 44px; height: 44px; border-radius: 11px; border: 2px solid var(--line); }
.toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--line); }
.switch { position: relative; width: 46px; height: 26px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; inset: 0; background: var(--line); border-radius: 999px; transition: .3s; }
.slider::before { content: ''; position: absolute; width: 20px; height: 20px; right: 3px; top: 3px; background: #fff; border-radius: 50%; transition: .3s; }
.switch input:checked + .slider { background: var(--accent); }
.switch input:checked + .slider::before { transform: translateX(-20px); }

.field-inline { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.field-inline input { flex: 1; min-width: 140px; padding: 11px 12px; border: 1.5px solid var(--line); border-radius: var(--radius-sm); font-family: inherit; }
.btn-sm { padding: 10px 16px; border: none; border-radius: var(--radius-sm); background: var(--ink); color: #fff; font-weight: 700; font-family: var(--font-display); }
.btn-ghost { background: var(--surface-2); color: var(--ink); }
.settings-msg { font-size: 13px; margin-top: 8px; min-height: 18px; }

.data-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.data-actions .btn-sm { flex: 1; min-width: 130px; }
.import-label { display: inline-flex; align-items: center; justify-content: center; }
.import-label input { display: none; }

/* ====================== المودال + الإشعارات ====================== */
.overlay { display: none; position: fixed; inset: 0; background: rgba(12,42,33,.55); z-index: 200; backdrop-filter: blur(2px); }
.overlay.show { display: block; }
.modal {
  display: none; position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(.96);
  width: min(420px, 92vw); background: var(--surface); border-radius: 18px; padding: 22px;
  z-index: 210; box-shadow: var(--shadow-lg); border-top: 4px solid var(--gold);
}
.modal.show { display: block; animation: pop .25s ease forwards; }
@keyframes pop { to { transform: translate(-50%, -50%) scale(1); } }
.modal h3 { font-family: var(--font-display); margin: 0 0 14px; color: var(--ink); display: flex; align-items: center; gap: 8px; }
.modal-close { position: absolute; left: 16px; top: 16px; background: var(--surface-2); border: none; width: 32px; height: 32px; border-radius: 9px; font-size: 16px; }
.modal-meta { background: #fff; border: 1px solid var(--line); border-radius: 11px; padding: 12px; margin-bottom: 14px; font-size: 14px; }
.modal-meta b { font-family: var(--font-display); }
.modal-dir { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
.modal select { width: 100%; padding: 12px; border: 1.5px solid var(--line); border-radius: var(--radius-sm); font-family: inherit; font-size: 15px; margin-bottom: 14px; background: #fff; }

/* لوحة الإشعارات */
.notif-panel {
  display: none; position: fixed; top: 64px; left: 12px; width: min(360px, 92vw);
  background: var(--surface); border-radius: 16px; box-shadow: var(--shadow-lg);
  z-index: 220; max-height: 75vh; overflow: hidden; flex-direction: column;
}
.notif-panel.show { display: flex; animation: fade .25s ease; }
.notif-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--line); }
.notif-head h3 { margin: 0; font-family: var(--font-display); font-size: 15px; color: var(--ink); }
.notif-head button { background: var(--surface-2); border: none; width: 30px; height: 30px; border-radius: 9px; }
.notif-scroll { overflow-y: auto; padding: 8px; }
.notif-item { display: flex; gap: 10px; padding: 12px; border-radius: 11px; background: #fff; border: 1px solid var(--line); margin-bottom: 8px; }
.notif-icon { font-size: 18px; }
.notif-body { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.notif-body b { font-family: var(--font-display); font-size: 14px; color: var(--ink); }
.notif-body span { font-size: 13px; color: var(--text); }
.notif-actions { display: flex; gap: 8px; margin-top: 8px; }
.btn { padding: 7px 14px; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; font-family: var(--font-display); }
.btn-accept { background: var(--accent); color: #fff; }
.btn-reject { background: var(--surface-2); color: var(--danger); }

.empty { text-align: center; color: var(--muted); font-size: 14px; padding: 24px 0; }

/* توست */
.toast {
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%) translateY(20px);
  background: var(--ink); color: #fff; padding: 12px 22px; border-radius: 999px;
  font-size: 14px; font-weight: 500; box-shadow: var(--shadow-lg); z-index: 300;
  opacity: 0; pointer-events: none; transition: all .3s; border: 1px solid var(--gold);
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ====================== التجاوب ====================== */
@media (max-width: 560px) {
  .hero-owner { font-size: 32px; }
  #hero { padding: 18px 18px 18px 80px; }
  .day { min-height: 64px; }
  .chart-row { grid-template-columns: 1fr; }
  .container { padding: 12px; }
  .dash-cards { gap: 6px; }
  .stat-big { font-size: 28px; }
  .topbar .logo span.txt { display: none; }
}
@media (min-width: 561px) and (max-width: 900px) {
  .day { min-height: 84px; }
}
@media (min-width: 901px) {
  .day { min-height: 96px; }
  .calendar-grid { gap: 8px; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
