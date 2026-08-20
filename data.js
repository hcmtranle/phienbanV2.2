// DATA.JS - TRƯỜNG TIỂU HỌC NGUYỄN AN KHƯƠNG (PHIÊN BẢN V2.2)
const TKB_CONFIG = {
  school: {
    name: "TRƯỜNG TIỂU HỌC NGUYỄN AN KHƯƠNG",
    district: "UỶ BAN NHÂN DÂN PHƯỜNG ĐÔNG HƯNG THUẬN",
    principal: "Hồ Thị Ngọc Diễm",
    year: "2026 - 2027",
    yearShort: "2026-2027",
    scale: "29 Lớp (Khối 1 - 5) | 57 Giáo viên",
    adminPass: "Tram@0211"
  },
  days: [
    { id: "T2", name: "THỨ 2", fullName: "Thứ Hai" },
    { id: "T3", name: "THỨ 3", fullName: "Thứ Ba" },
    { id: "T4", name: "THỨ 4", fullName: "Thứ Tư" },
    { id: "T5", name: "THỨ 5", fullName: "Thứ Năm" },
    { id: "T6", name: "THỨ 6", fullName: "Thứ Sáu" }
  ],
  timeSlots: [
    { period: 1, session: "SÁNG", name: "Tiết 1", label: "Tiết 1", time: "7:45 - 8:20", timeFull: "07:45 - 08:20", note: "Thứ 2: Chào cờ toàn trường" },
    { period: 2, session: "SÁNG", name: "Tiết 2", label: "Tiết 2", time: "8:25 - 9:00", timeFull: "08:25 - 09:00", note: "Không xếp Tiếng Anh Thứ 2" },
    { period: "break_am", isBreak: true, session: "Ra chơi", name: "Ra chơi sáng", label: "Ra chơi sáng", time: "9:00 - 9:35", timeFull: "09:00 - 09:35", note: "Giải lao 35 phút" },
    { period: 3, session: "SÁNG", name: "Tiết 3", label: "Tiết 3", time: "9:35 - 10:10", timeFull: "09:35 - 10:10", note: "Ca 2 buổi sáng" },
    { period: 4, session: "SÁNG", name: "Tiết 4", label: "Tiết 4", time: "10:15 - 10:50", timeFull: "10:15 - 10:50", note: "Kết thúc buổi sáng" },
    { period: "lunch", isBreak: true, session: "Nghỉ trưa", name: "Bán trú & Nghỉ trưa", label: "Bán trú", time: "10:50 - 13:30", timeFull: "10:50 - 13:30", note: "Ăn trưa, nghỉ trưa học sinh" },
    { period: 5, session: "CHIỀU", name: "Tiết 5", label: "Tiết 5 (Chiều 1)", time: "13:30 - 14:05", timeFull: "13:30 - 14:05", note: "Bắt đầu chiều - Môn liên kết" },
    { period: 6, session: "CHIỀU", name: "Tiết 6", label: "Tiết 6 (Chiều 2)", time: "14:10 - 14:45", timeFull: "14:10 - 14:45", note: "Tiết 2 chiều" },
    { period: "break_pm", isBreak: true, session: "Ra chơi", name: "Ra chơi chiều", label: "Ra chơi chiều", time: "14:45 - 15:15", timeFull: "14:45 - 15:15", note: "Giải lao 30 phút" },
    { period: 7, session: "CHIỀU", name: "Tiết 7", label: "Tiết 7 (Chiều 3)", time: "15:15 - 15:50", timeFull: "15:15 - 15:50", note: "Thứ 6: HĐTN (SHL)" },
    { period: 8, session: "CHIỀU", name: "Tiết 8", label: "Tiết 8 (CLB/Năng khiếu)", time: "15:55 - 16:30", timeFull: "15:55 - 16:30", note: "Tự học/CLB Khối 3, 4, 5 (Khối 1, 2 KHÔNG CÓ)" }
  ],
  // Ghi chú: mỗi môn có 1 mã màu riêng (hex) dùng để tô nền/màu chữ trên TKB lớp.
  // Vì các cặp 2 tiết liền nhau luôn CÙNG 1 môn nên khi tô màu theo môn, 2 ô của
  // cùng 1 cặp môn sẽ tự động hiển thị cùng màu, giúp nhận diện cặp môn dễ dàng.
  subjectColors: {
    "TV": { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-900", badge: "bg-amber-500", name: "Tiếng Việt", hex: { bg: "#fef3c7", border: "#fcd34d", text: "#78350f" } },
    "Toán": { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-900", badge: "bg-blue-600", name: "Toán", hex: { bg: "#dbeafe", border: "#93c5fd", text: "#1e3a8a" } },
    "ĐĐ": { bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-900", badge: "bg-yellow-500", name: "Đạo đức", hex: { bg: "#fef9c3", border: "#fde047", text: "#713f12" } },
    "TNXH": { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-900", badge: "bg-emerald-600", name: "Tự nhiên và Xã hội", hex: { bg: "#d1fae5", border: "#6ee7b7", text: "#064e3b" } },
    "KH": { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-900", badge: "bg-teal-600", name: "Khoa học", hex: { bg: "#ccfbf1", border: "#5eead4", text: "#134e4a" } },
    "LSĐL": { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", badge: "bg-orange-600", name: "Lịch sử và Địa lí", hex: { bg: "#ffedd5", border: "#fdba74", text: "#7c2d12" } },
    "HĐTN(CC)": { bg: "bg-red-100", border: "border-red-300", text: "text-red-900", badge: "bg-red-600", name: "HĐTN (Chào cờ)", hex: { bg: "#fee2e2", border: "#fca5a5", text: "#7f1d1d" } },
    "HĐTN(CĐ)": { bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-900", badge: "bg-rose-500", name: "HĐTN (Chủ đề)", hex: { bg: "#ffe4e6", border: "#fda4af", text: "#881337" } },
    "HĐTN(SHL)": { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-900", badge: "bg-purple-600", name: "HĐTN (SHL)", hex: { bg: "#f3e8ff", border: "#d8b4fe", text: "#581c87" } },
    "GDTC": { bg: "bg-green-100", border: "border-green-300", text: "text-green-900", badge: "bg-green-600", name: "Giáo dục thể chất", hex: { bg: "#dcfce7", border: "#86efac", text: "#14532d" } },
    "NT(MT)": { bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-900", badge: "bg-pink-500", name: "Mĩ thuật", hex: { bg: "#fce7f3", border: "#f9a8d4", text: "#831843" } },
    "NT(ÂN)": { bg: "bg-cyan-100", border: "border-cyan-300", text: "text-cyan-900", badge: "bg-cyan-600", name: "Âm nhạc", hex: { bg: "#cffafe", border: "#67e8f9", text: "#164e63" } },
    "CN": { bg: "bg-lime-100", border: "border-lime-300", text: "text-lime-900", badge: "bg-lime-600", name: "Công nghệ", hex: { bg: "#ecfccb", border: "#bef264", text: "#365314" } },
    "TA": { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900", badge: "bg-indigo-600", name: "Tiếng Anh", hex: { bg: "#e0e7ff", border: "#a5b4fc", text: "#312e81" } },
    "TH": { bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-900", badge: "bg-sky-600", name: "Tin học TH(2018)", hex: { bg: "#e0f2fe", border: "#7dd3fc", text: "#0c4a6e" } },
    "IC3": { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-900", badge: "bg-violet-600", name: "Tin học Quốc tế IC3", hex: { bg: "#ede9fe", border: "#c4b5fd", text: "#4c1d95" } },
    "CDS": { bg: "bg-fuchsia-100", border: "border-fuchsia-300", text: "text-fuchsia-900", badge: "bg-fuchsia-600", name: "Công dân số (CDS)", hex: { bg: "#fae8ff", border: "#f0abfc", text: "#701a75" } },
    "CLB Stem": { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-900", badge: "bg-teal-600", name: "CLB Stem", hex: { bg: "#ccfbf1", border: "#5eead4", text: "#134e4a" } },
    "CLB KNS": { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-900", badge: "bg-amber-600", name: "CLB KNS", hex: { bg: "#fef3c7", border: "#fcd34d", text: "#78350f" } },
    "TA(BN)": { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-900", badge: "bg-blue-700", name: "Tiếng Anh Bản ngữ TA(BN)", hex: { bg: "#dbeafe", border: "#60a5fa", text: "#1e3a8a" } },
    "TA(T-K)": { bg: "bg-cyan-100", border: "border-cyan-400", text: "text-cyan-900", badge: "bg-cyan-700", name: "Tiếng Anh Toán-Khoa TA(T-K)", hex: { bg: "#cffafe", border: "#22d3ee", text: "#164e63" } },
    "CLB Toán TD": { bg: "bg-emerald-100", border: "border-emerald-400", text: "text-emerald-900", badge: "bg-emerald-700", name: "CLB Toán Tư duy", hex: { bg: "#d1fae5", border: "#34d399", text: "#064e3b" } },
    "Tự học": { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-800", badge: "bg-slate-600", name: "Tự học/học có hướng dẫn", hex: { bg: "#f1f5f9", border: "#cbd5e1", text: "#1e293b" } }
  },
  classes: {
    "1.1": { grade: 1, gvcn: "gvcn_1_1", gvcnName: "Trần Thị Diễm Linh", gvcnShort: "Cô Linh (1.1)", taTeacher: "t_ta_thy", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "gvcn_1_1" },
    "1.2": { grade: 1, gvcn: "gvcn_1_2", gvcnName: "Lê Thị Hoa", gvcnShort: "Cô Hoa (1.2)", taTeacher: "t_ta_thy", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "gvcn_1_2" },
    "1.3": { grade: 1, gvcn: "gvcn_1_3", gvcnName: "Phạm Thị Ngọc Hân", gvcnShort: "Cô Hân (1.3)", taTeacher: "t_ta_thy", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "gvcn_1_3" },
    "1.4": { grade: 1, gvcn: "gvcn_1_4", gvcnName: "Hoàng Thị Hiền Nga", gvcnShort: "Cô Nga (1.4)", taTeacher: "t_ta_thy", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "gvcn_1_4" },
    "1.5": { grade: 1, gvcn: "gvcn_1_5", gvcnName: "Nguyễn Thị Phương Thảo", gvcnShort: "Cô Thảo (1.5)", taTeacher: "t_ta_thy", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "1.6": { grade: 1, gvcn: "gvcn_1_6", gvcnName: "Lê Phương Anh", gvcnShort: "Cô Phương Anh (1.6)", taTeacher: "t_ta_thy", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "2.1": { grade: 2, gvcn: "gvcn_2_1", gvcnName: "Lai Quí Phượng", gvcnShort: "Cô Phượng (2.1)", taTeacher: "t_ta_thy", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "2.2": { grade: 2, gvcn: "gvcn_2_2", gvcnName: "Dương Phạm Bích Ngân", gvcnShort: "Cô Ngân (2.2)", taTeacher: "t_ta_tam", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "2.3": { grade: 2, gvcn: "gvcn_2_3", gvcnName: "Nguyễn Thị Hải Yến", gvcnShort: "Cô Hải Yến (2.3)", taTeacher: "t_ta_tam", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "2.4": { grade: 2, gvcn: "gvcn_2_4", gvcnName: "Vương Gia Linh", gvcnShort: "Cô Gia Linh (2.4)", taTeacher: "t_ta_tam", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "2.5": { grade: 2, gvcn: "gvcn_2_5", gvcnName: "Phan Thị Thanh Tịnh", gvcnShort: "Cô Tịnh (2.5)", taTeacher: "t_ta_tam", gdtcTeacher: "t_gdtc_tien", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "2.6": { grade: 2, gvcn: "gvcn_2_6", gvcnName: "Ngô Thị Thanh Hằng", gvcnShort: "Cô Hằng (2.6)", taTeacher: "t_ta_tam", gdtcTeacher: "gvcn_2_6", anTeacher: "gvcn_2_6", thTeacher: "t_th_thai" },
    "3.1": { grade: 3, gvcn: "gvcn_3_1", gvcnName: "Nguyễn Thị Thanh Trúc", gvcnShort: "Cô Trúc (3.1)", taTeacher: "t_ta_thy", gdtcTeacher: "t_tpt_nhi", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "3.2": { grade: 3, gvcn: "gvcn_3_2", gvcnName: "Nguyễn Hoàng Yến Nhi", gvcnShort: "Cô Yến Nhi (3.2)", taTeacher: "t_ta_thy", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "3.3": { grade: 3, gvcn: "gvcn_3_3", gvcnName: "Đỗ Thị Kim Anh", gvcnShort: "Cô Kim Anh (3.3)", taTeacher: "t_ta_tam", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "3.4": { grade: 3, gvcn: "gvcn_3_4", gvcnName: "Phạm Thị Thanh Uyên", gvcnShort: "Cô Uyên (3.4)", taTeacher: "t_ta_tam", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "3.5": { grade: 3, gvcn: "gvcn_3_5", gvcnName: "Võ Thị Yến Nhi", gvcnShort: "Cô Yến Nhi (3.5)", taTeacher: "t_ta_tam", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "3.6": { grade: 3, gvcn: "gvcn_3_6", gvcnName: "Nguyễn Thanh Thảo", gvcnShort: "Cô Thảo (3.6)", taTeacher: "t_ta_trang", gdtcTeacher: "gvcn_3_6", anTeacher: "gvcn_3_6", thTeacher: "t_th_thai" },
    "4.1": { grade: 4, gvcn: "gvcn_4_1", gvcnName: "Phạm Thị Huế", gvcnShort: "Cô Huế (4.1)", taTeacher: "t_ta_phuong", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "4.2": { grade: 4, gvcn: "gvcn_4_2", gvcnName: "Trần Thị Thu Hương", gvcnShort: "Cô Thu Hương (4.2)", taTeacher: "t_ta_phuong", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "4.3": { grade: 4, gvcn: "gvcn_4_3", gvcnName: "Nguyễn Minh Thắng", gvcnShort: "Thầy Thắng (4.3)", taTeacher: "t_ta_phuong", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "4.4": { grade: 4, gvcn: "gvcn_4_4", gvcnName: "Trịnh Ngọc Minh Phương", gvcnShort: "Cô Minh Phương (4.4)", taTeacher: "t_ta_phuong", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "4.5": { grade: 4, gvcn: "gvcn_4_5", gvcnName: "Lê Thị Dạ Thảo", gvcnShort: "Cô Dạ Thảo (4.5)", taTeacher: "t_ta_phuong", gdtcTeacher: "gvcn_4_5", anTeacher: "gvcn_4_5", thTeacher: "t_th_thai" },
    "4.6": { grade: 4, gvcn: "gvcn_4_6", gvcnName: "Phạm Quỳnh Như", gvcnShort: "Cô Quỳnh Như (4.6)", taTeacher: "t_ta_phuong", gdtcTeacher: "gvcn_4_6", anTeacher: "gvcn_4_6", thTeacher: "t_th_thai" },
    "5.1": { grade: 5, gvcn: "gvcn_5_1", gvcnName: "Nguyễn Thị Tuyết Mai", gvcnShort: "Cô Tuyết Mai (5.1)", taTeacher: "t_ta_trang", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "5.2": { grade: 5, gvcn: "gvcn_5_2", gvcnName: "Trần Nguyễn Trung Trực", gvcnShort: "Thầy Trực (5.2)", taTeacher: "t_ta_trang", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "5.3": { grade: 5, gvcn: "gvcn_5_3", gvcnName: "Đặng Kim Anh", gvcnShort: "Cô Kim Anh (5.3)", taTeacher: "t_ta_trang", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "5.4": { grade: 5, gvcn: "gvcn_5_4", gvcnName: "Nguyễn Duy Đang", gvcnShort: "Thầy Đang (5.4)", taTeacher: "t_ta_trang", gdtcTeacher: "t_gdtc_phong", anTeacher: "t_an_chau", thTeacher: "t_th_thai" },
    "5.5": { grade: 5, gvcn: "gvcn_5_5", gvcnName: "Huỳnh Ngọc Trâm", gvcnShort: "Cô Trâm (5.5)", taTeacher: "t_ta_trang", gdtcTeacher: "gvcn_5_5", anTeacher: "gvcn_5_5", thTeacher: "t_th_thai" }
  },
  teachers: {
    "t_gdtc_phong": { id: "t_gdtc_phong", name: "Lưu Thanh Phong", short: "Thầy Phong (GDTC)", type: "specialist", subject: "GDTC", assigned: "12 lớp (Khối 3-5)" },
    "t_gdtc_tien": { id: "t_gdtc_tien", name: "Vũ Trần Hoàng Nhật Tiến", short: "Thầy Tiến (GDTC)", type: "specialist", subject: "GDTC", assigned: "11 lớp (Khối 1-2)" },
    "t_an_chau": { id: "t_an_chau", name: "Phạm Thị Hồng Châu", short: "Cô Châu (Âm nhạc)", type: "specialist", subject: "NT(ÂN)", assigned: "24 lớp" },
    "t_ta_trang": { id: "t_ta_trang", name: "Khưu Thị Minh Trang", short: "Cô Trang (TA)", type: "specialist", subject: "TA", assigned: "6 lớp (3.6, 5.1-5.5)" },
    "t_ta_phuong": { id: "t_ta_phuong", name: "Nguyễn Thị Kim Phượng", short: "Cô Phượng (TA)", type: "specialist", subject: "TA", assigned: "6 lớp (4.1-4.6)" },
    "t_ta_thy": { id: "t_ta_thy", name: "Nguyễn Thị Hữu Thy", short: "Cô Thy (TA)", type: "specialist", subject: "TA", assigned: "9 lớp (1.1-1.6, 2.1, 3.1-3.2)" },
    "t_ta_tam": { id: "t_ta_tam", name: "Tăng Thị Minh Tâm", short: "Cô Tâm (TA)", type: "specialist", subject: "TA", assigned: "8 lớp (2.2-2.6, 3.3-3.5)" },
    "t_th_thai": { id: "t_th_thai", name: "Phạm Lê Hoàng Thái", short: "Thầy Thái (Tin học)", type: "specialist", subject: "TH", assigned: "25 lớp" },
    "t_tpt_nhi": { id: "t_tpt_nhi", name: "Lê Phạm Yến Nhi", short: "Cô Yến Nhi (TPT)", type: "specialist", subject: "HĐTN(CC)", assigned: "Toàn trường (29 lớp) + GDTC 3.1" },

    "t_tabn_1": { id: "t_tabn_1", name: "GV TA (BN)_1", short: "GV TA-BN (1)", type: "partner", subject: "TA(BN)", assigned: "Khối 1-5 (Cặp 2 tiết)" },
    "t_tabn_2": { id: "t_tabn_2", name: "GV TA (BN)_2", short: "GV TA-BN (2)", type: "partner", subject: "TA(BN)", assigned: "Khối 1-5 (Cặp 2 tiết)" },
    "t_tabn_3": { id: "t_tabn_3", name: "GV TA (BN)_3", short: "GV TA-BN (3)", type: "partner", subject: "TA(BN)", assigned: "Khối 1-5 (Cặp 2 tiết)" },
    "t_tatk_avs": { id: "t_tatk_avs", name: "GV TA (T-K) AVS (Khối 1)", short: "TA(T-K) AVS", type: "partner", subject: "TA(T-K)", assigned: "Dành riêng Khối 1 (1.1-1.6)" },
    "t_tatk_1": { id: "t_tatk_1", name: "GV TA (T-K)_1 (Khối 2-5)", short: "GV TA-TK (1)", type: "partner", subject: "TA(T-K)", assigned: "Khối 2-5 (Cặp 2 tiết)" },
    "t_tatk_2": { id: "t_tatk_2", name: "GV TA (T-K)_2 (Khối 2-5)", short: "GV TA-TK (2)", type: "partner", subject: "TA(T-K)", assigned: "Khối 2-5 (Cặp 2 tiết)" },
    "t_ic3_1": { id: "t_ic3_1", name: "GV IC 3_1", short: "GV IC3 (1)", type: "partner", subject: "IC3", assigned: "Khối 3-5 Chiều (Cặp 2 tiết)" },
    "t_ic3_2": { id: "t_ic3_2", name: "GV IC 3_2", short: "GV IC3 (2)", type: "partner", subject: "IC3", assigned: "Khối 3-5 Chiều (Cặp 2 tiết)" },
    "t_kns_1": { id: "t_kns_1", name: "GV KNS 1", short: "GV KNS (1)", type: "partner", subject: "CLB KNS", assigned: "Khối 3-5 Chiều" },
    "t_kns_2": { id: "t_kns_2", name: "GV KNS 2", short: "GV KNS (2)", type: "partner", subject: "CLB KNS", assigned: "Khối 3-5 Chiều" },
    "t_toantuduy_1": { id: "t_toantuduy_1", name: "GV Toán Tư duy_1", short: "GV Toán TD (1)", type: "partner", subject: "CLB Toán TD", assigned: "Khối 1-5 Chiều" },
    "t_toantuduy_2": { id: "t_toantuduy_2", name: "GV Toán Tư duy_2", short: "GV Toán TD (2)", type: "partner", subject: "CLB Toán TD", assigned: "Khối 1-5 Chiều" },
    "t_toantuduy_3": { id: "t_toantuduy_3", name: "GV Toán Tư duy_3", short: "GV Toán TD (3)", type: "partner", subject: "CLB Toán TD", assigned: "Khối 1-5 Chiều" },
    "t_cds_1": { id: "t_cds_1", name: "GV Công dân số_1", short: "GV CDS (1)", type: "partner", subject: "CDS", assigned: "Khối 1-2 Chiều" },
    "t_cds_2": { id: "t_cds_2", name: "GV Công dân số_2", short: "GV CDS (2)", type: "partner", subject: "CDS", assigned: "Khối 1-2 Chiều" },
    "t_stem_1": { id: "t_stem_1", name: "GV Stem_1", short: "GV STEM (1)", type: "partner", subject: "CLB Stem", assigned: "Khối 1-5 Chiều" },
    "t_stem_2": { id: "t_stem_2", name: "GV Stem_2", short: "GV STEM (2)", type: "partner", subject: "CLB Stem", assigned: "Khối 1-5 Chiều" },
    "t_stem_3": { id: "t_stem_3", name: "GV Stem_3", short: "GV STEM (3)", type: "partner", subject: "CLB Stem", assigned: "Khối 1-5 Chiều" }
  },
  curriculum: {
    1: { "TV": 12, "Toán": 3, "ĐĐ": 1, "TNXH": 2, "HĐTN(CC)": 1, "HĐTN(CĐ)": 1, "HĐTN(SHL)": 1, "GDTC": 2, "NT(MT)": 1, "NT(ÂN)": 1, "TA": 2, "TH": 1, "CDS": 1, "CLB Stem": 1, "TA(BN)": 2, "TA(T-K)": 2, "CLB Toán TD": 1 },
    2: { "TV": 10, "Toán": 5, "ĐĐ": 1, "TNXH": 2, "HĐTN(CC)": 1, "HĐTN(CĐ)": 1, "HĐTN(SHL)": 1, "GDTC": 2, "NT(MT)": 1, "NT(ÂN)": 1, "TA": 2, "TH": 1, "CDS": 1, "CLB Stem": 1, "TA(BN)": 2, "TA(T-K)": 2, "CLB Toán TD": 1 },
    3: { "TV": 7, "Toán": 5, "ĐĐ": 1, "TNXH": 2, "HĐTN(CC)": 1, "HĐTN(CĐ)": 1, "HĐTN(SHL)": 1, "GDTC": 2, "NT(MT)": 1, "NT(ÂN)": 1, "CN": 1, "TA": 4, "TH": 1, "IC3": 2, "CLB Stem": 1, "CLB KNS": 1, "TA(BN)": 2, "TA(T-K)": 2, "CLB Toán TD": 1, "Tự học": 3 },
    4: { "TV": 7, "Toán": 5, "ĐĐ": 1, "KH": 2, "LSĐL": 2, "HĐTN(CC)": 1, "HĐTN(CĐ)": 1, "HĐTN(SHL)": 1, "GDTC": 2, "NT(MT)": 1, "NT(ÂN)": 1, "CN": 1, "TA": 4, "TH": 1, "IC3": 2, "CLB Stem": 1, "CLB KNS": 1, "TA(BN)": 2, "TA(T-K)": 2, "CLB Toán TD": 1, "Tự học": 1 },
    5: { "TV": 7, "Toán": 5, "ĐĐ": 1, "KH": 2, "LSĐL": 2, "HĐTN(CC)": 1, "HĐTN(CĐ)": 1, "HĐTN(SHL)": 1, "GDTC": 2, "NT(MT)": 1, "NT(ÂN)": 1, "CN": 1, "TA": 4, "TH": 1, "IC3": 2, "CLB Stem": 1, "CLB KNS": 1, "TA(BN)": 2, "TA(T-K)": 2, "CLB Toán TD": 1, "Tự học": 1 }
  }
};

for (let [cId, cInfo] of Object.entries(TKB_CONFIG.classes)) {
  TKB_CONFIG.teachers[cInfo.gvcn] = {
    id: cInfo.gvcn,
    name: cInfo.gvcnName,
    short: cInfo.gvcnShort,
    type: "gvcn",
    subject: "GVCN (Môn cốt lõi)",
    assigned: `Chủ nhiệm Lớp ${cId}`
  };
}

if (typeof module !== 'undefined') {
  module.exports = { TKB_CONFIG };
}
