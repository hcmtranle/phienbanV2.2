# HỆ THỐNG THỜI KHÓA BIỂU TỰ ĐỘNG — PHIÊN BẢN V2.3 (NĂM HỌC 2026 - 2027)
## TRƯỜNG TIỂU HỌC NGUYỄN AN KHƯƠNG — PHƯỜNG ĐÔNG HƯNG THUẬN

---

## 🌟 CÁC CẬP NHẬT NÂNG CẤP TRONG PHIÊN BẢN V2.3

1. **Quy tắc thứ tự ưu tiên các môn GVCN trong ngày (Nặng trước – Nhẹ sau):**
   * Sau khi cố định các tiết của Giáo viên bộ môn & Trung tâm liên kết, các môn do GVCN phụ trách được tự động sắp xếp theo thứ tự ưu tiên từ trên xuống trong ngày:
     1. **Tiếng Việt (`TV`)**
     2. **Toán (`Toán`)**
     3. **Khoa học (`KH`) / Lịch sử & Địa lí (`LSĐL`) / Tự nhiên & Xã hội (`TNXH`)**
     4. **Công nghệ (`CN`)**
     5. **HĐTN (Chủ đề) (`HĐTN(CĐ)`)**
     6. **Đạo đức (`ĐĐ`)**
     7. **Mĩ thuật (`NT(MT)`)**
2. **Đổi tên hiển thị môn học chuẩn xác:**
   * `Sinh hoạt lớp` $\rightarrow$ **`HĐTN (SHL)`**.
   * `Chào cờ` $\rightarrow$ **`HĐTN (Chào cờ)`**.
   * `HĐTN Chủ đề` $\rightarrow$ **`HĐTN (Chủ đề)`**.
3. **Dàn đều 1 trang A4 khổ ngang (Landscape) khi In ấn / Xuất PDF:**
   * Tự động căn chỉnh vừa khít trên đúng 1 trang A4 ngang (gồm Quốc hiệu, Tên trường, Tên lớp, Bảng 8 tiết Sáng/Chiều và Chữ ký GVCN / Hiệu trưởng Hồ Thị Ngọc Diễm).
4. **Giãn cách ngày môn 2 tiết/tuần (GDTC, TNXH, KH, LSĐL):**
   * 100% không bao giờ học 2 tiết/ngày và xếp cách nhau ít nhất 1 ngày.

---

## 💻 HƯỚNG DẪN CHI TIẾT CÁCH UPLOAD LÊN GITHUB & ĐỒNG BỘ NETLIFY (TRÊN WINDOWS)

### BƯỚC 1: Giải nén file cập nhật vào thư mục dự án trên máy
1. Tải file `tkb_nguyen_an_khuong_V2.3_2026_2027.zip` về máy tính.
2. Giải nén toàn bộ các file bên trong và chép đè (Replace all) vào thư mục dự án mà Thầy đã đưa lên GitHub trước đó.

---

### BƯỚC 2: Mở cửa sổ dòng lệnh tại đúng thư mục dự án
1. Mở thư mục dự án bằng **File Explorer** (cửa sổ quản lý file màu vàng của Windows).
2. Nhấp chuột vào **thanh địa chỉ (Address Bar)** ở trên cùng của cửa sổ thư mục.
3. Gõ chữ: `cmd` (hoặc `powershell`) rồi nhấn phím **Enter**.
4. Cửa sổ dòng lệnh màu đen sẽ hiện ra ngay tại thư mục dự án (ví dụ: `D:\tkb-nguyen-an-khuong>`).

---

### BƯỚC 3: Đẩy bản cập nhật V2.3 lên GitHub
Thầy lần lượt gõ (hoặc copy) 3 lệnh sau và nhấn Enter sau mỗi dòng:

```bash
git add .
git commit -m "Cap nhat phien ban V2.3 - Thu tu uu tien GVCN trong ngay"
git push
```

Sau khi chạy xong lệnh `git push`, toàn bộ mã nguồn V2.3 đã được đẩy lên GitHub thành công.

---

### BƯỚC 4: Kiểm tra đồng bộ tự động trên Netlify
1. Netlify được liên kết với GitHub nên **ngay khi nhận được lệnh `git push`, Netlify sẽ tự động nhận diện và cập nhật website trực tuyến** sau khoảng 5–10 giây.
2. Thầy chỉ cần truy cập vào đường link website Netlify của trường và nhấn phím **F5** (hoặc `Ctrl + F5`) để xem ngay giao diện mới nhất.

---

*Hệ thống Thời khóa biểu Trường Tiểu học Nguyễn An Khương — Năm học 2026 - 2027 (Phiên bản V2.3).*
