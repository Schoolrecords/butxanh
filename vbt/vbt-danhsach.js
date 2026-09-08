/* DANH SÁCH TIẾT VỞ BÀI TẬP — nạp lười khi mở màn "Vở bài tập" (index.html không chứa gì).
   Khoá: 'L<lớp>|<Môn>'  →  { <tuần>: [ {tiet, ten, trang, tep, soSlide}, ... ] }
     tiet  : số tiết trong tuần (Toán, theo KHGD) hoặc số bài trong tuần (Tiếng Việt)
     ten   : tên bài hiện trên thẻ · trang: trang vở bài tập · soSlide: số slide
     tep   : tên tệp trên Firebase Storage (bucket but-xanh.firebasestorage.app, thư mục vbt/)
   👉 Thêm tiết mới: tải tệp HTML lên bucket rồi thêm một dòng vào đúng ô lớp·môn·tuần.
   Lớp 1 Tiếng Việt tuần 1 = tuần "Làm quen" (chưa có bài trong vở) → để trống.
   9/9/2026 (bản 169): TUẦN 2 đủ 10 ô lớp·môn — sinh từ đặc tả JSON `_vbt-tu-dung/tuan2/*.json` bằng sinh-vbt.py (xem HUONG-DAN.md). */
window.BX_VBT_DS={
  /* 9/9/2026 tối (thầy Chung): BỎ hẳn bản tự dựng — giữ ảnh vở cắt từ PDF, chỉ sửa cách ghi đáp án (phân số dọc,
     gạch ngang đặt tính, Đáp số, chữ ≥24px), bỏ PLAY/TẠM DỪNG. Toán 1: tên tệp trên bucket theo VỊ TRÍ tiết trong KHGD
     (tuần 1 tiết 1 là "Tiết học đầu tiên" nên Bài 1 tiết 1 → Tuan1_Tiet2, tiết 2 → Tuan1_Tiet3, tiết 3 → Tuan2_Tiet1). */
  'L1|Toán':{
    1:[
      {tiet:2, ten:"Bài 1. Các số 0, 1, 2, 3, 4, 5 – Tiết 1", trang:"4–5", tep:"VBT_Toan1_Tuan1_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 1. Các số 0, 1, 2, 3, 4, 5 – Tiết 2", trang:"6–7", tep:"VBT_Toan1_Tuan1_Tiet3.html", soSlide:5},
    ],
    2:[
      {tiet:1, ten:"Bài 1. Các số 0, 1, 2, 3, 4, 5 – Tiết 3", trang:"8–9", tep:"VBT_Toan1_Tuan2_Tiet1.html", soSlide:5},
      {tiet:2, ten:"Bài 2. Các số 6, 7, 8, 9, 10 – Tiết 1", trang:"10, 11", tep:"VBT_Toan1_Tuan2_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 2. Các số 6, 7, 8, 9, 10 – Tiết 2", trang:"12, 13", tep:"VBT_Toan1_Tuan2_Tiet3.html", soSlide:5},
    ],
  },
  'L2|Toán':{
    1:[
      {tiet:1, ten:"Bài 1. Ôn tập các số đến 100 – Tiết 1", trang:"5–6", tep:"VBT_Toan2_Tuan1_Tiet1.html", soSlide:5},
      {tiet:2, ten:"Bài 1. Ôn tập các số đến 100 – Tiết 2", trang:"6–7", tep:"VBT_Toan2_Tuan1_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 1. Ôn tập các số đến 100 – Tiết 3", trang:"7–9", tep:"VBT_Toan2_Tuan1_Tiet3.html", soSlide:6},
      {tiet:4, ten:"Bài 2. Tia số. Số liền trước, số liền sau – Tiết 1", trang:"10", tep:"VBT_Toan2_Tuan1_Tiet4.html", soSlide:4},
      {tiet:5, ten:"Bài 2. Tia số. Số liền trước, số liền sau – Tiết 2", trang:"11–12", tep:"VBT_Toan2_Tuan1_Tiet5.html", soSlide:6},
    ],
    2:[
      {tiet:1, ten:"Bài 3. Các thành phần của phép cộng, phép trừ – Tiết 1", trang:"13, 14", tep:"VBT_Toan2_Tuan2_Tiet1.html", soSlide:5},
      {tiet:2, ten:"Bài 3. Các thành phần của phép cộng, phép trừ – Tiết 2", trang:"14, 15", tep:"VBT_Toan2_Tuan2_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 3. Các thành phần của phép cộng, phép trừ – Tiết 3 (Luyện tập)", trang:"15, 16, 17", tep:"VBT_Toan2_Tuan2_Tiet3.html", soSlide:7},
      {tiet:4, ten:"Bài 4. Hơn, kém nhau bao nhiêu – Tiết 1", trang:"18, 19", tep:"VBT_Toan2_Tuan2_Tiet4.html", soSlide:5},
      {tiet:5, ten:"Bài 4. Hơn, kém nhau bao nhiêu – Tiết 2 (Luyện tập)", trang:"20, 21", tep:"VBT_Toan2_Tuan2_Tiet5.html", soSlide:7},
    ],
  },
  'L3|Toán':{
    1:[
      {tiet:1, ten:"Bài 1. Ôn tập các số đến 1 000 – Tiết 1", trang:"5–6", tep:"VBT_Toan3_Tuan1_Tiet1.html", soSlide:6},
      {tiet:2, ten:"Bài 1. Ôn tập các số đến 1 000 – Tiết 2", trang:"6", tep:"VBT_Toan3_Tuan1_Tiet2.html", soSlide:4},
      {tiet:3, ten:"Bài 2. Ôn tập phép cộng, phép trừ trong phạm vi 1 000 – Tiết 1", trang:"7", tep:"VBT_Toan3_Tuan1_Tiet3.html", soSlide:5},
      {tiet:4, ten:"Bài 2. Ôn tập phép cộng, phép trừ trong phạm vi 1 000 – Tiết 2", trang:"8", tep:"VBT_Toan3_Tuan1_Tiet4.html", soSlide:5},
      {tiet:5, ten:"Bài 3. Tìm thành phần trong phép cộng, phép trừ – Tiết 1", trang:"9", tep:"VBT_Toan3_Tuan1_Tiet5.html", soSlide:5},
    ],
    2:[
      {tiet:1, ten:"Bài 3. Tìm thành phần trong phép cộng, phép trừ – Tiết 2", trang:"10", tep:"VBT_Toan3_Tuan2_Tiet1.html", soSlide:5},
      {tiet:2, ten:"Bài 4. Ôn tập bảng nhân 2; 5, bảng chia 2; 5 – Tiết 1", trang:"11", tep:"VBT_Toan3_Tuan2_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 4. Ôn tập bảng nhân 2; 5, bảng chia 2; 5 – Tiết 2", trang:"12", tep:"VBT_Toan3_Tuan2_Tiet3.html", soSlide:5},
      {tiet:4, ten:"Bài 5. Bảng nhân 3, bảng chia 3 – Tiết 1", trang:"13", tep:"VBT_Toan3_Tuan2_Tiet4.html", soSlide:5},
      {tiet:5, ten:"Bài 5. Bảng nhân 3, bảng chia 3 – Tiết 2", trang:"14", tep:"VBT_Toan3_Tuan2_Tiet5.html", soSlide:5},
    ],
  },
  'L4|Toán':{
    1:[
      {tiet:1, ten:"Bài 1. Ôn tập các số đến 100 000 – Tiết 1", trang:"5–6", tep:"VBT_Toan4_Tuan1_Tiet1.html", soSlide:6},
      {tiet:2, ten:"Bài 1. Ôn tập các số đến 100 000 – Tiết 2", trang:"6–7", tep:"VBT_Toan4_Tuan1_Tiet2.html", soSlide:7},
      {tiet:3, ten:"Bài 2. Ôn tập các phép tính trong phạm vi 100 000 – Tiết 1", trang:"8–9", tep:"VBT_Toan4_Tuan1_Tiet3.html", soSlide:7},
      {tiet:4, ten:"Bài 2. Ôn tập các phép tính trong phạm vi 100 000 – Tiết 2", trang:"9–10", tep:"VBT_Toan4_Tuan1_Tiet4.html", soSlide:6},
      {tiet:5, ten:"Bài 2. Ôn tập các phép tính trong phạm vi 100 000 – Tiết 3", trang:"10–11", tep:"VBT_Toan4_Tuan1_Tiet5.html", soSlide:7},
    ],
    2:[
      {tiet:1, ten:"Bài 3. Số chẵn, số lẻ – Tiết 1", trang:"12", tep:"VBT_Toan4_Tuan2_Tiet1.html", soSlide:4},
      {tiet:2, ten:"Bài 3. Số chẵn, số lẻ – Tiết 2", trang:"12, 13", tep:"VBT_Toan4_Tuan2_Tiet2.html", soSlide:3},
      {tiet:3, ten:"Bài 3. Số chẵn, số lẻ – Tiết 3", trang:"13", tep:"VBT_Toan4_Tuan2_Tiet3.html", soSlide:3},
      {tiet:4, ten:"Bài 4. Biểu thức chứa chữ – Tiết 1", trang:"14", tep:"VBT_Toan4_Tuan2_Tiet4.html", soSlide:4},
      {tiet:5, ten:"Bài 4. Biểu thức chứa chữ – Tiết 2", trang:"15", tep:"VBT_Toan4_Tuan2_Tiet5.html", soSlide:5},
    ],
  },
  'L5|Toán':{
    1:[
      {tiet:1, ten:"Bài 1. Ôn tập số tự nhiên – Tiết 1", trang:"5–6", tep:"VBT_Toan5_Tuan1_Tiet1.html", soSlide:6},
      {tiet:2, ten:"Bài 1. Ôn tập số tự nhiên – Tiết 2", trang:"6–7", tep:"VBT_Toan5_Tuan1_Tiet2.html", soSlide:6},
      {tiet:3, ten:"Bài 2. Ôn tập các phép tính với số tự nhiên – Tiết 1", trang:"8–9", tep:"VBT_Toan5_Tuan1_Tiet3.html", soSlide:6},
      {tiet:4, ten:"Bài 2. Ôn tập các phép tính với số tự nhiên – Tiết 2", trang:"9–10", tep:"VBT_Toan5_Tuan1_Tiet4.html", soSlide:6},
      {tiet:5, ten:"Bài 3. Ôn tập phân số – Tiết 1", trang:"11–12", tep:"VBT_Toan5_Tuan1_Tiet5.html", soSlide:7},
    ],
    2:[
      {tiet:1, ten:"Bài 3. Ôn tập phân số – Tiết 2", trang:"12, 13", tep:"VBT_Toan5_Tuan2_Tiet1.html", soSlide:6},
      {tiet:2, ten:"Bài 4. Phân số thập phân", trang:"14", tep:"VBT_Toan5_Tuan2_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 5. Ôn tập các phép tính với phân số – Tiết 1", trang:"15, 16", tep:"VBT_Toan5_Tuan2_Tiet3.html", soSlide:6},
      {tiet:4, ten:"Bài 5. Ôn tập các phép tính với phân số – Tiết 2", trang:"16, 17, 18", tep:"VBT_Toan5_Tuan2_Tiet4.html", soSlide:5},
      {tiet:5, ten:"Bài 5. Ôn tập các phép tính với phân số – Tiết 3", trang:"18, 19", tep:"VBT_Toan5_Tuan2_Tiet5.html", soSlide:7},
    ],
  },
  /* Tiếng Việt 1: tuần 1 là tuần Làm quen (chưa có bài trong vở); Bài 1 A a, Bài 2 B b thuộc TUẦN 2 (KHGD tiết 13–16). */
  'L1|Tiếng Việt':{
    2:[
      {tiet:1, ten:"Bài 1. A a", trang:"5", tep:"VBT_TiengViet1_Tuan2_Bai1.html", soSlide:3},
      {tiet:2, ten:"Bài 2. B b (dấu huyền)", trang:"6", tep:"VBT_TiengViet1_Tuan2_Bai2.html", soSlide:4},
      {tiet:3, ten:"Bài 3. C c (dấu sắc)", trang:"7", tep:"VBT_TiengViet1_Tuan2_Bai3.html", soSlide:4},
      {tiet:4, ten:"Bài 4. E e Ê ê", trang:"8", tep:"VBT_TiengViet1_Tuan2_Bai4.html", soSlide:4},
    ],
  },
  'L2|Tiếng Việt':{
    1:[
      {tiet:1, ten:"Bài 1. Tôi là học sinh lớp 2", trang:"4–5", tep:"VBT_TiengViet2_Tuan1_Bai1.html", soSlide:4},
      {tiet:2, ten:"Bài 2. Ngày hôm qua đâu rồi?", trang:"5–7", tep:"VBT_TiengViet2_Tuan1_Bai2.html", soSlide:10},
    ],
    2:[
      {tiet:3, ten:"Bài 3. Niềm vui của Bi và Bống", trang:"8", tep:"VBT_TiengViet2_Tuan2_Bai3.html", soSlide:6},
      {tiet:4, ten:"Bài 4. Làm việc thật là vui", trang:"9, 10, 11", tep:"VBT_TiengViet2_Tuan2_Bai4.html", soSlide:10},
    ],
  },
  'L3|Tiếng Việt':{
    1:[
      {tiet:1, ten:"Bài 1. Ngày gặp lại", trang:"4–5", tep:"VBT_TiengViet3_Tuan1_Bai1.html", soSlide:6},
      {tiet:2, ten:"Bài 2. Về thăm quê", trang:"6–7", tep:"VBT_TiengViet3_Tuan1_Bai2.html", soSlide:7},
    ],
    2:[
      {tiet:3, ten:"Bài 3. Cánh rừng trong nắng", trang:"8–9", tep:"VBT_TiengViet3_Tuan2_Bai3.html", soSlide:7},
      {tiet:4, ten:"Bài 4. Lần đầu ra biển", trang:"10–11", tep:"VBT_TiengViet3_Tuan2_Bai4.html", soSlide:7},
    ],
  },
  'L4|Tiếng Việt':{
    1:[
      {tiet:1, ten:"Bài 1. Điều kì diệu", trang:"4–7", tep:"VBT_TiengViet4_Tuan1_Bai1.html", soSlide:10},
      {tiet:2, ten:"Bài 2. Thi nhạc", trang:"7–10", tep:"VBT_TiengViet4_Tuan1_Bai2.html", soSlide:8},
    ],
    2:[
      {tiet:3, ten:"Bài 3. Anh em sinh đôi", trang:"11 – 13", tep:"VBT_TiengViet4_Tuan2_Bai3.html", soSlide:10},
      {tiet:4, ten:"Bài 4. Công chúa và người dẫn chuyện", trang:"14 – 16", tep:"VBT_TiengViet4_Tuan2_Bai4.html", soSlide:8},
    ],
  },
  'L5|Tiếng Việt':{
    1:[
      {tiet:1, ten:"Bài 1. Thanh âm của gió", trang:"4–7", tep:"VBT_TiengViet5_Tuan1_Bai1.html", soSlide:10},
      {tiet:2, ten:"Bài 2. Cánh đồng hoa", trang:"8–11", tep:"VBT_TiengViet5_Tuan1_Bai2.html", soSlide:8},
    ],
    2:[
      {tiet:3, ten:"Bài 3. Tuổi Ngựa", trang:"12, 13, 14", tep:"VBT_TiengViet5_Tuan2_Bai3.html", soSlide:11},
      {tiet:4, ten:"Bài 4. Bến sông tuổi thơ", trang:"15, 16", tep:"VBT_TiengViet5_Tuan2_Bai4.html", soSlide:5},
    ],
  },
};
