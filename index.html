<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#123A2E">
  <title>نظام إدارة الاستراحة</title>
  <link rel="icon" type="image/svg+xml" href="assets/icon.svg">
  <link rel="apple-touch-icon" href="assets/icon.svg">
  <link rel="manifest" href="manifest.json">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- ==================== شاشة تسجيل الدخول ==================== -->
  <div id="loginScreen">
    <div class="login-card">
      <div class="brand-mark">🌴</div>
      <h1>نظام إدارة الاستراحة</h1>
      <p class="sub">شراكة جلند · سعيد · سالم</p>

      <div class="field">
        <label for="loginPartner">الشريك</label>
        <select id="loginPartner"></select>
      </div>
      <div class="field">
        <label for="loginPassword">كلمة المرور</label>
        <input type="password" id="loginPassword" placeholder="••••••••" autocomplete="current-password">
      </div>
      <button class="btn-primary" id="loginBtn">تسجيل الدخول</button>
      <p class="login-error" id="loginError"></p>
      <p class="login-hint">تُحفظ البيانات على جهازك. يمكنك تغيير كلمة المرور من صفحة الإعدادات بعد الدخول.</p>
    </div>
  </div>

  <!-- ==================== التطبيق ==================== -->
  <div id="appShell">
    <!-- الشريط العلوي -->
    <div class="topbar">
      <div class="logo"><span class="dotmark">🌴</span><span class="txt">الاستراحة</span></div>
      <div class="spacer"></div>
      <div class="user-pill">👤 <b id="currentUserName"></b></div>
      <button class="icon-btn" id="notifBell" title="الإشعارات">🔔
        <span class="notif-count" id="notifCount">0</span>
      </button>
      <button class="icon-btn" id="logoutBtn" title="تسجيل الخروج">⏻</button>
    </div>

    <div class="container">
      <!-- البانر: من له الاستراحة اليوم -->
      <div id="hero">
        <span class="hero-badge" id="heroBadge">🌙 يوم استراحة</span>
        <p class="hero-label" id="heroLabel">صاحب الاستراحة اليوم</p>
        <h2 class="hero-owner" id="heroOwner">—</h2>
        <p class="hero-date" id="heroDate"></p>
      </div>

      <!-- التبويبات -->
      <div class="tabs">
        <button class="tab tab--active" data-view="calendar">📅 التقويم</button>
        <button class="tab" data-view="dashboard">📊 لوحة التحكم</button>
        <button class="tab" data-view="history">🕓 السجل</button>
        <button class="tab" data-view="settings">⚙️ الإعدادات</button>
      </div>

      <!-- ========== عرض: التقويم ========== -->
      <section class="view view--active" id="view-calendar">
        <div class="panel">
          <div class="month-nav">
            <button class="nav-btn" id="nextMonth" title="الشهر التالي">◀</button>
            <b id="currentMonthYear"></b>
            <button class="today-btn" id="todayBtn">اليوم</button>
            <button class="nav-btn" id="prevMonth" title="الشهر السابق">▶</button>
          </div>
          <div class="filters" id="filters"></div>
          <div class="calendar-grid" id="calendarGrid"></div>
        </div>
      </section>

      <!-- ========== عرض: لوحة التحكم ========== -->
      <section class="view" id="view-dashboard">
        <div class="panel">
          <h2>📊 إحصائيات الشهر — <span id="dashMonthLabel"></span></h2>
          <div class="dash-cards" id="dashCards"></div>
          <div class="chart-row">
            <div>
              <h2>أيام الراحة (الشهر)</h2>
              <div id="restChart"></div>
            </div>
            <div>
              <h2>توزيع الصيانة (السنة)</h2>
              <div class="donut-wrap" id="maintDonut"></div>
            </div>
          </div>
        </div>
        <div class="panel">
          <h2>🗓 الإحصاء السنوي — <span id="dashYearLabel"></span></h2>
          <div id="yearTable"></div>
        </div>
      </section>

      <!-- ========== عرض: السجل التاريخي ========== -->
      <section class="view" id="view-history">
        <div class="panel">
          <h2>🕓 السجل التاريخي</h2>
          <div class="hfilters">
            <button class="hfilter hfilter--active" data-filter="all">الكل</button>
            <button class="hfilter" data-filter="exchange">التبادلات</button>
            <button class="hfilter" data-filter="system">النظام</button>
          </div>
          <div id="historyList"></div>
        </div>
      </section>

      <!-- ========== عرض: الإعدادات ========== -->
      <section class="view" id="view-settings">
        <div class="panel">
          <h2>⚙️ الإعدادات</h2>

          <div class="set-group">
            <label class="h">🎨 اللون المميّز</label>
            <div class="color-row">
              <input type="color" id="setColor" value="#2E7D8A">
              <div class="color-preview" id="colorPreview"></div>
              <button class="btn-sm" id="saveColorBtn">حفظ اللون</button>
            </div>
          </div>

          <div class="set-group">
            <label class="h">🔑 تغيير كلمة المرور</label>
            <div class="field-inline" style="margin-bottom:8px;">
              <input type="password" id="pwOld" placeholder="كلمة المرور الحالية">
            </div>
            <div class="field-inline">
              <input type="password" id="pwNew" placeholder="كلمة المرور الجديدة">
              <button class="btn-sm" id="savePwBtn">تحديث</button>
            </div>
            <p class="settings-msg" id="settingsMsg"></p>
          </div>

          <div class="set-group">
            <label class="h">🔔 الإشعارات</label>
            <div class="toggle-row">
              <span>تفعيل الإشعارات داخل التطبيق</span>
              <label class="switch"><input type="checkbox" id="setNotif"><span class="slider"></span></label>
            </div>
            <div class="toggle-row">
              <span>إشعارات المتصفح (تنبيهات النظام)</span>
              <label class="switch"><input type="checkbox" id="setBrowserNotif"><span class="slider"></span></label>
            </div>
            <button class="btn-sm" id="saveNotifBtn" style="margin-top:12px;">حفظ التفضيلات</button>
          </div>

          <div class="set-group">
            <label class="h">💾 النسخ الاحتياطي للبيانات</label>
            <div class="data-actions">
              <button class="btn-sm" id="exportBtn">⬇️ تصدير JSON</button>
              <label class="btn-sm btn-ghost import-label">⬆️ استيراد JSON
                <input type="file" id="importInput" accept="application/json,.json">
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- ==================== نافذة التبادل ==================== -->
  <div class="overlay" id="modalOverlay"></div>
  <div class="modal" id="exchangeModal">
    <button class="modal-close" id="modalClose">✕</button>
    <h3>🔄 طلب تبادل يوم</h3>
    <div class="modal-meta">
      <div id="modalDate"></div>
      <div>المالك الحالي: <b id="modalOwner"></b></div>
    </div>
    <p class="modal-dir" id="modalDirection"></p>
    <select id="exchangeWith"></select>
    <button class="btn-primary" id="sendRequestBtn">إرسال الطلب</button>
  </div>

  <!-- ==================== لوحة الإشعارات ==================== -->
  <div class="notif-panel" id="notifPanel">
    <div class="notif-head">
      <h3>🔔 الإشعارات</h3>
      <button id="notifCloseBtn">✕</button>
    </div>
    <div class="notif-scroll" id="notifList"></div>
  </div>

  <!-- توست -->
  <div class="toast" id="toast"></div>

  <!-- السكربتات (الترتيب مهم) -->
  <script src="js/storage.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/calendar.js"></script>
  <script src="js/notifications.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
