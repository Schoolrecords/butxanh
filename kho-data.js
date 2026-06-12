/* ============================================================================
   KHO GIÁO ÁN SỐ — Bút Xanh
   ----------------------------------------------------------------------------
   ĐÂY LÀ NƠI NẠP GIÁO ÁN TRỰC TIẾP BẰNG CODE (không cần bấm nút trên web).
   Mỗi phần tử trong mảng KHO_DATA là MỘT TIẾT dạy, định danh bằng khóa:

                    Lớp  -  Môn  -  Tuần  -  Tiết

   CÁCH THÊM GIÁO ÁN:
     1) Copy nguyên một khối { ... } (xem VÍ DỤ bên dưới).
     2) Dán thêm vào mảng, sửa nội dung cho đúng tiết của thầy cô.
     3) Lưu tệp -> tải lại trang web là Kho tự cập nhật.

   CÁC TRƯỜNG (field):
     lop      : số lớp/khối, 1..5                         [bắt buộc]
     mon      : tên môn, ví dụ "Toán", "Tiếng Việt"        [bắt buộc]
     tuan     : số tuần, 1..35                             [bắt buộc]
     tiet     : số tiết theo PPCT (số nguyên)              [bắt buộc]
     bai      : tên bài dạy                                [bắt buộc]
     yccd     : I. Yêu cầu cần đạt (văn bản, xuống dòng bằng \n)
     dodung   : II. Đồ dùng dạy học
     hoatdong : III. Các hoạt động — MẢNG [{ten, gv, hs}, ...]
                (xuất Word sẽ thành bảng 2 cột: HĐ của GV | HĐ của HS)
     hotro    : IV.1 Học sinh cần hỗ trợ
     hoanhap  : IV.2 Học sinh khuyết tật học hòa nhập
     status   : 'draft' (Bản nháp) | 'checked' (Đã kiểm tra)
                | 'approved' (Đã duyệt) | 'needs-update' (Cần cập nhật)
     source   : ghi chú nguồn (tùy chọn)

   LƯU Ý: dùng dấu phẩy "," giữa các khối; ký tự xuống dòng trong chuỗi viết \n.
   ============================================================================ */

window.KHO_DATA = [

  /* ----------------------------- VÍ DỤ MẪU -------------------------------
     (Thầy cô XÓA hoặc SỬA khối này, rồi dán thêm các tiết thật bên dưới.) */
  {
    lop: 5, mon: "Toán", tuan: 12, tiet: 56,
    bai: "Luyện tập chung",
    yccd: "1. Năng lực đặc thù: củng cố kĩ năng tính với số thập phân; vận dụng giải bài toán có lời văn.\n2. Năng lực chung: tự học, hợp tác nhóm đôi, giải quyết vấn đề.\n3. Phẩm chất: chăm chỉ, cẩn thận khi trình bày bài làm.",
    dodung: "1. Giáo viên: bảng phụ, phiếu học tập, màn hình trình chiếu.\n2. Học sinh: SGK Toán 5, vở ô li, bảng con.",
    hoatdong: [
      { ten: "1. Khởi động (5 phút)",
        gv: "- Tổ chức trò chơi củng cố bảng tính nhanh.\n- Dẫn dắt vào bài luyện tập.",
        hs: "- Tham gia trò chơi.\n- Lắng nghe, vào bài." },
      { ten: "2. Luyện tập (25 phút)",
        gv: "- Giao lần lượt các bài tập, hướng dẫn cách trình bày.\n- Quan sát, hỗ trợ nhóm còn lúng túng.\n- Chữa bài, chốt kiến thức.",
        hs: "- Làm bài cá nhân/nhóm đôi.\n- Trình bày, nhận xét bài bạn.\n- Sửa bài cùng cô." },
      { ten: "3. Vận dụng - Củng cố (5 phút)",
        gv: "- Liên hệ thực tế, chốt nội dung.\n- Giao bài về nhà.",
        hs: "- Nêu ví dụ thực tế.\n- Ghi nhận nhiệm vụ." }
    ],
    hotro: "- Cho dùng bảng nhân/chia hỗ trợ; ghép cặp với bạn học tốt.",
    hoanhap: "- Giảm số lượng bài; làm mẫu trước; ghi nhận sự tiến bộ.",
    status: "approved",
    source: "VÍ DỤ MẪU — thầy cô thay bằng giáo án thật"
  }

  /* ,
  {
    lop: 5, mon: "Toán", tuan: 12, tiet: 57,
    bai: "...",
    yccd: "...",
    dodung: "...",
    hoatdong: [ { ten: "1. Khởi động", gv: "...", hs: "..." } ],
    hotro: "...", hoanhap: "...", status: "draft"
  }
  */

];
