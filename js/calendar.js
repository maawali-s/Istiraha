/* ============================================================
 * calendar.js — منطق الجدولة وعرض التقويم
 * ------------------------------------------------------------
 * قواعد الجدولة (محفوظة من النموذج الأصلي):
 *  - مالك اليوم العادي يدور يومياً: partners[totalDays % 3]
 *  - يوم الأربعاء = صيانة دورية ثابتة
 *  - مسؤول الصيانة يتناوب أسبوعياً: partners[floor(totalDays/7) % 3]
 *  - أي تبادل مقبول يُسجَّل كـ "override" يَحُل محل المالك المحسوب لذلك اليوم
 * ============================================================ */

const Calendar = (() => {
  const MS_DAY = 1000 * 60 * 60 * 24;
  const WEEKDAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const WEEKDAYS_SHORT = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
  const MAINTENANCE_WEEKDAY = 3; // الأربعاء

  let partners = ['جلند', 'سعيد', 'سالم'];

  function setPartners(list) { partners = list; }

  // مفتاح تاريخ ثابت YYYY-MM-DD (محلي، بلا تأثير منطقة زمنية)
  function dateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function totalDaysFor(dateObj) {
    // نعتمد منتصف اليوم لتفادي مشاكل التوقيت الصيفي
    const noon = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 12);
    return Math.floor(noon.getTime() / MS_DAY);
  }

  // حساب معلومات يوم واحد مع مراعاة التبادلات (overrides)
  function dayInfo(dateObj, overrides = {}) {
    const total = totalDaysFor(dateObj);
    const key = dateKey(dateObj);
    const isMaintenance = dateObj.getDay() === MAINTENANCE_WEEKDAY;

    const computedRestOwner = partners[((total % 3) + 3) % 3];
    const computedMaintOwner = partners[((Math.floor(total / 7) % 3) + 3) % 3];

    // المالك الأساسي المحسوب لهذا اليوم
    const computedOwner = isMaintenance ? computedMaintOwner : computedRestOwner;
    // المالك الفعلي بعد التبادل
    const owner = overrides[key] || computedOwner;

    return {
      key,
      date: dateObj,
      day: dateObj.getDate(),
      weekday: dateObj.getDay(),
      isMaintenance,
      computedOwner,
      owner,
      isSwapped: !!overrides[key] && overrides[key] !== computedOwner,
    };
  }

  // إحصائيات لفترة (شهر أو سنة): عدد أيام الراحة + الصيانة لكل شريك
  function statsForRange(start, end, overrides = {}) {
    const rest = {}; const maint = {};
    partners.forEach(p => { rest[p] = 0; maint[p] = 0; });
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (cur <= end) {
      const info = dayInfo(cur, overrides);
      if (info.isMaintenance) maint[info.owner] = (maint[info.owner] || 0) + 1;
      else rest[info.owner] = (rest[info.owner] || 0) + 1;
      cur.setDate(cur.getDate() + 1);
    }
    return { rest, maint };
  }

  function monthStats(year, month, overrides = {}) {
    return statsForRange(new Date(year, month, 1), new Date(year, month + 1, 0), overrides);
  }

  function yearStats(year, overrides = {}) {
    return statsForRange(new Date(year, 0, 1), new Date(year, 11, 31), overrides);
  }

  // رسم شبكة التقويم لشهر معيّن
  function renderMonthGrid(gridEl, displayDate, ctx) {
    const { overrides, users, visibleUsers, realToday, onDayClick } = ctx;
    gridEl.innerHTML = '';
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    WEEKDAYS_SHORT.forEach((d, i) => {
      const div = document.createElement('div');
      div.className = 'day-header';
      div.textContent = d;
      div.title = WEEKDAYS_AR[i];
      gridEl.appendChild(div);
    });

    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstWeekday; i++) {
      const empty = document.createElement('div');
      empty.className = 'day day--empty';
      gridEl.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const info = dayInfo(dateObj, overrides);
      const cell = document.createElement('div');
      cell.className = 'day';
      if (info.isMaintenance) cell.classList.add('day--maint');
      if (dateObj.toDateString() === realToday.toDateString()) cell.classList.add('is-today');

      const visible = visibleUsers[info.owner] !== false;
      const color = (users[info.owner] && users[info.owner].color) || '#888';

      const numWrap = document.createElement('div');
      numWrap.className = 'day-top';
      numWrap.innerHTML = `<span class="day-num">${day}</span>` +
        (info.isSwapped ? `<span class="swap-mark" title="يوم متبادَل">⇄</span>` : '') +
        (info.isMaintenance ? `<span class="maint-mark" title="صيانة">🛠</span>` : '');
      cell.appendChild(numWrap);

      const tag = document.createElement('span');
      tag.className = 'owner-tag' + (info.isMaintenance ? ' owner-tag--maint' : '');
      if (!visible) tag.classList.add('hide-tag');
      if (!info.isMaintenance) tag.style.background = color;
      tag.textContent = info.owner;
      cell.appendChild(tag);

      cell.addEventListener('click', () => onDayClick(info));
      gridEl.appendChild(cell);
    }
  }

  return {
    setPartners, dateKey, dayInfo, monthStats, yearStats, statsForRange,
    renderMonthGrid, WEEKDAYS_AR, MAINTENANCE_WEEKDAY,
    getPartners: () => partners,
  };
})();

window.Calendar = Calendar;
