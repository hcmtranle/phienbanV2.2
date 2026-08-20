// APP.JS - GIAO DIỆN & TƯƠNG TÁC HỆ THỐNG TKB NGUYỄN AN KHƯƠNG (PHIÊN BẢN V2.4)

let currentSchedule = null;
let currentView = 'class'; // 'class' | 'teacher' | 'master' | 'audit' | 'data'
let selectedClass = '1.1';
let selectedTeacher = 't_ta_phuong';
let selectedGradeFilter = 'all';
let isAdmin = false;
let solver = null;

// Display mapping for print & table cells
const PRINT_SUBJECT_NAMES = {
  "TV": "Tiếng Việt",
  "Toán": "Toán",
  "ĐĐ": "Đạo đức",
  "TNXH": "Tự nhiên và Xã hội",
  "KH": "Khoa học",
  "LSĐL": "Lịch sử và Địa lí",
  "HĐTN(CC)": "HĐTN (Chào cờ)",
  "HĐTN(CĐ)": "HĐTN (Chủ đề)",
  "HĐTN(SHL)": "HĐTN (SHL)",
  "GDTC": "Giáo dục thể chất",
  "NT(MT)": "Mĩ thuật",
  "NT(ÂN)": "Âm nhạc",
  "CN": "Công nghệ",
  "TA": "Tiếng Anh",
  "TH": "Tin học TH(2018)",
  "IC3": "Tin học Quốc tế IC3",
  "CDS": "Công dân số (CDS)",
  "CLB Stem": "CLB Stem",
  "CLB KNS": "CLB KNS",
  "TA(BN)": "Tiếng Anh Bản ngữ TA(BN)",
  "TA(T-K)": "Tiếng Anh Toán-Khoa TA(T-K)",
  "CLB Toán TD": "CLB Toán Tư duy",
  "Tự học": "Tự học/học có hướng dẫn"
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  solver = new TKBSolver(TKB_CONFIG);

  if (sessionStorage.getItem('tkb_admin_auth') === 'true') {
    isAdmin = true;
  }

  // Load precomputed initial schedule or solve
  try {
    const res = await fetch('initial_schedule.json');
    if (res.ok) {
      const data = await res.json();
      currentSchedule = data.schedule;
    } else {
      const solved = solver.solve(6);
      currentSchedule = solved.schedule;
    }
  } catch (e) {
    const solved = solver.solve(6);
    currentSchedule = solved.schedule;
  }

  setupEventListeners();
  updateRoleUI();
  renderApp();
});

function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      if (view === 'audit' && !isAdmin) {
        openAdminModal();
        return;
      }
      switchView(view);
    });
  });

  // Grade filter tabs
  document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
      btn.classList.add('active', 'bg-blue-600', 'text-white');
      selectedGradeFilter = btn.dataset.grade;
      updateClassDropdown();
    });
  });

  // Class Select dropdown
  const classSelect = document.getElementById('classSelect');
  if (classSelect) {
    classSelect.addEventListener('change', (e) => {
      selectedClass = e.target.value;
      renderClassView();
    });
  }

  // Teacher Select dropdown
  const teacherSelect = document.getElementById('teacherSelect');
  if (teacherSelect) {
    teacherSelect.addEventListener('change', (e) => {
      selectedTeacher = e.target.value;
      renderTeacherView();
    });
  }

  // Teacher Type Filter
  document.querySelectorAll('.teacher-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.teacher-type-btn').forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
      btn.classList.add('active', 'bg-blue-600', 'text-white');
      updateTeacherDropdown(btn.dataset.type);
    });
  });

  // Admin Login / Logout
  const btnAdminLogin = document.getElementById('btnAdminLogin');
  if (btnAdminLogin) btnAdminLogin.addEventListener('click', openAdminModal);

  const btnAdminLogout = document.getElementById('btnAdminLogout');
  if (btnAdminLogout) btnAdminLogout.addEventListener('click', handleAdminLogout);

  // Admin Modal
  const btnCloseModal = document.getElementById('btnCloseModal');
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeAdminModal);

  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAdminLoginSubmit();
    });
  }

  // Action buttons
  const btnRegen = document.getElementById('btnRegen');
  if (btnRegen) btnRegen.addEventListener('click', handleRegenerate);

  const btnPrint = document.getElementById('btnPrint');
  if (btnPrint) btnPrint.addEventListener('click', () => triggerPrint(currentView));

  const btnExportCSV = document.getElementById('btnExportCSV');
  if (btnExportCSV) btnExportCSV.addEventListener('click', exportCurrentViewToCSV);

  const btnExportJSON = document.getElementById('btnExportJSON');
  if (btnExportJSON) btnExportJSON.addEventListener('click', exportJSON);
}

