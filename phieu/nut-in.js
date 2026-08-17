/* ===================================================================
   NÚT "QUAY LẠI BÚT XANH" + "IN / LƯU PDF" cho mọi phiếu bài tập
   Tách ra tệp riêng ngày 17/8/2026, khi bắt đầu soạn phiếu tuần 2–5.

   Vì sao tách: trước đây khối này được CHÉP NGUYÊN ~90 dòng vào từng phiếu.
   Đủ 350 phiếu là 31 500 dòng giống hệt nhau, sửa một chữ phải mở 350 tệp.
   Nay mỗi phiếu chỉ cần MỘT dòng đặt ngay trước </body>:

       <script src="nut-in.js"></script>

   Sửa nút ở ĐÂY là cả bộ phiếu đổi theo.
   =================================================================== */
(function () {
  var css = ''
  + '.bx-in{position:fixed;top:14px;right:14px;z-index:9999;display:inline-flex;align-items:center;gap:8px;'
  + 'font-family:system-ui,"Segoe UI",Roboto,Arial,sans-serif;font-size:14px;font-weight:700;color:#fff;'
  + 'background:#1a8a4e;border:0;border-radius:999px;padding:11px 18px;cursor:pointer;'
  + 'box-shadow:0 4px 14px rgba(16,60,36,.28);transition:background .15s,box-shadow .15s}'
  + '.bx-in:hover{background:#157040;box-shadow:0 6px 18px rgba(16,60,36,.36)}'
  + '.bx-in:active{transform:translateY(1px)}'
  + '.bx-in svg{width:17px;height:17px;flex:none;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'
  /* Nút QUAY LẠI — đối xứng với nút In, ở phía bên kia màn hình. Nền trắng để không tranh
     chỗ với nút In màu xanh: một cái là "làm việc chính", một cái là "đi ra". */
  + '.bx-ve{position:fixed;top:14px;left:14px;z-index:9999;display:inline-flex;align-items:center;gap:8px;'
  + 'font-family:system-ui,"Segoe UI",Roboto,Arial,sans-serif;font-size:14px;font-weight:700;color:#1a6b41;'
  + 'background:#fff;border:1.5px solid #cfe3d6;border-radius:999px;padding:10px 17px;cursor:pointer;'
  + 'box-shadow:0 4px 14px rgba(16,60,36,.18);transition:border-color .15s,box-shadow .15s}'
  + '.bx-ve:hover{border-color:#1a8a4e;box-shadow:0 6px 18px rgba(16,60,36,.26)}'
  + '.bx-ve:active{transform:translateY(1px)}'
  + '.bx-ve svg{width:17px;height:17px;flex:none;fill:none;stroke:#1a6b41;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}'
  /* Điện thoại/máy tính bảng: nút In rút còn hình TRÒN chỉ có biểu tượng máy in, đẩy xuống góc dưới.
     Hai chỗ khác máy tính, đều do đo thật 17/8/2026:
     · Dùng (pointer:coarse) chứ KHÔNG dùng (max-width) — trang phiếu rộng cố định 794px nên
       trình duyệt điện thoại thu nhỏ cả trang, max-width không bao giờ khớp mà nút thì bé tí
       không chạm nổi. Nút tròn 96px sau khi thu còn ~47px thật — vừa đầu ngón tay.
     · Để trên bên phải như máy tính thì nút che mất ô "Ngày …/…/20…" và "Trang 1/2"
       (màn điện thoại hẹp, trang chiếm trọn bề ngang). Xuống dưới vừa không che gì, vừa gần ngón cái. */
  + '@media(pointer:coarse){'
  + '.bx-in{top:auto;bottom:18px;right:18px;padding:0;width:96px;height:96px;border-radius:50%;justify-content:center;'
  + 'box-shadow:0 6px 20px rgba(16,60,36,.34)}'
  + '.bx-in .bx-in-chu{display:none}'
  + '.bx-in svg{width:46px;height:46px;stroke-width:2.1}'
  /* Nút quay lại trên điện thoại GIỮ NGUYÊN CHỮ: đây là lối thoát duy nhất khi app chạy toàn
     màn hình (không có thanh địa chỉ). Chỉ có mũi tên trơ trọi thì các cô không đoán ra. */
  + '.bx-ve{top:auto;bottom:18px;left:18px;font-size:26px;padding:20px 30px;gap:14px;border-width:2.5px;'
  + 'box-shadow:0 6px 20px rgba(16,60,36,.26)}'
  + '.bx-ve svg{width:30px;height:30px;stroke-width:2.6}}'
  + '@media print{.bx-in,.bx-ve{display:none!important}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* Phiếu đang nằm trong LỚP PHỦ của app (khung nhúng): không thêm nút, vì thanh trên cùng
     của app đã có "✕ Đóng" và "🖨 In" rồi — hai bộ nút chồng nhau chỉ làm rối. */
  try { if (window.top !== window.self) return; } catch (e) { return; }

  var ve = document.createElement('button');
  ve.className = 'bx-ve';
  ve.title = 'Quay lại Bút Xanh';
  ve.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Quay lại</span>';
  ve.onclick = bxVeApp;

  var inn = document.createElement('button');
  inn.className = 'bx-in';
  inn.title = 'In phiếu hoặc lưu thành tệp PDF';
  inn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 9.5V3.5h11v6"/>'
    + '<path d="M6.5 18.5h-2a1 1 0 01-1-1v-5a2 2 0 012-2h13a2 2 0 012 2v5a1 1 0 01-1 1h-2"/>'
    + '<path d="M6.5 14.5h11v6h-11z"/></svg><span class="bx-in-chu">In / Lưu PDF</span>';
  inn.onclick = function () { window.print(); };

  document.body.appendChild(ve);
  document.body.appendChild(inn);

  /* ĐƯỜNG VỀ APP — thử ba lối, lối nào cũng phải đưa thầy cô về Bút Xanh, tuyệt đối không
     để bấm mà không thấy gì (17/8/2026, thầy Chung báo: các cô phải tắt cả app mới thoát được).
     1) Lùi lại — điện thoại mở phiếu ngay trong cửa sổ app nên đây là lối chính, app lấy lại
        từ bộ nhớ trình duyệt, KHÔNG phải tải lại từ đầu.
     2) Đóng thẻ — máy tính mở phiếu ở thẻ mới, thẻ nào do app mở thì đóng được.
     3) Cùng lắm thì đi thẳng về trang app. */
  function bxVeApp() {
    var daRoi = false;
    try { addEventListener('pagehide', function () { daRoi = true; }, { once: true }); } catch (e) {}
    try { if (history.length > 1) history.back(); } catch (e) {}
    setTimeout(function () {
      if (daRoi) return;
      try { window.close(); } catch (e) {}
      setTimeout(function () { if (!daRoi) location.replace('../index.html'); }, 250);
    }, 450);
  }
})();
