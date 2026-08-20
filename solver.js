// SOLVER.JS - THUẬT TOÁN XẾP THỜI KHÓA BIỂU NGUYỄN AN KHƯƠNG (PHIÊN BẢN V2.2)
// Tối ưu hóa: 100% Tiếng Anh học theo cặp 2 tiết liền (0 tiết lẻ), Giãn cách môn 2 tiết/tuần, Thứ tự ưu tiên GVCN trong ngày.

class TKBSolver {
  constructor(config) {
    this.config = config || TKB_CONFIG;
    this.days = ["T2", "T3", "T4", "T5", "T6"];
    this.classes = this.config.classes;
    this.teachers = this.config.teachers;
    this.curriculum = this.config.curriculum;
  }

  shuffle(array, rng) {
    let currentIndex = array.length, randomIndex;
    const random = rng || Math.random;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  createRNG(seed = 6) {
    let s = seed;
    return function() {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  solve(seed = 6) {
    const rng = this.createRNG(seed);
    const DAYS = this.days;
    const dayIdx = { "T2": 0, "T3": 1, "T4": 2, "T5": 3, "T6": 4 };
    const areNonConsecutive = (d1, d2) => Math.abs(dayIdx[d1] - dayIdx[d2]) >= 2;

    const CLASSES = this.classes;
    const TEACHERS = this.teachers;

    // 1. Initialize empty schedules
    const sched = {};
    for (let [c, cInfo] of Object.entries(CLASSES)) {
      const grade = cInfo.grade;
      sched[c] = {};
      for (let d of DAYS) {
        sched[c][d] = {};
        const maxP = (grade === 1 || grade === 2) ? 7 : 8;
        for (let p = 1; p <= maxP; p++) {
          sched[c][d][p] = null;
        }
      }
    }

    const teacherBusy = {};
    for (let tid of Object.keys(TEACHERS)) {
      teacherBusy[tid] = {};
      for (let d of DAYS) {
        teacherBusy[tid][d] = {};
        for (let p = 1; p <= 8; p++) {
          teacherBusy[tid][d][p] = null;
        }
      }
    }

    const assign = (c, d, p, subj, tid, tname) => {
      sched[c][d][p] = { subject: subj, teacher_id: tid, teacher_name: tname };
      if (tid !== "t_tpt_nhi" || subj !== "HĐTN(CC)") {
        teacherBusy[tid][d][p] = c;
      }
    };

    const unassign = (c, d, p) => {
      if (sched[c][d][p]) {
        const tid = sched[c][d][p].teacher_id;
        const subj = sched[c][d][p].subject;
        sched[c][d][p] = null;
        if (tid !== "t_tpt_nhi" || subj !== "HĐTN(CC)") {
          teacherBusy[tid][d][p] = null;
        }
      }
    };

    const isFree = (c, d, p, tid, isSpecialist = true) => {
      if (!sched[c][d] || sched[c][d][p] === undefined) return false;
      if (sched[c][d][p] !== null) return false;
      if (tid !== "t_tpt_nhi" && teacherBusy[tid][d][p] !== null) return false;
      if (isSpecialist) {
        let filledCnt = 0;
        for (let slotP in sched[c][d]) {
          if (sched[c][d][slotP] !== null) filledCnt++;
        }
        const maxSpec = (CLASSES[c].grade <= 2) ? 4 : 5;
        if (filledCnt >= maxSpec) return false;
      }
      return true;
    };

    const countEnglishInDay = (c, d) => {
      let cnt = 0;
      for (let p in sched[c][d]) {
        const item = sched[c][d][p];
        if (item && (item.subject === "TA" || item.subject === "TA(BN)" || item.subject === "TA(T-K)")) {
          cnt++;
        }
      }
      return cnt;
    };

    // Step 1: Fixed school-wide
    for (let c of Object.keys(CLASSES)) {
      assign(c, "T2", 1, "HĐTN(CC)", "t_tpt_nhi", "Cô Yến Nhi (TPT)");
      assign(c, "T6", 7, "HĐTN(SHL)", CLASSES[c].gvcn, CLASSES[c].gvcnName);
      if (CLASSES[c].grade === 4 || CLASSES[c].grade === 5) {
        assign(c, "T5", 8, "Tự học", CLASSES[c].gvcn, CLASSES[c].gvcnName);
      } else if (CLASSES[c].grade === 3) {
        assign(c, "T2", 8, "Tự học", CLASSES[c].gvcn, CLASSES[c].gvcnName);
        assign(c, "T3", 8, "Tự học", CLASSES[c].gvcn, CLASSES[c].gvcnName);
        assign(c, "T4", 8, "Tự học", CLASSES[c].gvcn, CLASSES[c].gvcnName);
      }
    }

    // Step 2: IC3
    const ic3Classes = Object.keys(CLASSES).filter(c => CLASSES[c].grade >= 3);
    const ic3Teachers = ["t_ic3_1", "t_ic3_2"];
    const getIc3Slots = (c) => {
      const grade = CLASSES[c].grade;
      const slots = [];
      for (let d of ["T2", "T3", "T4", "T5", "T6"]) slots.push([d, 5, 6]);
      if (grade === 3) slots.push(["T5", 7, 8]);
      else for (let d of ["T2", "T3", "T4"]) slots.push([d, 7, 8]);
      return slots;
    };

    const solveIc3 = (idx = 0) => {
      if (idx === ic3Classes.length) return true;
      const c = ic3Classes[idx];
      const tid = idx < 9 ? ic3Teachers[0] : ic3Teachers[1];
      const tname = TEACHERS[tid].short;
      const slots = this.shuffle(getIc3Slots(c), rng);
      for (let [d, p1, p2] of slots) {
        if (isFree(c, d, p1, tid) && isFree(c, d, p2, tid)) {
          assign(c, d, p1, "IC3", tid, tname);
          assign(c, d, p2, "IC3", tid, tname);
          if (solveIc3(idx + 1)) return true;
          unassign(c, d, p1);
          unassign(c, d, p2);
        }
      }
      return false;
    };
    if (!solveIc3()) throw new Error("Lỗi xếp môn Tin học IC3");

    const getDoubleSlots = (c, afternoonOnly = false) => {
      const grade = CLASSES[c].grade;
      const slots = [];
      for (let d of ["T2", "T3", "T4", "T5", "T6"]) slots.push([d, 5, 6]);
      if (grade >= 3) {
        if (grade === 3) slots.push(["T5", 7, 8]);
        else for (let d of ["T2", "T3", "T4"]) slots.push([d, 7, 8]);
      }
      if (!afternoonOnly) {
        for (let d of ["T2", "T3", "T4", "T5", "T6"]) slots.push([d, 3, 4]);
        for (let d of ["T3", "T4", "T5", "T6"]) slots.push([d, 1, 2]);
      }
      return slots;
    };

    // Step 3: TA(T-K) AVS Khối 1
    const tatkK1Classes = Object.keys(CLASSES).filter(c => CLASSES[c].grade === 1);
    const solveTatkK1 = (idx = 0) => {
      if (idx === tatkK1Classes.length) return true;
      const c = tatkK1Classes[idx];
      const tid = "t_tatk_avs";
      const tname = TEACHERS[tid].short;
      const slots = this.shuffle(getDoubleSlots(c), rng);
      for (let [d, p1, p2] of slots) {
        if (d === "T2" && (p1 === 2 || p2 === 2)) continue;
        if (countEnglishInDay(c, d) + 2 <= 2 && isFree(c, d, p1, tid) && isFree(c, d, p2, tid)) {
          assign(c, d, p1, "TA(T-K)", tid, tname);
          assign(c, d, p2, "TA(T-K)", tid, tname);
          if (solveTatkK1(idx + 1)) return true;
          unassign(c, d, p1);
          unassign(c, d, p2);
        }
      }
      return false;
    };
    if (!solveTatkK1()) throw new Error("Lỗi xếp TA(T-K) AVS");

    // Step 4: TA(T-K) Khối 2-5
    const tatkK25Classes = Object.keys(CLASSES).filter(c => CLASSES[c].grade >= 2);
    const tatkK25Teachers = ["t_tatk_1", "t_tatk_2"];
    const solveTatkK25 = (idx = 0) => {
      if (idx === tatkK25Classes.length) return true;
      const c = tatkK25Classes[idx];
      const tid = idx < 12 ? tatkK25Teachers[0] : tatkK25Teachers[1];
      const tname = TEACHERS[tid].short;
      const slots = this.shuffle(getDoubleSlots(c), rng);
      for (let [d, p1, p2] of slots) {
        if (d === "T2" && (p1 === 2 || p2 === 2)) continue;
        if (countEnglishInDay(c, d) + 2 <= 2 && isFree(c, d, p1, tid) && isFree(c, d, p2, tid)) {
          assign(c, d, p1, "TA(T-K)", tid, tname);
          assign(c, d, p2, "TA(T-K)", tid, tname);
          if (solveTatkK25(idx + 1)) return true;
          unassign(c, d, p1);
          unassign(c, d, p2);
        }
      }
      return false;
    };
    if (!solveTatkK25()) throw new Error("Lỗi xếp TA(T-K) Khối 2-5");

    // Step 5: TA(BN)
    const tabnClasses = Object.keys(CLASSES);
    const tabnTeachers = ["t_tabn_1", "t_tabn_2", "t_tabn_3"];
    const solveTabn = (idx = 0) => {
      if (idx === tabnClasses.length) return true;
      const c = tabnClasses[idx];
      const tid = idx < 10 ? tabnTeachers[0] : (idx < 20 ? tabnTeachers[1] : tabnTeachers[2]);
      const tname = TEACHERS[tid].short;
      const slots = this.shuffle(getDoubleSlots(c), rng);
      for (let [d, p1, p2] of slots) {
        if (d === "T2" && (p1 === 2 || p2 === 2)) continue;
        if (countEnglishInDay(c, d) + 2 <= 2 && isFree(c, d, p1, tid) && isFree(c, d, p2, tid)) {
          assign(c, d, p1, "TA(BN)", tid, tname);
          assign(c, d, p2, "TA(BN)", tid, tname);
          if (solveTabn(idx + 1)) return true;
          unassign(c, d, p1);
          unassign(c, d, p2);
        }
      }
      return false;
    };
    if (!solveTabn()) throw new Error("Lỗi xếp TA(BN)");

    // Step 6: TA Chính khóa - KHÓA CỨNG CẶP 2 TIẾT LIỀN NHAU (1 Cặp Khối 1-2, 2 Cặp Khối 3-5)
    const taClasses = Object.keys(CLASSES);
    const solveTa = (idx = 0) => {
      if (idx === taClasses.length) return true;
      const c = taClasses[idx];
      const grade = CLASSES[c].grade;
      const tid = CLASSES[c].taTeacher;
      const tname = TEACHERS[tid].short;
      const neededPairs = grade <= 2 ? 1 : 2;

      const availDays = DAYS.filter(d => countEnglishInDay(c, d) === 0);
      const doubleSlotsByDay = {};
      for (let d of availDays) {
        doubleSlotsByDay[d] = [];
        if (isFree(c, d, 3, tid) && isFree(c, d, 4, tid)) doubleSlotsByDay[d].push([d, 3, 4]);
        if (d !== "T2" && isFree(c, d, 1, tid) && isFree(c, d, 2, tid)) doubleSlotsByDay[d].push([d, 1, 2]);
        if (isFree(c, d, 5, tid) && isFree(c, d, 6, tid)) doubleSlotsByDay[d].push([d, 5, 6]);
        if (grade >= 3) {
          if (grade === 3 && d === "T5" && isFree(c, d, 7, tid) && isFree(c, d, 8, tid)) doubleSlotsByDay[d].push([d, 7, 8]);
          else if (grade >= 4 && ["T2", "T3", "T4"].includes(d) && isFree(c, d, 7, tid) && isFree(c, d, 8, tid)) doubleSlotsByDay[d].push([d, 7, 8]);
        }
      }

      const patterns = [];
      if (neededPairs === 1) {
        for (let d of Object.keys(doubleSlotsByDay)) {
          for (let s of doubleSlotsByDay[d]) patterns.push([s]);
        }
      } else {
        const validDays = Object.keys(doubleSlotsByDay).filter(d => doubleSlotsByDay[d].length > 0);
        for (let i = 0; i < validDays.length; i++) {
          for (let j = i + 1; j < validDays.length; j++) {
            const d1 = validDays[i], d2 = validDays[j];
            for (let s1 of doubleSlotsByDay[d1]) {
              for (let s2 of doubleSlotsByDay[d2]) {
                patterns.push([s1, s2]);
              }
            }
          }
        }
      }

      this.shuffle(patterns, rng);
      for (let pat of patterns.slice(0, 50)) {
        let allOk = true;
        for (let [d, p1, p2] of pat) {
          if (!isFree(c, d, p1, tid) || !isFree(c, d, p2, tid)) { allOk = false; break; }
        }
        if (allOk) {
          for (let [d, p1, p2] of pat) {
            assign(c, d, p1, "TA", tid, tname);
            assign(c, d, p2, "TA", tid, tname);
          }
          if (solveTa(idx + 1)) return true;
          for (let [d, p1, p2] of pat) {
            unassign(c, d, p1);
            unassign(c, d, p2);
          }
        }
      }
      return false;
    };
    if (!solveTa()) throw new Error("Lỗi xếp TA chính khóa");

    // Step 7: GDTC (2 periods on 2 NON-CONSECUTIVE days: |d1 - d2| >= 2)
    const gdtcClasses = Object.keys(CLASSES);
    const solveGdtc = (idx = 0) => {
      if (idx === gdtcClasses.length) return true;
      const c = gdtcClasses[idx];
      const grade = CLASSES[c].grade;
      const tid = CLASSES[c].gdtcTeacher;
      const tname = TEACHERS[tid] ? TEACHERS[tid].short : CLASSES[c].gvcnName;
      const maxP = grade <= 2 ? 7 : 8;
      const byDay = {};
      for (let d of DAYS) {
        byDay[d] = [];
        for (let p = 1; p <= maxP; p++) {
          if (isFree(c, d, p, tid)) byDay[d].push(p);
        }
      }
      const availDays = DAYS.filter(d => byDay[d].length > 0);
      const patterns = [];
      for (let i = 0; i < availDays.length; i++) {
        for (let j = i + 1; j < availDays.length; j++) {
          const d1 = availDays[i], d2 = availDays[j];
          if (!areNonConsecutive(d1, d2)) continue;
          for (let p1 of byDay[d1]) {
            for (let p2 of byDay[d2]) {
              patterns.push([[d1, p1], [d2, p2]]);
            }
          }
        }
      }
      this.shuffle(patterns, rng);
      for (let pat of patterns.slice(0, 40)) {
        if (isFree(c, pat[0][0], pat[0][1], tid) && isFree(c, pat[1][0], pat[1][1], tid)) {
          assign(c, pat[0][0], pat[0][1], "GDTC", tid, tname);
          assign(c, pat[1][0], pat[1][1], "GDTC", tid, tname);
          if (solveGdtc(idx + 1)) return true;
          unassign(c, pat[0][0], pat[0][1]);
          unassign(c, pat[1][0], pat[1][1]);
        }
      }
      return false;
    };
    if (!solveGdtc()) throw new Error("Lỗi xếp môn GDTC");

    // Step 8: Âm nhạc
    const anClasses = Object.keys(CLASSES);
    const solveAn = (idx = 0) => {
      if (idx === anClasses.length) return true;
      const c = anClasses[idx];
      const grade = CLASSES[c].grade;
      const tid = CLASSES[c].anTeacher;
      const tname = TEACHERS[tid] ? TEACHERS[tid].short : CLASSES[c].gvcnName;
      const maxP = grade <= 2 ? 7 : 8;
      const slots = [];
      for (let d of DAYS) {
        for (let p = 1; p <= maxP; p++) {
          if (isFree(c, d, p, tid)) slots.push([d, p]);
        }
      }
      this.shuffle(slots, rng);
      for (let [d, p] of slots) {
        assign(c, d, p, "NT(ÂN)", tid, tname);
        if (solveAn(idx + 1)) return true;
        unassign(c, d, p);
      }
      return false;
    };
    if (!solveAn()) throw new Error("Lỗi xếp môn Âm nhạc");

    // Step 9: Tin học TH(2018)
    const thClasses = Object.keys(CLASSES);
    const solveTh = (idx = 0) => {
      if (idx === thClasses.length) return true;
      const c = thClasses[idx];
      const grade = CLASSES[c].grade;
      const tid = CLASSES[c].thTeacher;
      const tname = TEACHERS[tid] ? TEACHERS[tid].short : CLASSES[c].gvcnName;
      const maxP = grade <= 2 ? 7 : 8;
      const slots = [];
      for (let d of DAYS) {
        for (let p = 1; p <= maxP; p++) {
          if (isFree(c, d, p, tid)) slots.push([d, p]);
        }
      }
      this.shuffle(slots, rng);
      for (let [d, p] of slots) {
        assign(c, d, p, "TH", tid, tname);
        if (solveTh(idx + 1)) return true;
        unassign(c, d, p);
      }
      return false;
    };
    if (!solveTh()) throw new Error("Lỗi xếp môn Tin học TH");

    // Step 10: Môn liên kết chiều
    const cdsClasses = Object.keys(CLASSES).filter(c => CLASSES[c].grade <= 2);
    const solveCds = (idx = 0) => {
      if (idx === cdsClasses.length) return true;
      const c = cdsClasses[idx];
      const tid = idx < 6 ? "t_cds_1" : "t_cds_2";
      const tname = TEACHERS[tid].short;
      const slots = [];
      for (let d of DAYS) {
        for (let p of [5, 6, 7]) {
          if (isFree(c, d, p, tid)) slots.push([d, p]);
        }
      }
      this.shuffle(slots, rng);
      for (let [d, p] of slots) {
        assign(c, d, p, "CDS", tid, tname);
        if (solveCds(idx + 1)) return true;
        unassign(c, d, p);
      }
      return false;
    };
    if (!solveCds()) throw new Error("Lỗi xếp môn Công dân số");

    const knsClasses = Object.keys(CLASSES).filter(c => CLASSES[c].grade >= 3);
    const solveKns = (idx = 0) => {
      if (idx === knsClasses.length) return true;
      const c = knsClasses[idx];
      const tid = idx < 9 ? "t_kns_1" : "t_kns_2";
      const tname = TEACHERS[tid].short;
      const slots = [];
      for (let d of DAYS) {
        for (let p of [5, 6, 7, 8]) {
          if (isFree(c, d, p, tid)) slots.push([d, p]);
        }
      }
      this.shuffle(slots, rng);
      for (let [d, p] of slots) {
        assign(c, d, p, "CLB KNS", tid, tname);
        if (solveKns(idx + 1)) return true;
        unassign(c, d, p);
      }
      return false;
    };
    if (!solveKns()) throw new Error("Lỗi xếp môn CLB KNS");

    const stemClasses = Object.keys(CLASSES);
    const solveStem = (idx = 0) => {
      if (idx === stemClasses.length) return true;
      const c = stemClasses[idx];
      const grade = CLASSES[c].grade;
      const tid = idx < 10 ? "t_stem_1" : (idx < 20 ? "t_stem_2" : "t_stem_3");
      const tname = TEACHERS[tid].short;
      const maxP = grade <= 2 ? 7 : 8;
      const slots = [];
      for (let d of DAYS) {
        for (let p = 5; p <= maxP; p++) {
          if (isFree(c, d, p, tid)) slots.push([d, p]);
        }
      }
      this.shuffle(slots, rng);
      for (let [d, p] of slots) {
        assign(c, d, p, "CLB Stem", tid, tname);
        if (solveStem(idx + 1)) return true;
        unassign(c, d, p);
      }
      return false;
    };
    if (!solveStem()) throw new Error("Lỗi xếp môn CLB Stem");

    const ttdClasses = Object.keys(CLASSES);
    const solveTtd = (idx = 0) => {
      if (idx === ttdClasses.length) return true;
      const c = ttdClasses[idx];
      const grade = CLASSES[c].grade;
      const tid = idx < 10 ? "t_toantuduy_1" : (idx < 20 ? "t_toantuduy_2" : "t_toantuduy_3");
      const tname = TEACHERS[tid].short;
      const maxP = grade <= 2 ? 7 : 8;
      const slots = [];
      for (let d of DAYS) {
        for (let p = 5; p <= maxP; p++) {
          if (isFree(c, d, p, tid)) slots.push([d, p]);
        }
      }
      this.shuffle(slots, rng);
      for (let [d, p] of slots) {
        assign(c, d, p, "CLB Toán TD", tid, tname);
        if (solveTtd(idx + 1)) return true;
        unassign(c, d, p);
      }
      return false;
    };
    if (!solveTtd()) throw new Error("Lỗi xếp môn CLB Toán TD");

    // Step 11: GVCN Core Subjects Filling (With pedagogical hierarchy priority)
    const GVCN_PRIORITY = { "TV": 1, "Toán": 2, "KH": 3, "LSĐL": 4, "TNXH": 5, "CN": 6, "HĐTN(CĐ)": 7, "ĐĐ": 8, "NT(MT)": 9 };

    for (let [c, cInfo] of Object.entries(CLASSES)) {
      const grade = cInfo.grade;
      const gvcnId = cInfo.gvcn;
      const gvcnName = cInfo.gvcnName;
      const maxP = grade <= 2 ? 7 : 8;

      const emptySlots = {};
      for (let d of DAYS) {
        emptySlots[d] = [];
        for (let p = 1; p <= maxP; p++) {
          if (sched[c][d][p] === null) emptySlots[d].push(p);
        }
      }

      const assignSlot = (d, subj) => {
        const p = emptySlots[d].shift();
        assign(c, d, p, subj, gvcnId, gvcnName);
      };

      if (grade === 1) {
        const daysSorted = [...DAYS].sort((a, b) => emptySlots[b].length - emptySlots[a].length);
        const threeTvDays = daysSorted.slice(0, 2);
        const twoTvDays = DAYS.filter(d => !threeTvDays.includes(d));

        for (let d of threeTvDays) {
          for (let i = 0; i < 3; i++) assignSlot(d, "TV");
        }
        for (let d of twoTvDays) {
          for (let i = 0; i < 2; i++) assignSlot(d, "TV");
          assignSlot(d, "Toán");
        }

        const hdtnD = emptySlots["T4"].length > 0 ? "T4" : (emptySlots["T3"].length > 0 ? "T3" : "T5");
        assignSlot(hdtnD, "HĐTN(CĐ)");

        const avail = DAYS.filter(d => emptySlots[d].length > 0);
        let pair = null;
        for (let i = 0; i < avail.length; i++) {
          for (let j = i + 1; j < avail.length; j++) {
            if (areNonConsecutive(avail[i], avail[j])) { pair = [avail[i], avail[j]]; break; }
          }
          if (pair) break;
        }
        if (pair) {
          assignSlot(pair[0], "TNXH");
          assignSlot(pair[1], "TNXH");
        }

        const rem = ["ĐĐ", "NT(MT)"];
        for (let d of DAYS) {
          while (emptySlots[d].length > 0 && rem.length > 0) {
            assignSlot(d, rem.shift());
          }
        }
      } else if (grade === 2) {
        for (let d of DAYS) {
          for (let i = 0; i < 2; i++) assignSlot(d, "TV");
          assignSlot(d, "Toán");
        }

        const hdtnD = emptySlots["T4"].length > 0 ? "T4" : (emptySlots["T3"].length > 0 ? "T3" : "T5");
        assignSlot(hdtnD, "HĐTN(CĐ)");

        const avail = DAYS.filter(d => emptySlots[d].length > 0);
        let pair = null;
        for (let i = 0; i < avail.length; i++) {
          for (let j = i + 1; j < avail.length; j++) {
            if (areNonConsecutive(avail[i], avail[j])) { pair = [avail[i], avail[j]]; break; }
          }
          if (pair) break;
        }
        if (pair) {
          assignSlot(pair[0], "TNXH");
          assignSlot(pair[1], "TNXH");
        }

        const rem = ["ĐĐ", "NT(MT)"];
        for (let d of DAYS) {
          while (emptySlots[d].length > 0 && rem.length > 0) {
            assignSlot(d, rem.shift());
          }
        }
      } else if (grade === 3) {
        const hdtnD = emptySlots["T4"].length > 0 ? "T4" : (emptySlots["T3"].length > 0 ? "T3" : "T5");
        assignSlot(hdtnD, "HĐTN(CĐ)");

        const avail = DAYS.filter(d => emptySlots[d].length > 0);
        let pair = null;
        for (let i = 0; i < avail.length; i++) {
          for (let j = i + 1; j < avail.length; j++) {
            if (areNonConsecutive(avail[i], avail[j])) { pair = [avail[i], avail[j]]; break; }
          }
          if (pair) break;
        }
        if (pair) {
          assignSlot(pair[0], "TNXH");
          assignSlot(pair[1], "TNXH");
        }

        for (let d of DAYS) {
          const mathP = emptySlots[d].pop();
          assign(c, d, mathP, "Toán", gvcnId, gvcnName);
        }

        const rem = Array(7).fill("TV").concat(["ĐĐ", "NT(MT)", "CN"]);
        for (let d of DAYS) {
          while (emptySlots[d].length > 0 && rem.length > 0) {
            assignSlot(d, rem.shift());
          }
        }
      } else if (grade === 4 || grade === 5) {
        const hdtnD = emptySlots["T4"].length > 0 ? "T4" : (emptySlots["T3"].length > 0 ? "T3" : "T5");
        assignSlot(hdtnD, "HĐTN(CĐ)");

        const availKh = DAYS.filter(d => emptySlots[d].length > 0);
        let khPair = null;
        for (let i = 0; i < availKh.length; i++) {
          for (let j = i + 1; j < availKh.length; j++) {
            if (areNonConsecutive(availKh[i], availKh[j])) { khPair = [availKh[i], availKh[j]]; break; }
          }
          if (khPair) break;
        }
        if (khPair) {
          assignSlot(khPair[0], "KH");
          assignSlot(khPair[1], "KH");
        }

        const availLsdl = DAYS.filter(d => emptySlots[d].length > 0);
        let lsdlPair = null;
        for (let i = 0; i < availLsdl.length; i++) {
          for (let j = i + 1; j < availLsdl.length; j++) {
            if (areNonConsecutive(availLsdl[i], availLsdl[j])) { lsdlPair = [availLsdl[i], availLsdl[j]]; break; }
          }
          if (lsdlPair) break;
        }
        if (lsdlPair) {
          assignSlot(lsdlPair[0], "LSĐL");
          assignSlot(lsdlPair[1], "LSĐL");
        }

        for (let d of DAYS) {
          const mathP = emptySlots[d].pop();
          assign(c, d, mathP, "Toán", gvcnId, gvcnName);
        }

        const rem = Array(7).fill("TV").concat(["ĐĐ", "NT(MT)", "CN"]);
        for (let d of DAYS) {
          while (emptySlots[d].length > 0 && rem.length > 0) {
            assignSlot(d, rem.shift());
          }
        }
      }

      // Re-order within each day according to pedagogical priority:
      // TV (1) -> Toán (2) -> KH/LSĐL/TNXH (3/4/5) -> CN (6) -> HĐTN(CĐ) (7) -> ĐĐ (8) -> NT(MT) (9)
      for (let d of DAYS) {
        const gvcnSlots = [];
        for (let p = 1; p <= maxP; p++) {
          const item = sched[c][d][p];
          if (item && GVCN_PRIORITY[item.subject]) {
            gvcnSlots.push({ p, subj: item.subject });
          }
        }
        if (gvcnSlots.length > 1) {
          const subjsSorted = gvcnSlots.map(s => s.subj).sort((a, b) => (GVCN_PRIORITY[a] || 99) - (GVCN_PRIORITY[b] || 99));
          for (let i = 0; i < gvcnSlots.length; i++) {
            sched[c][d][gvcnSlots[i].p].subject = subjsSorted[i];
          }
        }
      }
    }

    return { schedule: sched, teacherBusy };
  }

  // Audit and Validate Schedule (Comprehensive 16 Rules)
  validate(sched) {
    const DAYS = this.days;
    const dayIdx = { "T2": 0, "T3": 1, "T4": 2, "T5": 3, "T6": 4 };
    const areNonConsecutive = (d1, d2) => Math.abs(dayIdx[d1] - dayIdx[d2]) >= 2;

    const CLASSES = this.classes;
    const CURRICULUM = this.curriculum;
    const errors = [];
    const stats = {
      totalClasses: Object.keys(CLASSES).length,
      totalPeriods: 0,
      rulesChecked: 16,
      passedRules: 0,
      details: []
    };

    // Rule 1: Chào cờ T2 Tiết 1
    let rule1Ok = true;
    for (let c of Object.keys(CLASSES)) {
      if (!sched[c]["T2"][1] || sched[c]["T2"][1].subject !== "HĐTN(CC)") {
        errors.push(`Lớp ${c}: Thứ 2 Tiết 1 không phải Chào cờ!`);
        rule1Ok = false;
      }
    }
    stats.details.push({ id: 1, name: "Chào cờ toàn trường (Thứ 2 Tiết 1 - Cô Yến Nhi TPT)", passed: rule1Ok });

    // Rule 2: Sinh hoạt lớp T6 Tiết 7
    let rule2Ok = true;
    for (let c of Object.keys(CLASSES)) {
      if (!sched[c]["T6"][7] || sched[c]["T6"][7].subject !== "HĐTN(SHL)") {
        errors.push(`Lớp ${c}: Thứ 6 Tiết 7 không phải Sinh hoạt lớp!`);
        rule2Ok = false;
      }
    }
    stats.details.push({ id: 2, name: "Sinh hoạt lớp cuối tuần (Thứ 6 Tiết 7 - 29 GVCN)", passed: rule2Ok });

    // Rule 3: Khối 1 & 2 limit: strictly 35 periods, NO Period 8
    let rule3Ok = true;
    for (let c of Object.keys(CLASSES)) {
      if (CLASSES[c].grade <= 2) {
        for (let d of DAYS) {
          if (sched[c][d][8]) {
            errors.push(`Lớp ${c} (Khối ${CLASSES[c].grade}) có Tiết 8 ngày ${d}!`);
            rule3Ok = false;
          }
        }
      }
    }
    stats.details.push({ id: 3, name: "Khối 1 & 2 đúng 35 tiết/tuần (Tuyệt đối KHÔNG có Tiết 8)", passed: rule3Ok });

    // Rule 4: Khối 3: strictly 40 periods
    let rule4Ok = true;
    for (let c of Object.keys(CLASSES)) {
      if (CLASSES[c].grade === 3) {
        let total = 0;
        for (let d of DAYS) {
          for (let p = 1; p <= 8; p++) if (sched[c][d][p]) total++;
        }
        if (total !== 40) { errors.push(`Lớp ${c} có ${total} tiết/tuần (yêu cầu 40)!`); rule4Ok = false; }
      }
    }
    stats.details.push({ id: 4, name: "Khối 3 đúng 40 tiết/tuần (37 tiết CM + 3 tiết Tự học/học có hướng dẫn)", passed: rule4Ok });

    // Rule 5: Khối 4 & 5: strictly 40 periods
    let rule5Ok = true;
    for (let c of Object.keys(CLASSES)) {
      if (CLASSES[c].grade >= 4) {
        let total = 0;
        for (let d of DAYS) {
          for (let p = 1; p <= 8; p++) if (sched[c][d][p]) total++;
        }
        if (total !== 40) { errors.push(`Lớp ${c} có ${total} tiết/tuần (yêu cầu 40)!`); rule5Ok = false; }
      }
    }
    stats.details.push({ id: 5, name: "Khối 4 & 5 đúng 40 tiết/tuần (39 tiết CM + 1 tiết Tự học Thứ 5 T8)", passed: rule5Ok });

    // Rule 6: Teacher no-double-booking
    let rule6Ok = true;
    const teacherSlots = {};
    for (let c of Object.keys(CLASSES)) {
      const grade = CLASSES[c].grade;
      const maxP = grade <= 2 ? 7 : 8;
      for (let d of DAYS) {
        for (let p = 1; p <= maxP; p++) {
          const item = sched[c][d][p];
          if (item) {
            stats.totalPeriods++;
            const tid = item.teacher_id;
            if (tid === "t_tpt_nhi" && item.subject === "HĐTN(CC)") continue;
            if (!teacherSlots[tid]) teacherSlots[tid] = {};
            const key = `${d}_${p}`;
            if (!teacherSlots[tid][key]) teacherSlots[tid][key] = [];
            teacherSlots[tid][key].push(c);
            if (teacherSlots[tid][key].length > 1) {
              errors.push(`Trùng lịch GV ${tid} tại ${d} Tiết ${p} giữa các lớp: ${teacherSlots[tid][key].join(", ")}`);
              rule6Ok = false;
            }
          }
        }
      }
    }
    stats.details.push({ id: 6, name: "Không trùng lịch giáo viên (0 lỗi trùng tiết trên toàn bộ 57 GV)", passed: rule6Ok });

    // Rule 7: Afternoon only subjects
    let rule7Ok = true;
    for (let c of Object.keys(CLASSES)) {
      const grade = CLASSES[c].grade;
      const maxP = grade <= 2 ? 7 : 8;
      for (let d of DAYS) {
        for (let p = 1; p <= maxP; p++) {
          const item = sched[c][d][p];
          if (item && ["CDS", "CLB KNS", "CLB Stem", "CLB Toán TD", "IC3"].includes(item.subject)) {
            if (p < 5) {
              errors.push(`Lớp ${c}: Môn liên kết ${item.subject} bị xếp buổi sáng Tiết ${p} ngày ${d}!`);
              rule7Ok = false;
            }
          }
        }
      }
    }
    stats.details.push({ id: 7, name: "Môn liên kết (CLB KNS, CDS, CLB Stem, CLB Toán TD, IC3) chỉ học buổi chiều", passed: rule7Ok });

    // Rule 8: Consecutive double periods for IC3, TA(BN), TA(T-K)
    let rule8Ok = true;
    for (let c of Object.keys(CLASSES)) {
      for (let d of DAYS) {
        for (let subj of ["IC3", "TA(BN)", "TA(T-K)"]) {
          const slots = [];
          for (let p in sched[c][d]) {
            if (sched[c][d][p] && sched[c][d][p].subject === subj) slots.push(parseInt(p));
          }
          if (slots.length > 0 && slots.length !== 2) {
            errors.push(`Lớp ${c}: Môn ${subj} ngày ${d} có ${slots.length} tiết (yêu cầu đúng 2 tiết liền)!`);
            rule8Ok = false;
          } else if (slots.length === 2 && Math.abs(slots[1] - slots[0]) !== 1) {
            errors.push(`Lớp ${c}: Môn ${subj} ngày ${d} bị rời rạc: Tiết ${slots.join(", ")}!`);
            rule8Ok = false;
          }
        }
      }
    }
    stats.details.push({ id: 8, name: "Tiết đôi liền nhau cho TA(BN), TA(T-K), Tin học IC3", passed: rule8Ok });

    // Rule 9: No English on Monday Period 2
    let rule9Ok = true;
    for (let c of Object.keys(CLASSES)) {
      const item = sched[c]["T2"][2];
      if (item && ["TA", "TA(BN)", "TA(T-K)"].includes(item.subject)) {
        errors.push(`Lớp ${c}: Có Tiếng Anh tại Thứ Hai Tiết 2!`);
        rule9Ok = false;
      }
    }
    stats.details.push({ id: 9, name: "Không xếp Tiếng Anh vào Thứ Hai Tiết 2", passed: rule9Ok });

    // Rule 10: 100% CÁC MÔN TIẾNG ANH ĐỀU LÀ CẶP 2 TIẾT LIỀN NHAU (0 TIẾT LẺ)
    let rule10Ok = true;
    for (let c of Object.keys(CLASSES)) {
      for (let d of DAYS) {
        const eng = [];
        for (let p in sched[c][d]) {
          const item = sched[c][d][p];
          if (item && ["TA", "TA(BN)", "TA(T-K)"].includes(item.subject)) eng.push(parseInt(p));
        }
        if (eng.length === 1) {
          errors.push(`Lớp ${c}: Có 1 tiết Tiếng Anh đơn lẻ ngày ${d} tại Tiết ${eng[0]}!`);
          rule10Ok = false;
        } else if (eng.length > 2) {
          errors.push(`Lớp ${c}: Có ${eng.length} tiết Tiếng Anh ngày ${d}!`);
          rule10Ok = false;
        } else if (eng.length === 2 && Math.abs(eng[1] - eng[0]) !== 1) {
          errors.push(`Lớp ${c}: 2 tiết Tiếng Anh ngày ${d} không liền nhau: Tiết ${eng.join(", ")}!`);
          rule10Ok = false;
        }
      }
    }
    stats.details.push({ id: 10, name: "100% Tiếng Anh (Chính khóa + Bản ngữ + Toán-Khoa) học theo Cặp 2 tiết liền (0 tiết lẻ)", passed: rule10Ok });

    // Rule 11: Grade 1 TV & Math rule (3 TV -> 0 Math)
    let rule11Ok = true;
    for (let c of Object.keys(CLASSES)) {
      if (CLASSES[c].grade === 1) {
        for (let d of DAYS) {
          let tv = 0, math = 0;
          for (let p in sched[c][d]) {
            if (sched[c][d][p]?.subject === "TV") tv++;
            if (sched[c][d][p]?.subject === "Toán") math++;
          }
          if (tv === 3 && math > 0) {
            errors.push(`Lớp ${c}: Ngày ${d} học 3 tiết TV nhưng vẫn xếp môn Toán!`);
            rule11Ok = false;
          }
        }
      }
    }
    stats.details.push({ id: 11, name: "Quy tắc sư phạm Khối 1 (Ngày học 3 tiết TV không xếp Toán)", passed: rule11Ok });

    // Rule 12: HĐTN(CĐ) priority (Thứ Tư, hoặc Thứ Ba/Năm)
    let rule12Ok = true;
    for (let c of Object.keys(CLASSES)) {
      let foundDay = null;
      for (let d of DAYS) {
        for (let p in sched[c][d]) {
          if (sched[c][d][p]?.subject === "HĐTN(CĐ)") { foundDay = d; break; }
        }
      }
      if (!["T4", "T3", "T5"].includes(foundDay)) {
        errors.push(`Lớp ${c}: HĐTN(CĐ) xếp vào ${foundDay}, yêu cầu ưu tiên Thứ 4 (hoặc Thứ 3/5)!`);
        rule12Ok = false;
      }
    }
    stats.details.push({ id: 12, name: "HĐTN (Chủ đề) ưu tiên Thứ Tư (hoặc Thứ Ba/Năm - không xếp T2, T6)", passed: rule12Ok });

    // Rule 13: Pedagogical order of GVCN subjects in same day
    let rule13Ok = true;
    const gvcnRank = { "TV": 1, "Toán": 2, "KH": 3, "LSĐL": 4, "TNXH": 5, "CN": 6, "HĐTN(CĐ)": 7, "ĐĐ": 8, "NT(MT)": 9 };
    for (let c of Object.keys(CLASSES)) {
      for (let d of DAYS) {
        const slots = [];
        for (let p in sched[c][d]) {
          const s = sched[c][d][p]?.subject;
          if (s && gvcnRank[s]) slots.push({ p: parseInt(p), subj: s, rank: gvcnRank[s] });
        }
        for (let i = 0; i < slots.length; i++) {
          for (let j = i + 1; j < slots.length; j++) {
            if (slots[i].p < slots[j].p && slots[i].rank > slots[j].rank) {
              errors.push(`Lớp ${c} ngày ${d}: Môn ${slots[i].subj} (Tiết ${slots[i].p}) bị xếp trước môn ưu tiên hơn ${slots[j].subj} (Tiết ${slots[j].p})!`);
              rule13Ok = false;
            }
          }
        }
      }
    }
    stats.details.push({ id: 13, name: "Thứ tự ưu tiên môn GVCN trong ngày (TV -> Toán -> KH/LSĐL/TNXH -> CN -> HĐTN -> ĐĐ -> MT)", passed: rule13Ok });

    // Rule 14: Giãn cách ngày môn 2 tiết/tuần (GDTC, TNXH, KH, LSĐL: đúng 1 tiết/ngày, cách ngày)
    let rule14Ok = true;
    for (let [c, cInfo] of Object.entries(CLASSES)) {
      const grade = cInfo.grade;
      const maxP = grade <= 2 ? 7 : 8;

      // GDTC
      const gdtcDays = DAYS.filter(d => Object.keys(sched[c][d]).some(p => parseInt(p) <= maxP && sched[c][d][p]?.subject === "GDTC"));
      if (gdtcDays.length !== 2 || !areNonConsecutive(gdtcDays[0], gdtcDays[1])) {
        errors.push(`Lớp ${c}: GDTC học vào các ngày ${gdtcDays} (không cách ngày)!`);
        rule14Ok = false;
      }

      // TNXH (Khối 1, 2, 3)
      if (grade <= 3) {
        const tnxhDays = DAYS.filter(d => Object.keys(sched[c][d]).some(p => parseInt(p) <= maxP && sched[c][d][p]?.subject === "TNXH"));
        if (tnxhDays.length !== 2 || !areNonConsecutive(tnxhDays[0], tnxhDays[1])) {
          errors.push(`Lớp ${c}: TNXH học vào các ngày ${tnxhDays} (không cách ngày)!`);
          rule14Ok = false;
        }
      }

      // KH & LSĐL (Khối 4, 5)
      if (grade >= 4) {
        const khDays = DAYS.filter(d => Object.keys(sched[c][d]).some(p => parseInt(p) <= maxP && sched[c][d][p]?.subject === "KH"));
        if (khDays.length !== 2 || !areNonConsecutive(khDays[0], khDays[1])) {
          errors.push(`Lớp ${c}: Khoa học học vào các ngày ${khDays} (không cách ngày)!`);
          rule14Ok = false;
        }
        const lsdlDays = DAYS.filter(d => Object.keys(sched[c][d]).some(p => parseInt(p) <= maxP && sched[c][d][p]?.subject === "LSĐL"));
        if (lsdlDays.length !== 2 || !areNonConsecutive(lsdlDays[0], lsdlDays[1])) {
          errors.push(`Lớp ${c}: LS&ĐL học vào các ngày ${lsdlDays} (không cách ngày)!`);
          rule14Ok = false;
        }
      }
    }
    stats.details.push({ id: 14, name: "Giãn cách môn 2 tiết/tuần (GDTC, TNXH, KH, LSĐL: 1 tiết/ngày, cách ngày)", passed: rule14Ok });

    // Rule 15: Tuyệt đối không quá 1 tiết/ngày cho các môn 2 tiết/tuần
    let rule15Ok = true;
    for (let c of Object.keys(CLASSES)) {
      for (let d of DAYS) {
        for (let subj of ["GDTC", "TNXH", "KH", "LSĐL"]) {
          let cnt = 0;
          for (let p in sched[c][d]) {
            if (sched[c][d][p]?.subject === subj) cnt++;
          }
          if (cnt > 1) {
            errors.push(`Lớp ${c}: Môn ${subj} có ${cnt} tiết trong cùng ngày ${d}!`);
            rule15Ok = false;
          }
        }
      }
    }
    stats.details.push({ id: 15, name: "Không học 2 tiết/ngày cho GDTC, TNXH, KH, LSĐL", passed: rule15Ok });

    // Rule 16: Curriculum distribution match
    let rule16Ok = true;
    for (let [c, cInfo] of Object.entries(CLASSES)) {
      const grade = cInfo.grade;
      const curr = CURRICULUM[grade];
      const counts = {};
      for (let d of DAYS) {
        for (let p in sched[c][d]) {
          const s = sched[c][d][p]?.subject;
          if (s) counts[s] = (counts[s] || 0) + 1;
        }
      }
      for (let [subj, exp] of Object.entries(curr)) {
        if ((counts[subj] || 0) !== exp) {
          errors.push(`Lớp ${c}: Môn ${subj} có ${counts[subj] || 0} tiết (chuẩn ${exp} tiết)!`);
          rule16Ok = false;
        }
      }
    }
    stats.details.push({ id: 16, name: "Chuẩn phân phối chương trình GDPT 2018 cho 29 lớp", passed: rule16Ok });

    stats.passedRules = stats.details.filter(d => d.passed).length;
    stats.errors = errors;
    return stats;
  }
}

if (typeof module !== 'undefined') {
  module.exports = { TKBSolver };
}