function triggerPrint(view) {
  document.body.className = 'print-view-' + view;
  window.print();
}

function updateRoleUI() {
  const adminElements = document.querySelectorAll('.admin-only');
  const userLoginBtn = document.getElementById('btnAdminLogin');
  const adminBadgeGroup = document.getElementById('adminBadgeGroup');

  if (isAdmin) {
    adminElements.forEach(el => el.classList.remove('hidden'));
    if (userLoginBtn) userLoginBtn.classList.add('hidden');
    if (adminBadgeGroup) adminBadgeGroup.classList.remove('hidden');
  } else {
    adminElements.forEach(el => el.classList.add('hidden'));
    if (userLoginBtn) userLoginBtn.classList.remove('hidden');
    if (adminBadgeGroup) adminBadgeGroup.classList.add('hidden');
    if (currentView === 'audit') switchView('class');
  }
}

function openAdminModal() {
  const modal = document.getElementById('adminModal');
  const input = document.getElementById('adminPassInput');
  const err = document.getElementById('adminPassError');
  if (modal) {
    modal.classList.remove('hidden');
    if (input) { input.value = ''; input.focus(); }
    if (err) err.classList.add('hidden');
  }
}

function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  if (modal) modal.classList.add('hidden');
}

function handleAdminLoginSubmit() {
  const input = document.getElementById('adminPassInput');
  const err = document.getElementById('adminPassError');
  if (!input) return;

  const val = input.value.trim();
  if (val === TKB_CONFIG.school.adminPass) {
    isAdmin = true;
    sessionStorage.setItem('tkb_admin_auth', 'true');
    closeAdminModal();
    updateRoleUI();
    showToast("Đã mở khóa quyền Quản trị viên BGH thành công!");
    runAudit();
  } else {
    if (err) {
      err.textContent = "Mật khẩu quản trị không chính xác!";
      err.classList.remove('hidden');
    }
  }
}

function handleAdminLogout() {
  isAdmin = false;
  sessionStorage.removeItem('tkb_admin_auth');
  updateRoleUI();
  showToast("Đã đăng xuất khỏi chế độ Quản trị!");
}

function switchView(view) {
  currentView = view;
  document.body.className = 'print-view-' + view;

  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.dataset.view === view) {
      tab.classList.add('border-blue-600', 'text-blue-600', 'font-bold');
      tab.classList.remove('border-transparent', 'text-slate-500');
    } else {
      tab.classList.remove('border-blue-600', 'text-blue-600', 'font-bold');
      tab.classList.add('border-transparent', 'text-slate-500');
    }
  });

  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  const activePanel = document.getElementById(`panel-${view}`);
  if (activePanel) activePanel.classList.remove('hidden');

  renderApp();
}

function updateClassDropdown() {
  const select = document.getElementById('classSelect');
  if (!select) return;
  select.innerHTML = '';

  const classes = Object.keys(TKB_CONFIG.classes).filter(c => {
    if (selectedGradeFilter === 'all') return true;
    return TKB_CONFIG.classes[c].grade.toString() === selectedGradeFilter.toString();
  });

  classes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = `Lớp ${c} (GVCN: ${TKB_CONFIG.classes[c].gvcnName})`;
    select.appendChild(opt);
  });

  if (classes.includes(selectedClass)) {
    select.value = selectedClass;
  } else if (classes.length > 0) {
    selectedClass = classes[0];
    select.value = selectedClass;
  }

  renderClassView();
}

