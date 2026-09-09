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
      {tiet:2, ten:"Bài 2. Các số 6, 7, 8, 9, 10 – Tiết 1", trang:"10, 11", tep:"VBT_Toan1_Tuan2_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 2. Các số 6, 7, 8, 9, 10 – Tiết 2", trang:"12, 13", tep:"VBT_Toan1_Tuan2_Tiet3.html", soSlide:5},
      {tiet:1, ten:"Bài 1. Các số 0, 1, 2, 3, 4, 5 – Tiết 3", trang:"8–9", tep:"VBT_Toan1_Tuan2_Tiet1.html", soSlide:5},
    ],
    3:[
      {tiet:1, ten:"Bài 2. Các số 6, 7, 8, 9, 10 – Tiết 3", trang:"14, 15", tep:"VBT_Toan1_Tuan3_Tiet1.html", soSlide:4},
      {tiet:2, ten:"Bài 3. Nhiều hơn, ít hơn, bằng nhau – Tiết 1", trang:"16", tep:"VBT_Toan1_Tuan3_Tiet2.html", soSlide:3},
      {tiet:3, ten:"Bài 3. Nhiều hơn, ít hơn, bằng nhau – Tiết 2", trang:"17, 18", tep:"VBT_Toan1_Tuan3_Tiet3.html", soSlide:5},
    ],
    4:[
      {tiet:1, ten:"Bài 4. So sánh số – Tiết 1", trang:"19, 20", tep:"VBT_Toan1_Tuan4_Tiet1.html", soSlide:5},
      {tiet:2, ten:"Bài 4. So sánh số – Tiết 2", trang:"21, 22", tep:"VBT_Toan1_Tuan4_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 4. So sánh số – Tiết 3", trang:"23, 24", tep:"VBT_Toan1_Tuan4_Tiet3.html", soSlide:5},
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
    3:[
      {tiet:1, ten:"Bài 5. Ôn tập về phép cộng, phép trừ (không nhớ) trong phạm vi 100 – Tiết 1", trang:"22, 23", tep:"VBT_Toan2_Tuan3_Tiet1.html", soSlide:6},
      {tiet:2, ten:"Bài 5. Ôn tập về phép cộng, phép trừ (không nhớ) trong phạm vi 100 – Tiết 2", trang:"23, 24", tep:"VBT_Toan2_Tuan3_Tiet2.html", soSlide:6},
      {tiet:3, ten:"Bài 5. Ôn tập về phép cộng, phép trừ (không nhớ) trong phạm vi 100 – Tiết 3", trang:"24, 25", tep:"VBT_Toan2_Tuan3_Tiet3.html", soSlide:5},
      {tiet:4, ten:"Bài 6. Luyện tập chung – Tiết 1", trang:"26, 27", tep:"VBT_Toan2_Tuan3_Tiet4.html", soSlide:6},
      {tiet:5, ten:"Bài 6. Luyện tập chung – Tiết 2", trang:"27, 28", tep:"VBT_Toan2_Tuan3_Tiet5.html", soSlide:6},
    ],
    4:[
      {tiet:1, ten:"Bài 7. Phép cộng (qua 10) trong phạm vi 20 – Tiết 1", trang:"29", tep:"VBT_Toan2_Tuan4_Tiet1.html", soSlide:4},
      {tiet:2, ten:"Bài 7. Phép cộng (qua 10) trong phạm vi 20 – Tiết 2", trang:"30, 31", tep:"VBT_Toan2_Tuan4_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 7. Phép cộng (qua 10) trong phạm vi 20 – Tiết 3", trang:"31, 32", tep:"VBT_Toan2_Tuan4_Tiet3.html", soSlide:6},
      {tiet:4, ten:"Bài 7. Phép cộng (qua 10) trong phạm vi 20 – Tiết 4", trang:"32, 33", tep:"VBT_Toan2_Tuan4_Tiet4.html", soSlide:5},
      {tiet:5, ten:"Bài 7. Phép cộng (qua 10) trong phạm vi 20 – Tiết 5", trang:"33, 34", tep:"VBT_Toan2_Tuan4_Tiet5.html", soSlide:6},
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
    3:[
      {tiet:1, ten:"Bài 6. Bảng nhân 4, bảng chia 4 – Tiết 1", trang:"15", tep:"VBT_Toan3_Tuan3_Tiet1.html", soSlide:5},
      {tiet:2, ten:"Bài 6. Bảng nhân 4, bảng chia 4 – Tiết 2", trang:"16", tep:"VBT_Toan3_Tuan3_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 7. Ôn tập hình học và đo lường – Tiết 1", trang:"17–19", tep:"VBT_Toan3_Tuan3_Tiet3.html", soSlide:7},
      {tiet:4, ten:"Bài 7. Ôn tập hình học và đo lường – Tiết 2", trang:"19–20", tep:"VBT_Toan3_Tuan3_Tiet4.html", soSlide:6},
      {tiet:5, ten:"Bài 8. Luyện tập chung – Tiết 1", trang:"21–22", tep:"VBT_Toan3_Tuan3_Tiet5.html", soSlide:8},
    ],
    4:[
      {tiet:1, ten:"Bài 8. Luyện tập chung – Tiết 2", trang:"23–24", tep:"VBT_Toan3_Tuan4_Tiet1.html", soSlide:6},
      {tiet:2, ten:"Bài 8. Luyện tập chung – Tiết 3", trang:"24–25", tep:"VBT_Toan3_Tuan4_Tiet2.html", soSlide:6},
      {tiet:3, ten:"Bài 9. Bảng nhân 6, bảng chia 6 – Tiết 1", trang:"26–27", tep:"VBT_Toan3_Tuan4_Tiet3.html", soSlide:6},
      {tiet:4, ten:"Bài 9. Bảng nhân 6, bảng chia 6 – Tiết 2", trang:"27", tep:"VBT_Toan3_Tuan4_Tiet4.html", soSlide:4},
      {tiet:5, ten:"Bài 10. Bảng nhân 7, bảng chia 7 – Tiết 1", trang:"28", tep:"VBT_Toan3_Tuan4_Tiet5.html", soSlide:5},
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
    3:[
      {tiet:1, ten:"Bài 4. Biểu thức chứa chữ – Tiết 3", trang:"16", tep:"VBT_Toan4_Tuan3_Tiet1.html", soSlide:4},
      {tiet:2, ten:"Bài 5. Giải bài toán có ba bước tính – Tiết 1", trang:"17", tep:"VBT_Toan4_Tuan3_Tiet2.html", soSlide:4},
      {tiet:3, ten:"Bài 5. Giải bài toán có ba bước tính – Tiết 2", trang:"18 – 19", tep:"VBT_Toan4_Tuan3_Tiet3.html", soSlide:6},
      {tiet:4, ten:"Bài 6. Luyện tập chung – Tiết 1", trang:"20 – 21", tep:"VBT_Toan4_Tuan3_Tiet4.html", soSlide:6},
      {tiet:5, ten:"Bài 6. Luyện tập chung – Tiết 2", trang:"22 – 23", tep:"VBT_Toan4_Tuan3_Tiet5.html", soSlide:7},
    ],
    4:[
      {tiet:1, ten:"Bài 7. Đo góc, đơn vị đo góc – Tiết 1", trang:"24 – 25", tep:"VBT_Toan4_Tuan4_Tiet1.html", soSlide:5},
      {tiet:2, ten:"Bài 7. Đo góc, đơn vị đo góc – Tiết 2", trang:"25 – 26", tep:"VBT_Toan4_Tuan4_Tiet2.html", soSlide:5},
      {tiet:3, ten:"Bài 8. Góc nhọn, góc tù, góc bẹt – Tiết 1", trang:"27 – 28", tep:"VBT_Toan4_Tuan4_Tiet3.html", soSlide:6},
      {tiet:4, ten:"Bài 8. Góc nhọn, góc tù, góc bẹt – Tiết 2", trang:"29", tep:"VBT_Toan4_Tuan4_Tiet4.html", soSlide:3},
      {tiet:5, ten:"Bài 8. Góc nhọn, góc tù, góc bẹt – Tiết 3", trang:"30", tep:"VBT_Toan4_Tuan4_Tiet5.html", soSlide:3},
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
    3:[
      {tiet:1, ten:"Bài 6. Cộng, trừ hai phân số khác mẫu số – Tiết 1", trang:"20, 21", tep:"VBT_Toan5_Tuan3_Tiet1.html", soSlide:5},
      {tiet:2, ten:"Bài 6. Cộng, trừ hai phân số khác mẫu số – Tiết 2", trang:"21, 22, 23", tep:"VBT_Toan5_Tuan3_Tiet2.html", soSlide:8},
      {tiet:3, ten:"Bài 7. Hỗn số – Tiết 1", trang:"24, 25", tep:"VBT_Toan5_Tuan3_Tiet3.html", soSlide:5},
      {tiet:4, ten:"Bài 7. Hỗn số – Tiết 2", trang:"25, 26", tep:"VBT_Toan5_Tuan3_Tiet4.html", soSlide:5},
      {tiet:5, ten:"Bài 8. Ôn tập hình học và đo lường – Tiết 1", trang:"27, 28", tep:"VBT_Toan5_Tuan3_Tiet5.html", soSlide:6},
    ],
    4:[
      {tiet:1, ten:"Bài 8. Ôn tập hình học và đo lường – Tiết 2", trang:"28, 29", tep:"VBT_Toan5_Tuan4_Tiet1.html", soSlide:6},
      {tiet:2, ten:"Bài 9. Luyện tập chung – Tiết 1", trang:"30, 31, 32", tep:"VBT_Toan5_Tuan4_Tiet2.html", soSlide:8},
      {tiet:3, ten:"Bài 9. Luyện tập chung – Tiết 2", trang:"32, 33", tep:"VBT_Toan5_Tuan4_Tiet3.html", soSlide:7},
      {tiet:4, ten:"Bài 9. Luyện tập chung – Tiết 3", trang:"34, 35", tep:"VBT_Toan5_Tuan4_Tiet4.html", soSlide:7},
      {tiet:5, ten:"Bài 10. Khái niệm số thập phân – Tiết 1", trang:"36, 37", tep:"VBT_Toan5_Tuan4_Tiet5.html", soSlide:5},
    ],
  },
  /* Tiếng Việt 1: tuần 1 là tuần Làm quen (chưa có bài trong vở); Bài 1 A a, Bài 2 B b thuộc TUẦN 2 (KHGD tiết 13–16). */
  'L1|Tiếng Việt':{
    2:[
      {tiet:3, ten:"Bài 3. C c (dấu sắc)", trang:"7", tep:"VBT_TiengViet1_Tuan2_Bai3.html", soSlide:4},
      {tiet:4, ten:"Bài 4. E e Ê ê", trang:"8", tep:"VBT_TiengViet1_Tuan2_Bai4.html", soSlide:4},
      {tiet:1, ten:"Bài 1. A a", trang:"5", tep:"VBT_TiengViet1_Tuan2_Bai1.html", soSlide:3},
      {tiet:2, ten:"Bài 2. B b (dấu huyền)", trang:"6", tep:"VBT_TiengViet1_Tuan2_Bai2.html", soSlide:4},
    ],
    3:[
      {tiet:6, ten:"Bài 6. O o (dấu hỏi)", trang:"9", tep:"VBT_TiengViet1_Tuan3_Bai6.html", soSlide:4},
      {tiet:7, ten:"Bài 7. Ô ô (dấu nặng)", trang:"10", tep:"VBT_TiengViet1_Tuan3_Bai7.html", soSlide:4},
      {tiet:8, ten:"Bài 8. D d Đ đ", trang:"11", tep:"VBT_TiengViet1_Tuan3_Bai8.html", soSlide:4},
      {tiet:9, ten:"Bài 9. Ơ ơ (dấu ngã)", trang:"12", tep:"VBT_TiengViet1_Tuan3_Bai9.html", soSlide:4},
    ],
    4:[
      {tiet:11, ten:"Bài 11. I i K k", trang:"13", tep:"VBT_TiengViet1_Tuan4_Bai11.html", soSlide:4},
      {tiet:12, ten:"Bài 12. H h L l", trang:"14", tep:"VBT_TiengViet1_Tuan4_Bai12.html", soSlide:4},
      {tiet:13, ten:"Bài 13. U u Ư ư", trang:"15", tep:"VBT_TiengViet1_Tuan4_Bai13.html", soSlide:4},
      {tiet:14, ten:"Bài 14. Ch ch Kh kh", trang:"16", tep:"VBT_TiengViet1_Tuan4_Bai14.html", soSlide:4},
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
    3:[
      {tiet:5, ten:"Bài 5. Em có xinh không?", trang:"12, 13", tep:"VBT_TiengViet2_Tuan3_Bai5.html", soSlide:6},
      {tiet:6, ten:"Bài 6. Một giờ học", trang:"13, 14, 15", tep:"VBT_TiengViet2_Tuan3_Bai6.html", soSlide:11},
    ],
    4:[
      {tiet:7, ten:"Bài 7. Cây xấu hổ", trang:"16, 17", tep:"VBT_TiengViet2_Tuan4_Bai7.html", soSlide:6},
      {tiet:8, ten:"Bài 8. Cầu thủ dự bị", trang:"17, 18, 19", tep:"VBT_TiengViet2_Tuan4_Bai8.html", soSlide:10},
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
    3:[
      {tiet:5, ten:"Bài 5. Nhật kí tập bơi", trang:"12–13", tep:"VBT_TiengViet3_Tuan3_Bai5.html", soSlide:6},
      {tiet:6, ten:"Bài 6. Tập nấu ăn", trang:"14–15", tep:"VBT_TiengViet3_Tuan3_Bai6.html", soSlide:6},
    ],
    4:[
      {tiet:7, ten:"Bài 7. Mùa hè lấp lánh", trang:"16–17", tep:"VBT_TiengViet3_Tuan4_Bai7.html", soSlide:8},
      {tiet:8, ten:"Bài 8. Tạm biệt mùa hè", trang:"18–19", tep:"VBT_TiengViet3_Tuan4_Bai8.html", soSlide:8},
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
    3:[
      {tiet:5, ten:"Bài 5. Thằn lằn xanh và tắc kè", trang:"17 – 19", tep:"VBT_TiengViet4_Tuan3_Bai5.html", soSlide:10},
      {tiet:6, ten:"Bài 6. Nghệ sĩ trống", trang:"20 – 22", tep:"VBT_TiengViet4_Tuan3_Bai6.html", soSlide:9},
    ],
    4:[
      {tiet:7, ten:"Bài 7. Những bức chân dung", trang:"23 – 25", tep:"VBT_TiengViet4_Tuan4_Bai7.html", soSlide:9},
      {tiet:8, ten:"Bài 8. Đò ngang", trang:"25 – 27", tep:"VBT_TiengViet4_Tuan4_Bai8.html", soSlide:8},
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
    3:[
      {tiet:5, ten:"Bài 5. Tiếng hạt nảy mầm", trang:"18, 19, 20, 21", tep:"VBT_TiengViet5_Tuan3_Bai5.html", soSlide:9},
      {tiet:6, ten:"Bài 6. Ngôi sao sân cỏ", trang:"21, 22, 23", tep:"VBT_TiengViet5_Tuan3_Bai6.html", soSlide:7},
    ],
    4:[
      {tiet:7, ten:"Bài 7. Bộ sưu tập độc đáo", trang:"25, 26, 27, 28, 29", tep:"VBT_TiengViet5_Tuan4_Bai7.html", soSlide:13},
      {tiet:8, ten:"Bài 8. Hành tinh kì lạ", trang:"30, 31", tep:"VBT_TiengViet5_Tuan4_Bai8.html", soSlide:6},
    ],
  },
};