function updateTeacherDropdown(typeFilter = 'all') {
  const select = document.getElementById('teacherSelect');
  if (!select) return;
  select.innerHTML = '';

  const groups = {
    'specialist': 'Giáo viên Bộ Môn & TPT',
    'partner': 'Giáo viên Đối Tác Trung Tâm',
    'gvcn': 'Giáo viên Chủ Nhiệm (29 GVCN)'
  };

  for (let [typeKey, typeLabel] of Object.entries(groups)) {
    if (typeFilter !== 'all' && typeFilter !== typeKey) continue;

    const optgroup = document.createElement('optgroup');
    optgroup.label = typeLabel;

    const tList = Object.values(TKB_CONFIG.teachers).filter(t => t.type === typeKey);
    tList.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.short} - ${t.name} (${t.subject})`;
      optgroup.appendChild(opt);
    });

    if (optgroup.children.length > 0) {
      select.appendChild(optgroup);
    }
  }

  if (select.querySelector(`option[value="${selectedTeacher}"]`)) {
    select.value = selectedTeacher;
  } else if (select.options.length > 0) {
    selectedTeacher = select.options[0].value;
    select.value = selectedTeacher;
  }

  renderTeacherView();
}

function renderApp() {
  if (currentView === 'class') {
    updateClassDropdown();
    renderClassView();
  } else if (currentView === 'teacher') {
    updateTeacherDropdown();
    renderTeacherView();
  } else if (currentView === 'master') {
    renderMasterView();
  } else if (currentView === 'audit') {
    runAudit();
  } else if (currentView === 'data') {
    renderDataView();
  }
}

// 1. RENDER CLASS VIEW (DYNAMIC THEO LỚP ĐƯỢC CHỌN)
function renderClassView() {
  const container = document.getElementById('classTimetableContainer');
  if (!container || !currentSchedule || !currentSchedule[selectedClass]) return;

  const classInfo = TKB_CONFIG.classes[selectedClass];
  const sched = currentSchedule[selectedClass];
  const grade = classInfo.grade;

  const morningPeriods = [
    { p: 1, label: "Tiết 1", time: "(7:45 - 8:20)" },
    { p: 2, label: "Tiết 2", time: "(8:25 - 9:00)" },
    { p: 3, label: "Tiết 3", time: "(9:35 - 10:10)" },
    { p: 4, label: "Tiết 4", time: "(10:15 - 10:50)" }
  ];

  const afternoonPeriods = [
    { p: 5, label: "Tiết 5 (Chiều 1)", time: "(13:30 - 14:05)" },
    { p: 6, label: "Tiết 6 (Chiều 2)", time: "(14:10 - 14:45)" },
    { p: 7, label: "Tiết 7 (Chiều 3)", time: "(15:15 - 15:50)" },
    { p: 8, label: "Tiết 8 (CLB/Năng khiếu)", time: "(15:55 - 16:30)" }
  ];

  let html = `
    <div class="print-sheet">
      
      <!-- Top Header Row -->
      <div class="flex justify-between items-start print-header">
        <div class="text-left font-bold text-xs leading-snug uppercase text-black">
          <div>${TKB_CONFIG.school.district}</div>
          <div class="font-extrabold text-sm tracking-tight">${TKB_CONFIG.school.name}</div>
          <div class="font-normal text-[11px] normal-case text-slate-700">Năm học: ${TKB_CONFIG.school.yearShort}</div>
        </div>

        <button onclick="triggerPrint('class')" class="no-print px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition">
          <span>🖨️</span> BẤM ĐỂ IN HOẶC LƯU PDF
        </button>
      </div>

      <!-- Center Title -->
      <div class="text-center my-3 print-title-box">
        <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-black">
          THỜI KHÓA BIỂU LỚP ${selectedClass} (KHỐI ${grade})
        </h2>
        <div class="text-xs text-black mt-0.5">
          Giáo viên chủ nhiệm: <span class="font-bold">${classInfo.gvcnName}</span>
        </div>
      </div>

      <!-- Table Grid (Chuẩn Form In A4 Ngang) -->
      <table class="tkb-print-table">
        <thead>
          <tr>
            <th class="session-col">BUỔI</th>
            <th class="period-col">TIẾT / GIỜ</th>
            ${TKB_CONFIG.days.map(d => `<th class="w-1/5">${d.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  // Morning (Sáng) - 4 Rows
  morningPeriods.forEach((item, idx) => {
    html += `<tr>`;
    if (idx === 0) {
      html += `
        <td rowspan="4" class="session-col bg-white font-black text-black">
          SÁNG
        </td>
      `;
    }
    html += `
      <td class="period-col">
        ${item.label}
        <span class="period-time">${item.time}</span>
      </td>
    `;
    TKB_CONFIG.days.forEach(d => {
      const cell = sched[d.id] ? sched[d.id][item.p] : null;
      const subjName = cell ? (PRINT_SUBJECT_NAMES[cell.subject] || cell.subject) : '';
      html += `<td class="subject-cell"${cellColorStyle(cell)}>${subjName}</td>`;
    });
    html += `</tr>`;
  });

  // Afternoon (Chiều) - 4 Rows
  afternoonPeriods.forEach((item, idx) => {
    html += `<tr>`;
    if (idx === 0) {
      html += `
        <td rowspan="4" class="session-col bg-white font-black text-black">
          CHIỀU
        </td>
      `;
    }
    html += `
      <td class="period-col">
        ${item.label}
        <span class="period-time">${item.time}</span>
      </td>
    `;
    TKB_CONFIG.days.forEach(d => {
      const cell = sched[d.id] ? sched[d.id][item.p] : null;
      const subjName = cell ? (PRINT_SUBJECT_NAMES[cell.subject] || cell.subject) : '';
      html += `<td class="subject-cell"${cellColorStyle(cell)}>${subjName}</td>`;
    });
    html += `</tr>`;
  });

  html += `
        </tbody>
      </table>

      ${buildSubjectColorLegend(sched)}

      <!-- Dynamic Signatures Footer Area -->
      <div class="flex justify-between items-start pt-4 px-4 text-xs text-black font-semibold print-signature-box">
        <div class="text-center w-64">
          <div class="font-bold uppercase">GIÁO VIÊN CHỦ NHIỆM</div>
          <div class="italic text-[10.5px] font-normal text-slate-700">(Ký và ghi rõ họ tên)</div>
          <div class="mt-12 font-bold text-sm print-signature-name">${classInfo.gvcnName}</div>
        </div>

        <div class="text-center w-64">
          <div class="italic text-[11px] font-normal mb-0.5">TP. Hồ Chí Minh, ngày ..... tháng ..... năm 2026</div>
          <div class="font-bold uppercase">HIỆU TRƯỞNG</div>
          <div class="italic text-[10.5px] font-normal text-slate-700">(Ký và đóng dấu)</div>
          <div class="mt-12 font-bold text-sm print-signature-name">${TKB_CONFIG.school.principal}</div>
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;
}

// Trả về chuỗi style="..." tô màu nền/chữ cho 1 ô môn học dựa theo TKB_CONFIG.subjectColors.
// Nhờ tô theo MÔN, 2 ô của cùng 1 cặp tiết liền nhau (VD: 2 tiết Tiếng Anh) sẽ luôn cùng màu.
function cellColorStyle(cell) {
  if (!cell) return '';
  const color = TKB_CONFIG.subjectColors[cell.subject];
  if (!color || !color.hex) return '';
  return ` style="background-color:${color.hex.bg};color:${color.hex.text};"`;
}

// Tạo dải chú thích màu (chỉ liệt kê các môn thực sự xuất hiện trong TKB của lớp đang xem)
function buildSubjectColorLegend(sched) {
  const usedSubjects = new Set();
  TKB_CONFIG.days.forEach(d => {
    const dayObj = sched[d.id];
    if (!dayObj) return;
    Object.values(dayObj).forEach(cell => {
      if (cell && cell.subject) usedSubjects.add(cell.subject);
    });
  });

  const chips = Array.from(usedSubjects)
    .filter(subj => TKB_CONFIG.subjectColors[subj])
    .sort((a, b) => (PRINT_SUBJECT_NAMES[a] || a).localeCompare(PRINT_SUBJECT_NAMES[b] || b, 'vi'))
    .map(subj => {
      const color = TKB_CONFIG.subjectColors[subj];
      const label = PRINT_SUBJECT_NAMES[subj] || subj;
      return `
        <span class="legend-chip" style="background-color:${color.hex.bg};color:${color.hex.text};border-color:${color.hex.border};">
          ${label}
        </span>
      `;
    })
    .join('');

  if (!chips) return '';

  return `
    <div class="legend-bar">
      <span class="legend-title">Chú thích màu môn học:</span>
      ${chips}
    </div>
  `;
}

// 2. RENDER TEACHER VIEW (DYNAMIC THEO GIÁO VIÊN ĐƯỢC CHỌN + MẪU IN A4 CHUẨN)
function renderTeacherView() {
  const container = document.getElementById('teacherTimetableContainer');
  if (!container || !currentSchedule || !selectedTeacher) return;

  const teacher = TKB_CONFIG.teachers[selectedTeacher];
  if (!teacher) return;

  const tSched = {};
  let totalPeriods = 0;
  TKB_CONFIG.days.forEach(d => {
    tSched[d.id] = {};
    for (let p = 1; p <= 8; p++) tSched[d.id][p] = [];
  });

  for (let [cId, daysObj] of Object.entries(currentSchedule)) {
    for (let [dId, pObj] of Object.entries(daysObj)) {
      for (let [pNum, item] of Object.entries(pObj)) {
        if (item && item.teacher_id === selectedTeacher) {
          tSched[dId][pNum].push({ class: cId, subject: item.subject });
          totalPeriods++;
        }
      }
    }
  }

  const morningPeriods = [
    { p: 1, label: "Tiết 1", time: "(7:45 - 8:20)" },
    { p: 2, label: "Tiết 2", time: "(8:25 - 9:00)" },
    { p: 3, label: "Tiết 3", time: "(9:35 - 10:10)" },
    { p: 4, label: "Tiết 4", time: "(10:15 - 10:50)" }
  ];

  const afternoonPeriods = [
    { p: 5, label: "Tiết 5 (Chiều 1)", time: "(13:30 - 14:05)" },
    { p: 6, label: "Tiết 6 (Chiều 2)", time: "(14:10 - 14:45)" },
    { p: 7, label: "Tiết 7 (Chiều 3)", time: "(15:15 - 15:50)" },
    { p: 8, label: "Tiết 8 (CLB/Năng khiếu)", time: "(15:55 - 16:30)" }
  ];

  let html = `
    <div class="print-sheet">
      
      <!-- Top Header Row -->
      <div class="flex justify-between items-start print-header">
        <div class="text-left font-bold text-xs leading-snug uppercase text-black">
          <div>${TKB_CONFIG.school.district}</div>
          <div class="font-extrabold text-sm tracking-tight">${TKB_CONFIG.school.name}</div>
          <div class="font-normal text-[11px] normal-case text-slate-700">Năm học: ${TKB_CONFIG.school.yearShort}</div>
        </div>

        <button onclick="triggerPrint('teacher')" class="no-print px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition">
          <span>🖨️</span> BẤM ĐỂ IN LỊCH DẠY NÀY
        </button>
      </div>

      <!-- Center Title -->
      <div class="text-center my-3 print-title-box">
        <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-black">
          LỊCH GIẢNG DẠY: ${teacher.short.toUpperCase()} — ${teacher.name.toUpperCase()}
        </h2>
        <div class="text-xs text-black mt-0.5">
          Môn phụ trách: <span class="font-bold">${teacher.subject}</span> | Phân công: <span class="font-bold">${teacher.assigned}</span> | Tổng số tiết: <span class="font-bold text-blue-900">${totalPeriods} tiết/tuần</span>
        </div>
      </div>

      <!-- Table Grid (Chuẩn Form In A4 Ngang) -->
      <table class="tkb-print-table">
        <thead>
          <tr>
            <th class="session-col">BUỔI</th>
            <th class="period-col">TIẾT / GIỜ</th>
            ${TKB_CONFIG.days.map(d => `<th class="w-1/5">${d.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  // Morning (Sáng) - 4 Rows
  morningPeriods.forEach((item, idx) => {
    html += `<tr>`;
    if (idx === 0) {
      html += `
        <td rowspan="4" class="session-col bg-white font-black text-black">
          SÁNG
        </td>
      `;
    }
    html += `
      <td class="period-col">
        ${item.label}
        <span class="period-time">${item.time}</span>
      </td>
    `;
    TKB_CONFIG.days.forEach(d => {
      const entries = tSched[d.id][item.p] || [];
      html += `<td class="subject-cell">`;
      if (entries.length > 0) {
        if (entries.length === 1) {
          html += `Lớp ${entries[0].class} (${entries[0].subject})`;
        } else {
          html += `Toàn trường (${entries.length} lớp)`;
        }
      } else {
        html += `-`;
      }
      html += `</td>`;
    });
    html += `</tr>`;
  });

  // Afternoon (Chiều) - 4 Rows
  afternoonPeriods.forEach((item, idx) => {
    html += `<tr>`;
    if (idx === 0) {
      html += `
        <td rowspan="4" class="session-col bg-white font-black text-black">
          CHIỀU
        </td>
      `;
    }
    html += `
      <td class="period-col">
        ${item.label}
        <span class="period-time">${item.time}</span>
      </td>
    `;
    TKB_CONFIG.days.forEach(d => {
      const entries = tSched[d.id][item.p] || [];
      html += `<td class="subject-cell">`;
      if (entries.length > 0) {
        if (entries.length === 1) {
          html += `Lớp ${entries[0].class} (${entries[0].subject})`;
        } else {
          html += `Toàn trường (${entries.length} lớp)`;
        }
      } else {
        html += `-`;
      }
      html += `</td>`;
    });
    html += `</tr>`;
  });

  html += `
        </tbody>
      </table>

      <!-- Dynamic Signatures Footer Area -->
      <div class="flex justify-between items-start pt-4 px-4 text-xs text-black font-semibold print-signature-box">
        <div class="text-center w-64">
          <div class="font-bold uppercase">GIÁO VIÊN GIẢNG DẠY</div>
          <div class="italic text-[10.5px] font-normal text-slate-700">(Ký và ghi rõ họ tên)</div>
          <div class="mt-12 font-bold text-sm print-signature-name">${teacher.name}</div>
        </div>

        <div class="text-center w-64">
          <div class="italic text-[11px] font-normal mb-0.5">TP. Hồ Chí Minh, ngày ..... tháng ..... năm 2026</div>
          <div class="font-bold uppercase">HIỆU TRƯỞNG</div>
          <div class="italic text-[10.5px] font-normal text-slate-700">(Ký và đóng dấu)</div>
          <div class="mt-12 font-bold text-sm print-signature-name">${TKB_CONFIG.school.principal}</div>
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;
}

// 3. RENDER MASTER VIEW
function renderMasterView() {
  const container = document.getElementById('masterTimetableContainer');
  if (!container || !currentSchedule) return;

  const classKeys = Object.keys(TKB_CONFIG.classes);

  let html = `
    <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table class="w-full text-left border-collapse text-xs min-w-[1200px]">
        <thead>
          <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold sticky top-0 z-10">
            <th class="py-2.5 px-3 border-r border-slate-200 text-center w-20">Lớp</th>
            ${TKB_CONFIG.days.map(d => `
              <th colspan="8" class="py-2 px-1 text-center border-r border-slate-300 last:border-r-0 bg-slate-100 font-bold">
                ${d.name} (T1 - T8)
              </th>
            `).join('')}
          </tr>
          <tr class="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-mono text-center">
            <th class="py-1 px-2 border-r border-slate-200"></th>
            ${TKB_CONFIG.days.map(() => `
              <th class="py-1 px-1 w-8">T1</th><th class="py-1 px-1 w-8">T2</th><th class="py-1 px-1 w-8">T3</th><th class="py-1 px-1 w-8">T4</th>
              <th class="py-1 px-1 w-8 bg-blue-50/50">T5</th><th class="py-1 px-1 w-8 bg-blue-50/50">T6</th><th class="py-1 px-1 w-8 bg-blue-50/50">T7</th><th class="py-1 px-1 w-8 bg-blue-50/50 border-r border-slate-300">T8</th>
            `).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
  `;

  classKeys.forEach(c => {
    const cInfo = TKB_CONFIG.classes[c];
    const sched = currentSchedule[c];
    html += `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2 px-2.5 font-bold text-slate-800 border-r border-slate-200 text-center bg-slate-50/50">
          <div>Lớp ${c}</div>
          <div class="text-[9px] font-normal text-slate-500 truncate max-w-[70px]">${cInfo.gvcnShort.split('(')[0]}</div>
        </td>
    `;

    TKB_CONFIG.days.forEach(d => {
      for (let p = 1; p <= 8; p++) {
        const item = sched[d.id] ? sched[d.id][p] : null;
        const isPM = p >= 5;
        const isLastDayPeriod = p === 8;
        html += `<td class="py-1.5 px-0.5 text-center text-[10px] ${isPM ? 'bg-blue-50/20' : ''} ${isLastDayPeriod ? 'border-r border-slate-300' : 'border-r border-slate-100'}">`;
        if (item) {
          const color = TKB_CONFIG.subjectColors[item.subject] || { bg: 'bg-slate-100', text: 'text-slate-800' };
          html += `
            <span class="inline-block px-1 py-0.5 rounded font-semibold ${color.bg} ${color.text} truncate max-w-[36px]" title="${item.subject} (${item.teacher_name})">
              ${item.subject}
            </span>
          `;
        } else {
          html += `<span class="text-slate-300">-</span>`;
        }
        html += `</td>`;
      }
    });

    html += `</tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// 4. RUN RULE AUDIT
function runAudit() {
  if (!solver || !currentSchedule) return;
  const audit = solver.validate(currentSchedule);

  const scoreBadge = document.getElementById('auditScoreBadge');
  if (scoreBadge) {
    if (audit.errors.length === 0) {
      scoreBadge.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5';
      scoreBadge.innerHTML = `<span>✓</span> 100% TUÂN THỦ QUY TẮC (${audit.passedRules}/${audit.rulesChecked})`;
    } else {
      scoreBadge.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1.5';
      scoreBadge.innerHTML = `<span>⚠️</span> ${audit.errors.length} LỖI PHÁT HIỆN (${audit.passedRules}/${audit.rulesChecked})`;
    }
  }

  const container = document.getElementById('auditDetailsContainer');
  if (!container) return;

  let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;

  audit.details.forEach(item => {
    html += `
      <div class="p-4 rounded-xl border ${item.passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'} flex items-start gap-3">
        <div class="w-6 h-6 rounded-full ${item.passed ? 'bg-emerald-500' : 'bg-red-500'} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
          ${item.passed ? '✓' : '✗'}
        </div>
        <div>
          <div class="font-bold text-sm ${item.passed ? 'text-emerald-900' : 'text-red-900'}">${item.name}</div>
          <div class="text-xs ${item.passed ? 'text-emerald-700' : 'text-red-700'} mt-0.5">
            ${item.passed ? 'Đã kiểm tra đối soát toàn diện - Chuẩn xác 100% không xung đột.' : 'Có vi phạm quy tắc!'}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;

  if (audit.errors.length > 0) {
    html += `
      <div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <h4 class="font-bold text-red-900 mb-2">Chi tiết các lỗi (${audit.errors.length}):</h4>
        <ul class="list-disc list-inside text-xs text-red-700 space-y-1">
          ${audit.errors.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  container.innerHTML = html;
}

// 5. RENDER REFERENCE DATA VIEW
function renderDataView() {
  const container = document.getElementById('dataTablesContainer');
  if (!container) return;

  let html = `
    <div class="space-y-8">
      <!-- 29 GVCN -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 class="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          Danh Sách 29 Giáo Viên Chủ Nhiệm (GVCN)
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th class="py-2 px-3">STT</th>
                <th class="py-2 px-3">Lớp</th>
                <th class="py-2 px-3">Khối</th>
                <th class="py-2 px-3">Họ và Tên Giáo Viên</th>
                <th class="py-2 px-3">Tên viết tắt</th>
                <th class="py-2 px-3">Các môn phụ trách</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${Object.entries(TKB_CONFIG.classes).map(([c, info], idx) => `
                <tr class="hover:bg-slate-50">
                  <td class="py-2 px-3 text-slate-400 font-mono">${idx + 1}</td>
                  <td class="py-2 px-3 font-bold text-blue-900">Lớp ${c}</td>
                  <td class="py-2 px-3">Khối ${info.grade}</td>
                  <td class="py-2 px-3 font-medium text-slate-800">${info.gvcnName}</td>
                  <td class="py-2 px-3 text-slate-600">${info.gvcnShort}</td>
                  <td class="py-2 px-3 text-slate-500">Toán, TV, Đạo đức, HĐTN(CĐ), HĐTN(SHL), Mĩ thuật,...</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 9 GV Bộ Môn -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 class="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          Danh Sách 09 Giáo Viên Bộ Môn & Tổng Phụ Trách Trường
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th class="py-2 px-3">STT</th>
                <th class="py-2 px-3">Mã GV</th>
                <th class="py-2 px-3">Họ và Tên</th>
                <th class="py-2 px-3">Tên hiển thị</th>
                <th class="py-2 px-3">Môn phụ trách</th>
                <th class="py-2 px-3">Phân công giảng dạy</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${Object.values(TKB_CONFIG.teachers).filter(t => t.type === 'specialist').map((t, idx) => `
                <tr class="hover:bg-slate-50">
                  <td class="py-2 px-3 text-slate-400 font-mono">${idx + 1}</td>
                  <td class="py-2 px-3 font-mono text-slate-600">${t.id}</td>
                  <td class="py-2 px-3 font-bold text-slate-800">${t.name}</td>
                  <td class="py-2 px-3 text-blue-700 font-medium">${t.short}</td>
                  <td class="py-2 px-3 font-semibold">${t.subject}</td>
                  <td class="py-2 px-3 text-slate-600">${t.assigned}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 18 GV Liên Kết -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 class="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          Danh Sách 18 Giáo Viên Trung Tâm Đối Tác Liên Kết
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th class="py-2 px-3">STT</th>
                <th class="py-2 px-3">Mã GV</th>
                <th class="py-2 px-3">Tên Giáo Viên Đối Tác</th>
                <th class="py-2 px-3">Tên hiển thị</th>
                <th class="py-2 px-3">Môn liên kết</th>
                <th class="py-2 px-3">Quy định & Đối tượng xếp lịch</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${Object.values(TKB_CONFIG.teachers).filter(t => t.type === 'partner').map((t, idx) => `
                <tr class="hover:bg-slate-50">
                  <td class="py-2 px-3 text-slate-400 font-mono">${idx + 1}</td>
                  <td class="py-2 px-3 font-mono text-slate-600">${t.id}</td>
                  <td class="py-2 px-3 font-bold text-slate-800">${t.name}</td>
                  <td class="py-2 px-3 text-purple-700 font-medium">${t.short}</td>
                  <td class="py-2 px-3 font-semibold">${t.subject}</td>
                  <td class="py-2 px-3 text-slate-600">${t.assigned}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// 6. REGENERATE
function handleRegenerate() {
  if (!isAdmin) {
    openAdminModal();
    return;
  }
  const seed = Math.floor(Math.random() * 1000000);
  try {
    const res = solver.solve(seed);
    currentSchedule = res.schedule;
    renderApp();
    showToast(`Đã xếp lại Thời khóa biểu thành công với mã Seed #${seed}!`);
  } catch (e) {
    alert("Không thể xếp lại TKB: " + e.message);
  }
}

// 7. EXPORT
function exportCurrentViewToCSV() {
  if (!currentSchedule) return;
  let csvContent = "\uFEFF";

  if (currentView === 'class') {
    csvContent += `THỜI KHÓA BIỂU LỚP ${selectedClass} - NĂM HỌC 2026-2027\n`;
    csvContent += `GVCN: ${TKB_CONFIG.classes[selectedClass].gvcnName}\n\n`;
    csvContent += `Buổi,Tiết,Khung Giờ,Thứ Hai,Thứ Ba,Thứ Tư,Thứ Năm,Thứ Sáu\n`;

    const sched = currentSchedule[selectedClass];
    const maxP = TKB_CONFIG.classes[selectedClass].grade <= 2 ? 7 : 8;

    for (let p = 1; p <= maxP; p++) {
      const slot = TKB_CONFIG.timeSlots.find(s => s.period === p);
      const session = p <= 4 ? "Sáng" : "Chiều";
      const time = slot ? slot.timeFull : "";
      const row = [session, `Tiết ${p}`, `"${time}"`];
      TKB_CONFIG.days.forEach(d => {
        const item = sched[d.id] ? sched[d.id][p] : null;
        row.push(item ? `"${PRINT_SUBJECT_NAMES[item.subject] || item.subject}"` : '""');
      });
      csvContent += row.join(",") + "\n";
    }
  } else if (currentView === 'teacher') {
    const teacher = TKB_CONFIG.teachers[selectedTeacher];
    csvContent += `LỊCH GIẢNG DẠY: ${teacher.short} - ${teacher.name}\n`;
    csvContent += `Môn: ${teacher.subject}\n\n`;
    csvContent += `Buổi,Tiết,Khung Giờ,Thứ Hai,Thứ Ba,Thứ Tư,Thứ Năm,Thứ Sáu\n`;

    for (let p = 1; p <= 8; p++) {
      const slot = TKB_CONFIG.timeSlots.find(s => s.period === p);
      const session = p <= 4 ? "Sáng" : "Chiều";
      const time = slot ? slot.timeFull : "";
      const row = [session, `Tiết ${p}`, `"${time}"`];
      TKB_CONFIG.days.forEach(d => {
        const matches = [];
        for (let [cId, daysObj] of Object.entries(currentSchedule)) {
          if (daysObj[d.id] && daysObj[d.id][p] && daysObj[d.id][p].teacher_id === selectedTeacher) {
            matches.push(`Lớp ${cId}`);
          }
        }
        row.push(matches.length > 0 ? `"${matches.join(', ')}"` : '""');
      });
      csvContent += row.join(",") + "\n";
    }
  } else {
    csvContent += `MA TRẬN THỜI KHÓA BIỂU TOÀN TRƯỜNG 29 LỚP - NGUYỄN AN KHƯƠNG 2026-2027\n\n`;
    const headers = ["Lớp", "Khối", "GVCN"];
    TKB_CONFIG.days.forEach(d => {
      for (let p = 1; p <= 8; p++) headers.push(`${d.id}_T${p}`);
    });
    csvContent += headers.join(",") + "\n";

    for (let [cId, cInfo] of Object.entries(TKB_CONFIG.classes)) {
      const row = [`Lớp ${cId}`, `Khối ${cInfo.grade}`, `"${cInfo.gvcnName}"`];
      TKB_CONFIG.days.forEach(d => {
        for (let p = 1; p <= 8; p++) {
          const item = currentSchedule[cId][d.id] ? currentSchedule[cId][d.id][p] : null;
          row.push(item ? `"${PRINT_SUBJECT_NAMES[item.subject] || item.subject}"` : '""');
        }
      });
      csvContent += row.join(",") + "\n";
    }
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `TKB_NguyenAnKhuong_${currentView}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportJSON() {
  if (!isAdmin) {
    openAdminModal();
    return;
  }
  const exportData = {
    version: "V2.4",
    school: TKB_CONFIG.school,
    generatedAt: new Date().toISOString(),
    schedule: currentSchedule
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `TKB_NguyenAnKhuong_V2.4_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-5 right-5 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl z-50 transition-all flex items-center gap-2';
  toast.innerHTML = `<span>✓</span><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
