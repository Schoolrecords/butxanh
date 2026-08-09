/* =======================================================================
   BÚT XANH — LỚP BẢN QUYỀN (License) — Phần 1: lõi
   - Khoá tải giáo án khi chưa trả phí (99.000đ / 1 máy / 1 người / 1 năm học)
   - Khoá theo THIẾT BỊ (vân tay máy), cho ĐỔI tối đa 2 lần/năm
   - Watermark động (tên + email GV) để răn đe phát tán
   - Vô hiệu chuột phải / Ctrl+S / Ctrl+P / Ctrl+C trên vùng nội dung
   - Màn hình "Kích hoạt bản quyền" hiện QR VietQR 99.000đ
   - Trang QUẢN TRỊ cho admin: kích hoạt / gia hạn / đổi máy / khoá tay
   Tự chứa: dùng lại firebase.auth() + firebase.database() do index.html khởi tạo.
   ======================================================================= */
(function(){
  "use strict";

  /* ------------------------------------------------------------------ *
   *  CẤU HÌNH — THẦY CHUNG CHỈNH Ở ĐÂY                                  *
   * ------------------------------------------------------------------ */
  var CONFIG = {
    // Thông tin tài khoản NHẬN TIỀN (để tạo mã QR VietQR).
    // bank: mã ngân hàng theo VietQR (vd 'MB','ACB','VCB','TCB','VPB','BIDV',
    //       'VIETINBANK','MBBANK'... hoặc mã BIN 6 số như '970422').
    NGAN_HANG: '970415',                // VietinBank (mã BIN VietQR)
    SO_TK:     '103873838505',          // TK nhận tiền (thành viên nhóm Dự án phụ trách thu)
    CHU_TK:    'NGUYEN THI HOAN MY',    // chủ TK (IN HOA không dấu)
    // Ảnh QR TĨNH dùng TẠM khi chưa điền SO_TK (mọi GV quét chung ảnh này).
    // Khi đã điền SO_TK ở trên, app TỰ chuyển sang QR động riêng từng GV, bỏ ảnh này.
    QR_IMG:    'qr-thanhtoan.png',
    GIA:       99000,       // 99.000đ / năm học
    // BẮT BUỘC với VietinBank tài khoản CÁ NHÂN: nội dung chuyển khoản phải MỞ ĐẦU
    // bằng "SEVQR" thì SePay mới đọc được biến động số dư và bắn webhook về.
    // Thiếu tiền tố này: tiền vẫn vào tài khoản nhưng SePay KHÔNG thấy giao dịch
    // → không tự mở khoá được. Đổi ngân hàng khác thì có thể để rỗng ''.
    TIEN_TO_CK: 'SEVQR ',
    // Tài khoản QUẢN TRỊ bản quyền (mở được trang "⚙ Quản trị bản quyền" trong app).
    // Ghi nhiều email thì cách nhau bằng dấu phẩy.
    EMAIL_ADMIN: 'chungsongthinh@gmail.com, xebatcheotrt@gmail.com',
    SO_LAN_DOI_MAY_TOI_DA: 2,                  // đổi MÁY TÍNH (ngăn chính) tối đa / năm học
    /* (9/8/2026 — thầy Chung chốt) Một bản quyền = 1 MÁY TÍNH (soạn) + 1 ĐIỆN THOẠI (xem + tải Word) */
    SO_LAN_DOI_MAY_PHU_TOI_DA: 4,              // đổi ĐIỆN THOẠI (ngăn phụ) / năm học — nới hơn vì điện thoại đổi/mất thường hơn
    SO_LAN_DOI_VAI_TOI_DA: 2,                  // đổi VAI SOẠN (máy tính ↔ điện thoại) / năm học — van dự phòng khi máy tính hỏng
    HOTLINE: 'Dự án Bút Xanh (qua nhóm Zalo)', // hiển thị khi hết lượt đổi máy (đổi 3/8/2026 theo lời thầy)
    /* KHOÁ THEO KHỐI LỚP (5/8/2026 — thầy Chung chốt):
       Một bản quyền chỉ tải được giáo án & KHDH của KHỐI thầy cô dạy, không lấy
       được cả 5 khối. Lần tải đầu tiên, app tự gắn khối theo THỜI KHOÁ BIỂU đã
       khai: GV chủ nhiệm ra 1 khối, GV bộ môn (Âm nhạc, Thể dục, Tiếng Anh, Tin
       học, Mĩ thuật) ra đủ khối họ đứng lớp — không ai phải xin phép. Gắn xong
       thì khoá lại; đổi phải nhờ quản trị (nút "Sửa quyền" ở trang Quản trị). */
    KHOA_THEO_KHOI: true,
    /* Ngưỡng để coi một khối là KHỐI CHỦ NHIỆM (mở trọn mọi môn). Khối nào thầy cô
       dạy TỪ NGẦN NÀY MÔN trở lên thì mở trọn; ít hơn thì chỉ mở đúng môn đã khai.
       Đặt 3 vì chủ nhiệm tiểu học luôn dạy ít nhất 5 môn, còn phân công dạy thêm ở
       lớp khác hiếm khi quá 2 môn. Xem chú thích "QUYỀN THEO KHỐI × MÔN" bên dưới. */
    NGUONG_MON_TRON_KHOI: 3
  };

  /* ------------------------------------------------------------------ *
   *  TIỆN ÍCH                                                            *
   * ------------------------------------------------------------------ */
  function esc(s){ return (s==null?'':String(s)).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];}); }
  function fnv(str){ var h=0x811c9dc5; str=String(str); for(var i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=(h+((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)))>>>0; } return h>>>0; }
  function fmtVND(n){ return (n||0).toLocaleString('vi-VN')+'đ'; }
  function fmtDate(ms){ if(!ms) return '—'; try{ return new Date(ms).toLocaleDateString('vi-VN'); }catch(e){ return '—'; } }
  /* (9/8/2026) Giờ:phút cho cột "Kích hoạt" trang Quản trị — thầy cần biết lúc mấy giờ */
  function fmtLuc(ms){ if(!ms) return '—'; try{ var d=new Date(ms);
    return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+' '+('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();
  }catch(e){ return '—'; } }
  /* Bỏ dấu để tìm kiếm không phân biệt hoa thường/dấu ("hoa" ra "Hoà") */
  function bodau(s){ try{ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d'); }catch(e){ return String(s||'').toLowerCase(); } }

  // Năm học mặc định theo hôm nay (từ tháng 6 tính sang năm học mới)
  function curNamHoc(){ var d=new Date(), y=d.getFullYear(), m=d.getMonth()+1, s=(m>=6)?y:y-1; return s+'-'+(s+1); }
  // Hết hạn = 31/8 của năm sau trong năm học
  function hetHanFor(nh){ var s=parseInt(String(nh).split('-')[0],10)||new Date().getFullYear(); return new Date(s+1,7,31,23,59,59).getTime(); }

  // Vân tay thiết bị (ổn định theo máy+trình duyệt) — mức thực dụng
  function deviceId(){
    var n=navigator, parts=[
      n.userAgent||'', n.platform||'', n.language||'',
      (screen.width+'x'+screen.height+'x'+(screen.colorDepth||'')),
      (new Date().getTimezoneOffset()), (n.hardwareConcurrency||''),
      (n.maxTouchPoints||'')
    ].join('|');
    return fnv(parts).toString(16);
  }
  /* (9/8/2026 — Bước 2 kế hoạch 2 thiết bị) MÃ THIẾT BỊ BỀN: chuỗi ngẫu nhiên lưu trong máy,
     KHÔNG đổi khi trình duyệt cập nhật (vân tay deviceId() ở trên hay trôi vì lẫn userAgent —
     nguồn của các ca "tự nhiên bị hỏi đổi máy" oan). Vân tay cũ chỉ còn dùng để NHẬN RA
     máy đã gắn từ trước rồi nâng cấp êm. Khoá 'butxanh_devid' KHÔNG đồng bộ, không nằm trong
     sao lưu/xoá dữ liệu — sống chết theo trình duyệt (xoá cache = coi như máy mới, tốn lượt). */
  function devIdBen(){
    try{
      var id=localStorage.getItem('butxanh_devid');
      if(!id){ id='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,10); localStorage.setItem('butxanh_devid', id); }
      return id;
    }catch(e){ return 'fp-'+deviceId(); }
  }
  /* Cầm tay = điện thoại/máy tính bảng — CÙNG LUẬT với chế độ xem bxLaCamTay trong index.html */
  function laCamTay(){
    var ua=navigator.userAgent||'';
    if(/Android|iPhone|iPod|IEMobile|Opera Mini|Mobile/i.test(ua)) return true;
    if(/iPad|Tablet/i.test(ua)) return true;
    if((navigator.maxTouchPoints||0)>1 && /Mac/i.test(navigator.platform||'')) return true;
    try{ if((navigator.maxTouchPoints||0)>1 && window.matchMedia && matchMedia('(pointer:coarse)').matches) return true; }catch(e){}
    return false;
  }
  // Mã chuyển khoản ngắn, ổn định theo tài khoản (để đối soát tự động ở Phần 2)
  function maCKof(uid){ return ('BX'+fnv(uid).toString(36).toUpperCase()).slice(0,8); }

  /* ------------------------------------------------------------------ *
   *  TRẠNG THÁI                                                          *
   * ------------------------------------------------------------------ */
  var auth=null, db=null, user=null, licRef=null, rec=null, dev=deviceId(), devB=devIdBen();
  var paid=false;               // đã trả phí & hợp lệ trên MÁY NÀY
  window.__bxPaid=false;

  function adminList(){
    return String(CONFIG.EMAIL_ADMIN||'').toLowerCase().split(',')
           .map(function(s){ return s.trim(); }).filter(Boolean);
  }
  function isAdmin(){ return !!(user && adminList().indexOf((user.email||'').toLowerCase())>=0); }
  function cacheKey(uid){ return 'bx_lic_'+uid; }
  function setPaid(v, expMs){
    var truoc=paid;
    paid=!!v; window.__bxPaid=paid;
    if(!truoc && paid){                       // vừa được mở khoá → báo mừng, đóng màn hình chờ
      try{
        var o=document.getElementById('bxlic-activate');
        if(o && o.classList.contains('on')){
          o.classList.remove('on');
          // bxAlert của app hiển thị VĂN BẢN THUẦN (xuống dòng bằng \n) — không dùng thẻ HTML
          if(window.bxAlert) bxAlert('🎉 Đã kích hoạt bản quyền!\n\nThầy/cô tải giáo án và Kế hoạch giáo dục môn học được rồi ạ.'+(expMs?('\nHạn dùng đến '+fmtDate(expMs)+'.'):''));
        }
      }catch(e){}
    }
    try{
      if(user){ if(paid && expMs) localStorage.setItem(cacheKey(user.uid), String(expMs));
                else localStorage.removeItem(cacheKey(user.uid)); }
    }catch(e){}
    renderBadge();
  }

  /* ------------------------------------------------------------------ *
   *  CSS (nhúng động)                                                    *
   * ------------------------------------------------------------------ */
  function injectCSS(){
    if(document.getElementById('bxlic-css')) return;
    var s=document.createElement('style'); s.id='bxlic-css';
    s.textContent=[
      /* 3/8/2026: bỏ mix-blend-mode:multiply — chế độ hoà trộn toàn màn hình rất nặng cho
         máy yếu, là nguyên nhân iOS Safari không giữ nổi thanh điều hướng đáy khi cuộn
         (thanh trượt theo tay vuốt). Chữ mờ 6% trên nền trắng nhìn gần như không khác. */
      '#bxlic-wm{position:fixed;inset:0;pointer-events:none;z-index:6;background-repeat:repeat;opacity:1}',
      '.bxlic-ov{position:fixed;inset:0;background:rgba(15,30,25,.55);display:none;align-items:center;justify-content:center;z-index:99999;padding:16px}',
      '.bxlic-ov.on{display:flex}',
      '.bxlic-card{background:#fff;border-radius:16px;max-width:440px;width:100%;max-height:92vh;overflow:auto;box-shadow:0 18px 60px rgba(0,0,0,.35);font-family:inherit}',
      '.bxlic-card.wide{max-width:860px}',
      '.bxlic-hd{background:linear-gradient(135deg,#0f9d58,#0b8043);color:#fff;padding:16px 20px;border-radius:16px 16px 0 0;display:flex;justify-content:space-between;align-items:center}',
      '.bxlic-hd h3{margin:0;font-size:17px}',
      '.bxlic-hd .x{background:transparent;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;opacity:.9}',
      '.bxlic-bd{padding:18px 20px}',
      '.bxlic-qr{display:block;margin:4px auto 8px;width:172px;height:172px;border-radius:12px;border:1px solid #e3e8e5;background:#f7faf8}',
      '.bxlic-row{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px dashed #e3e8e5;font-size:14px}',
      '.bxlic-row b{color:#0b8043}',
      '.bxlic-copy{background:#eaf6ef;border:1px solid #bfe6cf;color:#0b8043;border-radius:8px;padding:3px 9px;font-size:12px;cursor:pointer}',
      '.bxlic-note{background:#fff8e6;border:1px solid #ffe2a8;border-radius:10px;padding:10px 12px;font-size:13px;color:#7a5b00;margin-top:12px;line-height:1.5}',
      '.bxlic-mini{font-size:12px;color:#7a5b00;background:#fff8e6;border:1px solid #ffe2a8;border-radius:8px;padding:7px 10px;margin-top:8px;line-height:1.45}',
      '.bxlic-help{margin-top:8px;background:#eef6ff;border:1px solid #bcdcff;border-radius:10px;padding:8px 11px;font-size:12.5px;color:#234}',
      '.bxlic-help summary{cursor:pointer;font-weight:600;list-style:none}',
      '.bxlic-help summary::-webkit-details-marker{display:none}',
      '.bxlic-help div{margin-top:7px;line-height:1.55}',
      '.bxlic-btn{display:block;width:100%;margin-top:12px;padding:12px;border:0;border-radius:10px;background:#0b8043;color:#fff;font-size:15px;font-weight:600;cursor:pointer}',
      '.bxlic-btn.sec{background:#eef3f0;color:#334;font-weight:500}',
      '.bxlic-headbtn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#12b76a,#0b8043);color:#fff;border:0;border-radius:22px;padding:8px 16px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 3px 10px rgba(11,128,67,.32);font-family:inherit;white-space:nowrap;animation:bxlicPulse 2.4s ease-in-out infinite}',
      '.bxlic-headbtn:hover{filter:brightness(1.05)}',
      '@keyframes bxlicPulse{0%,100%{box-shadow:0 3px 10px rgba(11,128,67,.32)}50%{box-shadow:0 3px 16px rgba(11,128,67,.6)}}',
      '.bxlic-headbtn.ok{background:transparent;color:#0b8043;border:1.5px solid #bfe6cf;font-weight:600;box-shadow:none;animation:none;cursor:default}',
      '@media(max-width:640px){.bxlic-headbtn{padding:7px 12px;font-size:13px}}',
      '.bxlic-tbl{width:100%;border-collapse:collapse;font-size:13px}',
      '.bxlic-tbl th,.bxlic-tbl td{border:1px solid #e3e8e5;padding:6px 8px;text-align:left;vertical-align:middle}',
      '.bxlic-tbl th{background:#f2f7f4;position:sticky;top:0}',
      '.bxlic-tag{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}',
      '.bxlic-tag.ok{background:#e4f6ea;color:#0b8043}.bxlic-tag.no{background:#fde8ea;color:#b00020}',
      '.bxlic-mini{background:#0b8043;color:#fff;border:0;border-radius:6px;padding:4px 8px;font-size:12px;cursor:pointer;margin:1px}',
      '.bxlic-mini.g{background:#3a7afe}.bxlic-mini.r{background:#b00020}.bxlic-mini.d{background:#7a869a}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ *
   *  WATERMARK động                                                     *
   * ------------------------------------------------------------------ */
  function renderWatermark(){
    var wm=document.getElementById('bxlic-wm');
    if(!user){ if(wm) wm.remove(); return; }
    if(!wm){ wm=document.createElement('div'); wm.id='bxlic-wm'; document.body.appendChild(wm); }
    var t=esc((user.displayName||user.email||'')+' · '+(user.email||''));
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200">'+
      '<text x="10" y="110" transform="rotate(-24 180 100)" fill="rgba(15,80,55,0.06)" '+
      'font-size="14" font-family="Arial, sans-serif">'+t+'</text></svg>';
    wm.style.backgroundImage="url('data:image/svg+xml;utf8,"+encodeURIComponent(svg)+"')";
  }

  /* ------------------------------------------------------------------ *
   *  CHỐNG COPY / IN / LƯU (răn đe — không cản thao tác nhập liệu)       *
   * ------------------------------------------------------------------ */
  function isField(el){ if(!el) return false; var t=(el.tagName||'').toUpperCase(); return t==='INPUT'||t==='TEXTAREA'||el.isContentEditable; }
  function guardActions(){
    if(window.__bxGuarded) return; window.__bxGuarded=true;
    /* Thầy cô ĐÃ trả phí thì dùng thoải mái: in, sao chép, chuột phải đều bình thường.
       Chỉ răn đe với người chưa kích hoạt để tránh chép nội dung thay cho việc tải. */
    document.addEventListener('contextmenu',function(e){ if(!paid && !isField(e.target)){ e.preventDefault(); } },{capture:true});
    document.addEventListener('keydown',function(e){
      if(paid) return;
      var k=(e.key||'').toLowerCase(), ctrl=e.ctrlKey||e.metaKey;
      if(ctrl && (k==='s'||k==='p')){ e.preventDefault(); e.stopPropagation(); return; }   // chặn Lưu trang / In
      if(ctrl && k==='c' && !isField(document.activeElement)){                              // chặn copy nội dung xem
        var sel=window.getSelection && window.getSelection();
        if(sel && String(sel).length){ e.preventDefault(); }
      }
    },{capture:true});
    document.addEventListener('copy',function(e){ if(!paid && !isField(document.activeElement)){ try{ e.preventDefault(); }catch(_){} } },{capture:true});
  }

  /* ------------------------------------------------------------------ *
   *  OVERLAY dùng chung                                                  *
   * ------------------------------------------------------------------ */
  function overlay(id){
    var o=document.getElementById(id);
    if(!o){ o=document.createElement('div'); o.id=id; o.className='bxlic-ov';
      o.addEventListener('click',function(e){ if(e.target===o) o.classList.remove('on'); });
      document.body.appendChild(o); }
    return o;
  }
  function closeOv(id){ var o=document.getElementById(id); if(o) o.classList.remove('on'); }
  window.BXLIC_close=closeOv;

  /* ------------------------------------------------------------------ *
   *  MÀN HÌNH KÍCH HOẠT (cho GV chưa trả phí)                            *
   * ------------------------------------------------------------------ */
  // Nội dung chuyển khoản đầy đủ = tiền tố bắt buộc của cổng + mã giáo viên
  function noiDungCKof(maCK){ return (CONFIG.TIEN_TO_CK||'')+maCK; }
  function vietqrURL(maCK){
    if(!CONFIG.NGAN_HANG||!CONFIG.SO_TK) return '';
    // Kiểu ảnh: 'qr_only' = chỉ mã QR cho gọn (đã có sẵn số tiền + nội dung bên trong mã).
    // Muốn kèm khung VietQR/napas thì đổi thành 'compact', kèm cả tên & số TK thì 'compact2'.
    var u='https://img.vietqr.io/image/'+encodeURIComponent(CONFIG.NGAN_HANG)+'-'+
          encodeURIComponent(CONFIG.SO_TK)+'-qr_only.png?amount='+CONFIG.GIA+
          '&addInfo='+encodeURIComponent(noiDungCKof(maCK));
    if(CONFIG.CHU_TK) u+='&accountName='+encodeURIComponent(CONFIG.CHU_TK);
    return u;
  }
  function showActivate(){
    /* CHƯA đăng nhập: KHÔNG được tự mở cửa sổ đăng nhập Google (4/8/2026).
       Trước đây mỗi lần bấm nút tải Word lúc chưa đăng nhập là app lặng lẽ gọi
       signInWithPopup. Cửa sổ Google bật ra sau lưng / bị chặn / thầy cô không để ý →
       tưởng nút chết nên bấm tiếp → hai cửa sổ tranh nhau, Google huỷ cả hai
       (auth/cancelled-popup-request), mà cửa sổ đang giữ con trỏ nên bấm gì trên
       trang cũng không ăn, kể cả ô nhập ở màn Cài đặt. Nay hỏi rõ rồi mới mở, và
       cửa sổ chỉ bật ra từ đúng cú bấm nút "Đăng nhập Google" của thầy cô. */
    if(!user){
      var moDangNhap=function(){ try{ if(window.FBX) FBX.login(); }catch(e){} };
      if(typeof window.BX_confirm==='function'){
        window.BX_confirm({
          title:'Cần đăng nhập để tải về máy',
          html:'Bút Xanh ghi bản quyền theo tài khoản Google của thầy cô, nên cần đăng nhập trước khi tải giáo án về máy tính.<br><br>Bấm <b>Đăng nhập Google</b> — một <b>cửa sổ nhỏ của Google</b> sẽ hiện ra, thầy cô chọn tài khoản ngay trong cửa sổ đó ạ. Nếu không thấy cửa sổ, thầy cô xem thanh tác vụ dưới màn hình hoặc gỡ chặn cửa sổ bật lên cho butxanh.net.',
          okText:'Đăng nhập Google', cancelText:'Để sau'
        }, moDangNhap);
      } else moDangNhap();
      return;
    }
    var maCK=maCKof(user.uid);
    var dyn=vietqrURL(maCK);                          // QR động (ưu tiên khi có SO_TK)
    var qrSrc = dyn || CONFIG.QR_IMG || '';          // chưa có SO_TK → dùng ảnh tĩnh tạm
    var isStatic = !dyn && !!CONFIG.QR_IMG;
    var o=overlay('bxlic-activate');
    var qrHtml = qrSrc
      ? '<img class="bxlic-qr" src="'+esc(qrSrc)+'" alt="QR chuyển khoản 99.000đ">'
      : '<div class="bxlic-note">⚠️ Chưa cấu hình tài khoản nhận tiền — thầy Chung điền NGÂN_HÀNG/SỐ_TK trong <b>license.js</b> để hiện mã QR.</div>';
    if(isStatic){
      qrHtml += '<div class="bxlic-note" style="background:#eef6ff;border-color:#bcdcff;color:#234">Khi chuyển khoản, thầy/cô vui lòng <b>nhập số tiền '+fmtVND(CONFIG.GIA)+'</b> và <b>nội dung ghi mã bên dưới</b> để được kích hoạt đúng tài khoản.</div>';
    }
    o.innerHTML=
      '<div class="bxlic-card">'+
        '<div class="bxlic-hd"><h3>🔓 Kích hoạt Bút Xanh</h3><button class="x" onclick="BXLIC_close(\'bxlic-activate\')">×</button></div>'+
        '<div class="bxlic-bd">'+
          '<div style="text-align:center;font-size:13.5px;margin-bottom:1px">Bản quyền <b>'+fmtVND(CONFIG.GIA)+'</b> / 1 máy / 1 năm học</div>'+
          '<div style="text-align:center;font-size:12px;color:#5b6b62;margin-bottom:4px">Mở khoá <b>tải giáo án Word</b> và <b>KHGD môn học</b> · Các tính năng khác vẫn miễn phí</div>'+
          qrHtml+
          (CONFIG.CHU_TK?('<div class="bxlic-row"><span>Người nhận</span><b>'+esc(CONFIG.CHU_TK)+'</b></div>'):'')+
          '<div class="bxlic-row"><span>Số tiền</span><b>'+fmtVND(CONFIG.GIA)+'</b></div>'+
          '<div class="bxlic-row"><span>Nội dung CK</span><span><b id="bxlic-mack">'+esc(noiDungCKof(maCK))+'</b> '+
             '<button class="bxlic-copy" onclick="BXLIC_copy(\''+esc(noiDungCKof(maCK))+'\')">Sao chép</button></span></div>'+
          '<div class="bxlic-mini">📌 Chuyển khoản <b>ghi đúng nội dung trên</b> — giữ nguyên cả chữ <b>SEVQR</b> ở đầu, app sẽ <b>tự mở khoá</b> sau ít phút.</div>'+
          /* 4/8/2026: bỏ nút "Lưu ảnh mã QR về máy" và mục hướng dẫn "Đang dùng điện
             thoại, quét mã thế nào?" — thầy cô nay đã quá quen quét mã thanh toán,
             hai mục này chỉ làm cửa sổ dài thêm và bắt phải cân nhắc thêm một bước.
             Hàm BXLIC_saveQR vẫn giữ trong tệp phòng khi cần dùng lại. */
          '<button class="bxlic-btn" onclick="BXLIC_reportPaid()">✅ Tôi đã chuyển khoản</button>'+
          '<button class="bxlic-btn sec" onclick="BXLIC_close(\'bxlic-activate\')">Để sau</button>'+
        '</div>'+
      '</div>';
    o.classList.add('on');
  }
  window.BXLIC_copy=function(txt){
    try{ navigator.clipboard.writeText(txt); }catch(e){}
    if(window.bxAlert) bxAlert('Đã sao chép nội dung chuyển khoản: '+txt);
  };
  /* Màn hình CHỜ XÁC NHẬN — app vẫn nghe realtime, tiền vào là tự đổi trạng thái */
  function showWaiting(){
    var o=document.getElementById('bxlic-activate'); if(!o) return;
    o.innerHTML=
      '<div class="bxlic-card">'+
        '<div class="bxlic-hd"><h3>⏳ Đang chờ xác nhận</h3>'+
          '<button class="x" onclick="BXLIC_close(\'bxlic-activate\')">×</button></div>'+
        '<div class="bxlic-bd" style="text-align:center">'+
          '<div style="font-size:40px;line-height:1;margin:10px 0">🏦</div>'+
          '<div style="font-size:15px;font-weight:600;color:#0b8043;margin-bottom:6px">Cảm ơn thầy/cô!</div>'+
          '<div style="font-size:14px;line-height:1.55;color:#445">Khi ngân hàng báo tiền về, bản quyền sẽ <b>tự mở khoá ngay trên màn hình này</b> — thầy/cô không phải làm gì thêm, cũng không cần đăng nhập lại.</div>'+
          '<div class="bxlic-note" style="text-align:left">Thường mất <b>vài giây đến vài phút</b>. Nếu chờ lâu hơn 15 phút, thầy/cô nhắn cho quản trị kèm mã <b>'+esc(maCKof(user.uid))+'</b> để được kích hoạt tay.</div>'+
          '<button class="bxlic-btn sec" onclick="BXLIC_close(\'bxlic-activate\')">Đóng cửa sổ</button>'+
        '</div>'+
      '</div>';
  }

  /* Lưu ảnh mã QR về máy — để thầy cô đang dùng ĐIỆN THOẠI mở app ngân hàng
     rồi quét chính ảnh này từ thư viện (app ngân hàng tự điền tiền + nội dung). */
  window.BXLIC_saveQR=function(){
    if(!user) return;
    var maCK=maCKof(user.uid), url=vietqrURL(maCK);
    if(!url) return;
    var ten='ButXanh-QR-99k-'+maCK+'.png';
    fetch(url,{mode:'cors'}).then(function(r){ return r.blob(); }).then(function(b){
      var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=ten;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function(){ try{ URL.revokeObjectURL(a.href); }catch(e){} },2000);
      if(window.bxAlert) bxAlert('Đã lưu ảnh mã QR vào máy (thư mục Tải xuống / Ảnh).\n\nThầy/cô mở app ngân hàng ▸ Quét QR ▸ chọn ảnh từ thư viện là xong ạ.');
    }).catch(function(){
      window.open(url,'_blank');    // dự phòng: mở ảnh ra tab mới để nhấn giữ và lưu
      if(window.bxAlert) bxAlert('Ảnh mã QR đã mở ở cửa sổ mới — thầy/cô nhấn giữ vào ảnh rồi chọn "Lưu ảnh" nhé.');
    });
  };

  window.BXLIC_reportPaid=function(){
    if(!user||!db){ return; }
    var upd={}; upd['licenses/'+user.uid+'/maCK']=maCKof(user.uid);
    upd['licenses/'+user.uid+'/email']=user.email||'';
    upd['licenses/'+user.uid+'/hoTen']=user.displayName||'';
    upd['licenses/'+user.uid+'/daYeuCau']=true;
    upd['licenses/'+user.uid+'/yeuCauTs']=firebase.database.ServerValue.TIMESTAMP;
    db.ref().update(upd).then(function(){
      showWaiting();     // ở lại màn hình, tự đổi sang "đã kích hoạt" khi tiền vào
    }).catch(function(){ if(window.bxAlert) bxAlert('Chưa gửi được yêu cầu (kiểm tra mạng). Thầy/cô thử lại nhé.'); });
  };

  /* ------------------------------------------------------------------ *
   *  ÁP DỤNG TRẠNG THÁI LICENSE (nghe realtime)                          *
   * ------------------------------------------------------------------ */
  var _quyenCu=null;
  function applyLicense(r){
    rec=r||null;
    /* Hồ sơ bản quyền về SAU khi màn hình đã vẽ (~1 giây). Nếu phạm vi đã chốt khác
       với cái màn KHGD đang hiện (VD quản trị vừa sửa quyền) thì phải vẽ lại, không
       thì thầy cô nhìn thấy danh sách lớp/môn cũ cho tới khi chuyển màn. Chỉ vẽ lại
       khi chuỗi quyền THỰC SỰ đổi, kẻo mỗi tín hiệu realtime lại reset bộ lọc. */
    var qm=(rec&&rec.quyen)||'';
    if(qm!==_quyenCu){ _quyenCu=qm;
      try{ if(typeof window.BX_khgdRebuild==='function') window.BX_khgdRebuild(); }catch(e){}
    }
    var now=Date.now();
    var okPaid = !!(rec && rec.daTraPhi) && (!rec.ngayHetHan || now<=rec.ngayHetHan);
    if(!okPaid){
      window.BXLIC_laMaySoan=null; window.BXLIC_coTheDoiVai=false;
      try{ if(window.BX_capNhatCheDoXem) window.BX_capNhatCheDoXem(); }catch(e){}
      setPaid(false, 0); return;
    }

    /* Đã trả phí & còn hạn → kiểm tra thiết bị.
       (9/8/2026 — Bước 2) HAI NGĂN: devices.chinh = MÁY TÍNH (soạn) · devices.phu = ĐIỆN THOẠI
       (xem + tải Word). Khoá theo MÃ BỀN devIdBen(); trường `device` (vân tay cũ) giữ nguyên
       làm cầu tương thích cho license.js cũ còn trong bộ đệm máy khác. */
    var cam=laCamTay();
    var D=rec.devices||{};
    var chinhId=(D.chinh&&D.chinh.id)||null, phuId=(D.phu&&D.phu.id)||null;
    var laChinh=!!(chinhId&&chinhId===devB), laPhu=!!(phuId&&phuId===devB);
    // Tương thích ngược: máy đã gắn theo vân tay cũ chính là ngăn chính → nâng cấp êm sang mã bền
    if(!laChinh && !chinhId && rec.device && rec.device===dev){
      laChinh=true;
      try{ db.ref('licenses/'+user.uid+'/devices/chinh').set({id:devB, ts:Date.now()}); }catch(e){}
    }
    // Vừa kích hoạt, chưa gắn máy nào: MÁY TÍNH đầu tiên mở app thành ngăn chính
    if(!laChinh && !laPhu && !chinhId && !rec.device && !cam){
      laChinh=true;
      try{
        db.ref('licenses/'+user.uid+'/devices/chinh').set({id:devB, ts:Date.now()});
        db.ref('licenses/'+user.uid+'/device').set(dev);   // cầu cho bản license.js cũ trong bộ đệm
      }catch(e){}
    }
    // Điện thoại đầu tiên: ngăn phụ còn trống → tự gắn, KHÔNG tốn lượt
    // (!laChinh: điện thoại từng gắn legacy thời 1-ngăn là máy CHÍNH rồi — đừng chiếm nốt ngăn phụ)
    if(cam && !laChinh && !laPhu && !phuId){
      laPhu=true;
      try{ db.ref('licenses/'+user.uid+'/devices/phu').set({id:devB, ts:Date.now()}); }catch(e){}
    }

    /* Vai soạn: mặc định ngăn chính; vaiSoan='phu' = thầy cô đã chuyển quyền soạn sang điện thoại
       (van dự phòng máy tính hỏng). Cờ này chỉ quyết CHẾ ĐỘ XEM (index.html), không đụng trả phí. */
    var vaiPhu=(rec.vaiSoan==='phu' && !!phuId);   // vai trỏ vào ngăn rỗng (bị sửa tay) → coi như 'chinh', khỏi cảnh không máy nào soạn
    window.BXLIC_laMaySoan=(laChinh||laPhu)?(vaiPhu?laPhu:laChinh):null;
    window.BXLIC_coTheDoiVai=!!((laChinh||laPhu)&&((rec.soLanDoiVai||0)<CONFIG.SO_LAN_DOI_VAI_TOI_DA));
    try{ if(window.BX_capNhatCheDoXem) window.BX_capNhatCheDoXem(); }catch(e){}

    if(laChinh||laPhu){ setPaid(true, rec.ngayHetHan||hetHanFor(rec.namHoc||curNamHoc())); return; }

    // Máy lạ → khoá, mời đổi máy trong đúng NGĂN của nó nếu còn lượt
    setPaid(false, 0);
    if(cam){ showDeviceMismatchPhu(CONFIG.SO_LAN_DOI_MAY_PHU_TOI_DA-(rec.soLanDoiMayPhu||0)); }
    else { showDeviceMismatch(CONFIG.SO_LAN_DOI_MAY_TOI_DA-(rec.soLanDoiMay||0)); }
  }

  function showDeviceMismatch(left){
    var o=overlay('bxlic-dev');
    var body = left>0
      ? '<p style="font-size:14px;line-height:1.6">Bản quyền của thầy/cô đang gắn với <b>một thiết bị khác</b>. '+
        'Thầy/cô còn <b>'+left+'</b> lượt chuyển sang máy mới trong năm học này.</p>'+
        '<p style="font-size:12.5px;color:#667;line-height:1.5">Lưu ý: xoá dữ liệu trình duyệt/cache cũng được tính là máy mới.</p>'+
        '<button class="bxlic-btn" onclick="BXLIC_switchDevice()">📲 Dùng bản quyền trên máy này</button>'+
        '<button class="bxlic-btn sec" onclick="BXLIC_close(\'bxlic-dev\')">Để sau</button>'
      : '<p style="font-size:14px;line-height:1.6">Bản quyền đã <b>hết lượt đổi thiết bị</b> trong năm học này. '+
        'Vui lòng liên hệ <b>'+esc(CONFIG.HOTLINE)+'</b> để được hỗ trợ!</p>'+
        '<button class="bxlic-btn sec" onclick="BXLIC_close(\'bxlic-dev\')">Đã hiểu</button>';
    o.innerHTML='<div class="bxlic-card"><div class="bxlic-hd"><h3>🔐 Thiết bị mới</h3>'+
      '<button class="x" onclick="BXLIC_close(\'bxlic-dev\')">×</button></div>'+
      '<div class="bxlic-bd">'+body+'</div></div>';
    o.classList.add('on');
  }
  window.BXLIC_switchDevice=function(){
    if(!user||!db||!rec) return;
    var used=rec.soLanDoiMay||0;
    if(used>=CONFIG.SO_LAN_DOI_MAY_TOI_DA){ return; }
    var upd={}; upd['licenses/'+user.uid+'/device']=dev; upd['licenses/'+user.uid+'/soLanDoiMay']=used+1;
    upd['licenses/'+user.uid+'/devices/chinh']={id:devB, ts:Date.now()};   // (9/8/2026) ghi cả mã bền ngăn chính
    db.ref().update(upd).then(function(){ closeOv('bxlic-dev'); /* listener sẽ tự mở khoá */ })
      .catch(function(){ if(window.bxAlert) bxAlert('Chưa đổi được máy (kiểm tra mạng).'); });
  };
  /* (9/8/2026 — Bước 2) Điện thoại lạ trong khi ngăn phụ đã gắn máy khác */
  function showDeviceMismatchPhu(left){
    var o=overlay('bxlic-dev');
    var body = left>0
      ? '<p style="font-size:14px;line-height:1.6">Bản quyền của thầy/cô đang gắn với <b>một điện thoại khác</b>. '+
        'Mỗi bản quyền dùng được trên <b>1 máy tính + 1 điện thoại</b>; thầy/cô còn <b>'+left+'</b> lượt đổi điện thoại trong năm học này.</p>'+
        '<p style="font-size:12.5px;color:#667;line-height:1.5">Lưu ý: xoá dữ liệu trình duyệt/cache cũng được tính là máy mới.</p>'+
        '<button class="bxlic-btn" onclick="BXLIC_switchDevicePhu()">📲 Dùng bản quyền trên điện thoại này</button>'+
        '<button class="bxlic-btn sec" onclick="BXLIC_close(\'bxlic-dev\')">Để sau</button>'
      : '<p style="font-size:14px;line-height:1.6">Bản quyền đã <b>hết lượt đổi điện thoại</b> trong năm học này. '+
        'Vui lòng liên hệ <b>'+esc(CONFIG.HOTLINE)+'</b> để được hỗ trợ!</p>'+
        '<button class="bxlic-btn sec" onclick="BXLIC_close(\'bxlic-dev\')">Đã hiểu</button>';
    o.innerHTML='<div class="bxlic-card"><div class="bxlic-hd"><h3>🔐 Điện thoại mới</h3>'+
      '<button class="x" onclick="BXLIC_close(\'bxlic-dev\')">×</button></div>'+
      '<div class="bxlic-bd">'+body+'</div></div>';
    o.classList.add('on');
  }
  window.BXLIC_switchDevicePhu=function(){
    if(!user||!db||!rec) return;
    var used=rec.soLanDoiMayPhu||0;
    if(used>=CONFIG.SO_LAN_DOI_MAY_PHU_TOI_DA){ return; }
    var upd={}; upd['licenses/'+user.uid+'/devices/phu']={id:devB, ts:Date.now()}; upd['licenses/'+user.uid+'/soLanDoiMayPhu']=used+1;
    db.ref().update(upd).then(function(){ closeOv('bxlic-dev'); /* listener sẽ tự mở khoá */ })
      .catch(function(){ if(window.bxAlert) bxAlert('Chưa đổi được điện thoại (kiểm tra mạng).'); });
  };
  /* (9/8/2026 — Bước 2) ĐỔI VAI SOẠN về máy này — van dự phòng khi máy tính hỏng giữa năm.
     Chỉ máy ĐÃ GẮN (chinh hoặc phu) mới đổi được; tốn 1 trong 2 lượt/năm. Chỉ đổi quyền SOẠN
     (chế độ xem trong index.html), không đụng gì tới trả phí hay khối quyền. */
  window.BXLIC_doiVai=function(){
    if(!user||!db||!rec){ return; }
    var D=rec.devices||{};
    var laChinh=!!(D.chinh&&D.chinh.id===devB), laPhu=!!(D.phu&&D.phu.id===devB);
    if(!laChinh&&!laPhu){ if(window.bxAlert) bxAlert('Máy này chưa gắn với bản quyền nên chưa đổi vai được.'); return; }
    var vaiMoi=laPhu?'phu':'chinh';
    if((rec.vaiSoan||'chinh')===vaiMoi){ if(window.bxAlert) bxAlert('Máy này đang giữ quyền soạn rồi ạ.'); return; }
    var used=rec.soLanDoiVai||0;
    if(used>=CONFIG.SO_LAN_DOI_VAI_TOI_DA){ if(window.bxAlert) bxAlert('Đã hết '+CONFIG.SO_LAN_DOI_VAI_TOI_DA+' lượt đổi vai soạn trong năm học này.\nVui lòng liên hệ '+CONFIG.HOTLINE+' để được hỗ trợ.'); return; }
    var lam=function(){
      var upd={}; upd['licenses/'+user.uid+'/vaiSoan']=vaiMoi; upd['licenses/'+user.uid+'/soLanDoiVai']=used+1;
      db.ref().update(upd)
        .then(function(){ if(window.bxAlert) bxAlert('✓ Máy này giờ là máy SOẠN.\nMáy còn lại chuyển sang chế độ xem.'); })
        .catch(function(){ if(window.bxAlert) bxAlert('Chưa đổi được vai (kiểm tra mạng).'); });
    };
    if(window.bxConfirm) bxConfirm('Chuyển quyền SOẠN về máy này? Máy còn lại sẽ chỉ xem.\n(Còn '+(CONFIG.SO_LAN_DOI_VAI_TOI_DA-used)+' lượt đổi vai trong năm học)',{okText:'Chuyển'}).then(function(ok){ if(ok) lam(); });
    else lam();
  };

  /* ------------------------------------------------------------------ *
   *  HUY HIỆU trạng thái (góc màn hình)                                  *
   * ------------------------------------------------------------------ */
  function renderBadge(){
    var b=document.getElementById('bxlic-headbtn'), hr=document.querySelector('.header-right');
    if(!user){ if(b) b.remove(); renderAdminBtn(); return; }
    if(!b && hr){
      b=document.createElement('button'); b.id='bxlic-headbtn'; b.type='button';
      b.onclick=function(){ if(!paid) showActivate(); };
      var fb=document.getElementById('fb-auth'); hr.insertBefore(b, fb||null);
    }
    if(b){
      if(paid){ b.className='bxlic-headbtn ok'; b.innerHTML='✓ Bản quyền'; b.title='Đã kích hoạt'+(rec&&rec.ngayHetHan?(' · hết hạn '+fmtDate(rec.ngayHetHan)):''); }
      else { b.className='bxlic-headbtn'; b.innerHTML='🔓 Kích hoạt bản quyền'; b.title='Bấm để mở khoá tải giáo án'; }
    }
    renderAdminBtn();
  }
  /* 3/8/2026: bỏ nút nổi "Quản trị bản quyền" — trên điện thoại nó đè lên thanh điều hướng
     đáy (z-index cao hơn) làm nút "Nhắc"/"Thêm" bấm không ăn. Lối vào chuyển sang menu
     tài khoản góc phải (index.html renderUI gọi BXLIC.openAdmin khi BXLIC.isAdmin()). */
  function renderAdminBtn(){
    var a=document.getElementById('bxlic-adminbtn'); if(a) a.remove();
  }

  /* ------------------------------------------------------------------ *
   *  TRANG QUẢN TRỊ (chỉ admin)                                          *
   * ------------------------------------------------------------------ */
  function openAdmin(){
    if(!isAdmin()||!db) return;
    var o=overlay('bxlic-adminov'); o.classList.add('on');
    o.innerHTML='<div class="bxlic-card wide"><div class="bxlic-hd"><h3>⚙ Quản trị bản quyền Bút Xanh</h3>'+
      '<button class="x" onclick="BXLIC_close(\'bxlic-adminov\')">×</button></div>'+
      '<div class="bxlic-bd" id="bxlic-admbody"><div style="padding:20px;text-align:center;color:#667">Đang tải danh sách…</div></div></div>';
    db.ref('licenses').once('value').then(function(snap){
      var v=snap.val()||{}, uids=Object.keys(v);
      var waiting=uids.filter(function(u){ return v[u] && v[u].daYeuCau && !v[u].daTraPhi; });
      var rows=uids.map(function(u){ var r=v[u]||{}; return {uid:u,r:r}; })
        .sort(function(a,b){ return (b.r.yeuCauTs||0)-(a.r.yeuCauTs||0); });
      var html='<div class="bxlic-note" style="margin:0 0 10px">Chờ xác nhận: <b>'+waiting.length+'</b> · Tổng tài khoản: <b>'+uids.length+'</b>. '+
        'Bấm <b>Kích hoạt</b> sau khi đã nhận được 99.000đ (đối chiếu Nội dung CK).</div>'+
        /* (9/8/2026) Ô tìm kiếm — GV gọi điện chỉ cần đọc TÊN hoặc EMAIL, không cần nhớ mã CK */
        '<input id="bxlic-tim" type="search" placeholder="🔍 Tìm theo tên, email, mã CK…" oninput="BXLIC_timLoc(this.value)" '+
        'style="width:100%;box-sizing:border-box;margin:0 0 10px;padding:10px 12px;font-size:15px;border:1.5px solid #cfe0d6;border-radius:10px;outline:none">';
      html+='<div style="overflow:auto;max-height:60vh"><table class="bxlic-tbl"><thead><tr>'+
        '<th>Họ tên / Email</th><th>Mã CK</th><th>Trạng thái</th><th>Kích hoạt lúc</th><th>Hết hạn</th><th>Đổi máy</th><th>Quyền (khối : môn)</th><th>Thao tác</th></tr></thead><tbody id="bxlic-admrows">';
      if(!rows.length){ html+='<tr><td colspan="8" style="text-align:center;color:#889;padding:16px">Chưa có tài khoản nào yêu cầu.</td></tr>'; }
      rows.forEach(function(x){
        var r=x.r, ok=!!r.daTraPhi;
        html+='<tr data-tim="'+esc(bodau((r.hoTen||'')+' '+(r.email||'')+' '+(r.maCK||maCKof(x.uid))+' '+x.uid))+'">'+
          '<td><b>'+esc(r.hoTen||'—')+'</b><br><span style="color:#667;font-size:12px">'+esc(r.email||'')+'</span>'+(r.daYeuCau&&!ok?' <span style="color:#b00020">• chờ</span>':'')+'</td>'+
          '<td><code>'+esc(r.maCK||maCKof(x.uid))+'</code></td>'+
          '<td><span class="bxlic-tag '+(ok?'ok':'no')+'">'+(ok?'Đã trả':'Chưa')+'</span></td>'+
          '<td style="white-space:nowrap">'+(ok?fmtLuc(r.kichHoatTs||r.ngayTra):'—')+'</td>'+
          '<td>'+fmtDate(r.ngayHetHan)+'</td>'+
          /* Ép SỐ hai trường client-ghi-được — chặn chèn mã vào bảng admin (phản biện 9/8) */
          '<td>💻'+(Number(r.soLanDoiMay)||0)+'/'+CONFIG.SO_LAN_DOI_MAY_TOI_DA+' 📱'+(Number(r.soLanDoiMayPhu)||0)+'/'+CONFIG.SO_LAN_DOI_MAY_PHU_TOI_DA+(r.vaiSoan==='phu'?' 🔁soạn:ĐT':'')+'</td>'+
          '<td><b>'+esc(r.quyen||(r.khoi?(String(r.khoi).split(/[^1-5]+/).filter(Boolean).map(function(k){return k+':*';}).join('|')):'')||'—')+'</b></td>'+
          '<td style="white-space:nowrap">'+
            '<button class="bxlic-mini" onclick="BXLIC_activate(\''+x.uid+'\')">'+(ok?'Gia hạn':'Kích hoạt')+'</button>'+
            '<button class="bxlic-mini d" onclick="BXLIC_resetDevice(\''+x.uid+'\')">Reset máy</button>'+
            '<button class="bxlic-mini d" onclick="BXLIC_setKhoi(\''+x.uid+'\')">Sửa quyền</button>'+
            (ok?'<button class="bxlic-mini r" onclick="BXLIC_lock(\''+x.uid+'\')">Khoá</button>':'')+
          '</td>'+
        '</tr>';
      });
      html+='</tbody></table></div>';
      var bd=document.getElementById('bxlic-admbody'); if(bd) bd.innerHTML=html;
    }).catch(function(e){
      var bd=document.getElementById('bxlic-admbody');
      if(bd) bd.innerHTML='<div class="bxlic-note">Không đọc được danh sách. Kiểm tra Luật (Rules) Realtime Database đã cho phép admin đọc nhánh <b>licenses</b> chưa.<br><small>'+esc((e&&e.message)||'')+'</small></div>';
    });
  }
  /* Lọc bảng quản trị theo ô tìm kiếm (không phân biệt dấu) */
  window.BXLIC_timLoc=function(q){
    var body=document.getElementById('bxlic-admrows'); if(!body) return;
    var tu=bodau(q).split(/\s+/).filter(Boolean);
    var trs=body.getElementsByTagName('tr');
    for(var i=0;i<trs.length;i++){
      var d=trs[i].getAttribute('data-tim')||'';
      var hien=tu.every(function(t){ return d.indexOf(t)>=0; });
      trs[i].style.display=hien?'':'none';
    }
  };
  window.BXLIC_activate=function(uid){
    var nh=curNamHoc();
    var upd={};
    upd['licenses/'+uid+'/daTraPhi']=true;
    upd['licenses/'+uid+'/namHoc']=nh;
    upd['licenses/'+uid+'/ngayHetHan']=hetHanFor(nh);
    upd['licenses/'+uid+'/soLanDoiMay']=0;
    upd['licenses/'+uid+'/soLanDoiMayPhu']=0;
    upd['licenses/'+uid+'/soLanDoiVai']=0;
    upd['licenses/'+uid+'/daYeuCau']=false;
    upd['licenses/'+uid+'/kichHoatTs']=firebase.database.ServerValue.TIMESTAMP;
    db.ref().update(upd).then(function(){ openAdmin(); }).catch(function(e){ if(window.bxAlert) bxAlert('Lỗi kích hoạt: '+((e&&e.message)||'')); });
  };
  window.BXLIC_resetDevice=function(uid){
    /* (9/8/2026) Gỡ CẢ HAI NGĂN + vai + mọi lượt — GV gắn lại từ đầu như tài khoản mới kích hoạt */
    var upd={}; upd['licenses/'+uid+'/device']=null; upd['licenses/'+uid+'/soLanDoiMay']=0;
    upd['licenses/'+uid+'/devices']=null; upd['licenses/'+uid+'/soLanDoiMayPhu']=0;
    upd['licenses/'+uid+'/vaiSoan']=null; upd['licenses/'+uid+'/soLanDoiVai']=0;
    db.ref().update(upd).then(function(){ openAdmin(); }).catch(function(){});
  };
  /* Đọc chuỗi quyền admin gõ tay. Nhận cả hai lối viết:
       "1,3"                → mở TRỌN khối 1 và khối 3 (lối cũ, vẫn dùng được)
       "3:* | 1:Đạo đức"    → trọn khối 3; khối 1 chỉ môn Đạo đức
     Nhóm cách nhau bằng  |  hoặc  ;   ·   nhiều môn trong một khối cách nhau bằng dấu phẩy. */
  function docQuyenNhap(v){
    var s=String(v||'').trim(); if(!s) return null;
    if(s.indexOf(':')<0){                        // lối cũ: chỉ liệt kê khối
      var ds=s.split(/[^1-5]+/).filter(Boolean).filter(function(k,i,a){ return a.indexOf(k)===i; }).sort();
      if(!ds.length) return null;
      var q0={}; ds.forEach(function(k){ q0[k]='*'; }); return q0;
    }
    var q={};
    s.split(/[;|]/).forEach(function(ph){
      var i=ph.indexOf(':'); if(i<0) return;
      var k=ph.slice(0,i).replace(/[^1-5]/g,'').slice(0,1); if(!k) return;
      var phan=ph.slice(i+1).trim();
      if(phan==='*'){ q[k]='*'; return; }
      if(q[k]==='*') return;
      var ms=phan.split(',').map(canonMon).filter(Boolean);
      if(ms.length) q[k]=(q[k]||[]).concat(ms).filter(function(m,j,a){ return a.indexOf(m)===j; }).sort();
    });
    return Object.keys(q).length?q:null;
  }
  /* Sửa quyền cho một bản quyền. Dùng khi thầy cô chuyển khối giữa năm, hoặc được
     phân công dạy thêm một môn ở lớp khác. Để TRỐNG rồi OK = xoá gắn kết, lần tải
     sau app tự gắn lại theo thời khoá biểu hiện tại. */
  window.BXLIC_setKhoi=function(uid){
    db.ref('licenses/'+uid).once('value').then(function(s){
      var r=s.val()||{};
      var cu=String(r.quyen||'') ||
             String(r.khoi||'').split(/[^1-5]+/).filter(Boolean).map(function(k){return k+':*';}).join('|');
      var v=prompt('Quyền tải giáo án & KHDH của '+(r.hoTen||r.email||uid)+'\n\n'+
                   'Mỗi khối một nhóm, cách nhau bằng dấu |\n'+
                   '   <khối>:*            = trọn khối, mọi môn\n'+
                   '   <khối>:<môn>,<môn>  = chỉ mấy môn đó\n\n'+
                   'VD:  3:*|1:Đạo đức      (chủ nhiệm lớp 3, dạy thêm Đạo đức lớp 1)\n'+
                   'VD:  1:Âm nhạc|2:Âm nhạc|3:Âm nhạc   (giáo viên Âm nhạc)\n'+
                   'Vẫn nhận lối cũ chỉ ghi khối, VD:  1,3  = trọn khối 1 và 3.\n\n'+
                   'Để trống = xoá gắn kết, lần tải sau app tự gắn lại theo thời khoá biểu.', cu);
      if(v===null) return;                       // bấm Huỷ
      var q=docQuyenNhap(v);
      var upd={};
      upd['licenses/'+uid+'/quyen']=q?ghiQuyen(q):null;
      upd['licenses/'+uid+'/khoi']=q?Object.keys(q).sort().join(','):null;
      db.ref().update(upd)
        .then(function(){ openAdmin(); })
        .catch(function(e){ if(window.bxAlert) bxAlert('Không lưu được: '+((e&&e.message)||'')); });
    }).catch(function(){});
  };
  window.BXLIC_lock=function(uid){
    db.ref('licenses/'+uid+'/daTraPhi').set(false).then(function(){ openAdmin(); }).catch(function(){});
  };

  /* ------------------------------------------------------------------ *
   *  CỔNG KIỂM TRA TẢI FILE (index.html gọi trước khi tải)               *
   * ------------------------------------------------------------------ */
  /* CHỈ 3 nhóm tệp sau mới đòi bản quyền (thầy Chung chốt 31/7/2026):
       1) KHBD_*        — giáo án Word (từng tiết / cả tuần / tất cả / tải từ Kho)
       2) KHGD_mon_*    — Kế hoạch giáo dục môn học (Word)
       3) KhoGiaoAn_*   — xuất TOÀN BỘ kho giáo án ra JSON (nếu mở, việc khoá Word thành vô nghĩa)
       4) KHDH_*        — xuất bảng Kế hoạch dạy học ra JSON (cùng lẽ với mục 3; thêm 5/8/2026
                          vì tên tệp KHDH_MonHoc_ButXanh.json không khớp mẫu KHGD_mon_ nên lọt cổng)
     MIỄN PHÍ: link bài giảng trình chiếu, mẫu trống (Mau_*), lịch báo giảng, thời khoá biểu,
     danh sách học sinh, báo cáo thống kê, sao lưu dữ liệu cá nhân, bài giảng PPTX tự tạo… */
  var RE_CAN_PHI = /^(KHBD_|KHGD_mon_|KhoGiaoAn_|KHDH_)/i;
  function needPaid(fileName){
    var n = String(fileName||'').replace(/^.*[\\\/]/,'');
    return RE_CAN_PHI.test(n);
  }

  /* ------------------------------------------------------------------ *
   *  QUYỀN THEO KHỐI × MÔN                                               *
   * ------------------------------------------------------------------ */
  /* 5/8/2026 — thầy Chung chốt làm MỊN tới môn.
     Trước: bản quyền gắn theo KHỐI, nên chỉ một ô "Đạo đức lớp 1" trong thời khoá
     biểu là mở toang cả khối 1 (tải được luôn Toán 1, Tiếng Việt 1…).
     Nay ghi ở  licenses/<uid>/quyen  dạng chuỗi:
         "3:*|1:Đạo đức"      → trọn khối 3; khối 1 chỉ môn Đạo đức
     QUY TẮC TỰ GẮN theo thời khoá biểu thầy cô đã khai:
       · khối dạy TỪ 3 MÔN trở lên → mở TRỌN khối ("3:*"). Đây là khối chủ nhiệm;
         mở trọn để không chặn oan khi dạy thay hoặc quên khai một môn vào TKB.
       · khối chỉ 1-2 môn          → mở ĐÚNG môn đó ("1:Đạo đức").
     Nhờ vậy GV bộ môn (Âm nhạc, GDTC, Tiếng Anh…) dạy 1 môn ở cả 5 khối vẫn ra
     đúng môn của mình ở từng khối, không ai phải xin phép.
     Trường `khoi` cũ VẪN ĐỌC ĐƯỢC (coi như trọn khối) để bản quyền đã bán không bị
     gián đoạn; mỗi lần gắn lại app ghi CẢ HAI trường. */

  /* Đưa tên môn về một dạng chuẩn để so sánh: thời khoá biểu ghi "HĐTN"/"Thể dục",
     kho ghi "Hoạt động trải nghiệm"/"GDTC" — không quy về cùng dạng là chặn oan. */
  function canonMon(m){
    var s=String(m||'').trim(); if(!s) return '';
    try{ if(typeof window._bxCanonSubject==='function'){ var c=window._bxCanonSubject(s); if(c) return c; } }catch(e){}
    return s;
  }
  function khoaMon(m){
    return String(canonMon(m)).toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'');
  }

  /* Chuỗi "3:*|1:Đạo đức" → {'3':'*', '1':['Đạo đức']}
     Tham số `r` chỉ dùng khi cần đọc hồ sơ khác (kiểm thử); bỏ trống = hồ sơ đang đăng nhập. */
  function docQuyen(r){
    var hs = r || rec;
    var q={}, s = hs && hs.quyen;
    if(s){
      String(s).split('|').forEach(function(ph){
        var i=ph.indexOf(':'); if(i<0) return;
        var k=ph.slice(0,i).replace(/[^1-5]/g,'').slice(0,1); if(!k) return;
        var v=ph.slice(i+1).trim();
        if(v==='*'){ q[k]='*'; return; }
        if(q[k]==='*') return;
        var ds=v.split(',').map(canonMon).filter(Boolean);
        if(ds.length) q[k]=(q[k]||[]).concat(ds);
      });
    }
    /* Bản quyền bán trước 5/8/2026 chỉ có trường `khoi` → coi như trọn khối */
    if(!Object.keys(q).length && hs && hs.khoi){
      String(hs.khoi).split(/[^1-5]+/).filter(Boolean).forEach(function(k){ q[k]='*'; });
    }
    return q;
  }
  function ghiQuyen(q){
    return Object.keys(q).sort().map(function(k){
      return k+':'+(q[k]==='*'?'*':q[k].join(','));
    }).join('|');
  }
  /* Phân công {khối:[môn]} → quyền {khối:'*'|[môn]}. Hàm THUẦN, tách riêng để kiểm thử. */
  function tinhQuyen(phanCong){
    var q={}, nguong=CONFIG.NGUONG_MON_TRON_KHOI||3;
    Object.keys(phanCong||{}).forEach(function(k){
      if(!/^[1-5]$/.test(k)) return;
      var ds=(phanCong[k]||[]).map(canonMon).filter(Boolean);
      ds=ds.filter(function(m,i,a){ return a.indexOf(m)===i; });
      if(!ds.length) return;                       // khối có mặt nhưng không rõ môn
      q[k]=(ds.length>=nguong)?'*':ds.sort();
    });
    return q;
  }
  /* Lõi kiểm quyền — THUẦN. mon rỗng (tệp gộp không mang tên môn) thì chỉ cần có
     quyền ở khối đó; việc lọc từng bài do nơi gọi tự làm (xem exportBankJson). */
  function thuQuyen(q, khoi, mon){
    if(!khoi) return true;
    var v=q[khoi];
    if(v===undefined) return false;
    if(v==='*') return true;
    if(!mon) return true;
    var k=khoaMon(mon);
    return v.some(function(m){ return khoaMon(m)===k; });
  }

  /* Bóc khối lớp từ TÊN TỆP. Hai dạng đang dùng:
       KHBD_<tên bài>_Lop5.docx · KHBD_<tên bài>_Tuan8_Lop5.docx
       KHGD_mon_Tieng_Viet_5_2026_2027.docx   (khối nằm giữa tên môn và năm học)
     Không nhận ra khối → trả '' (không chặn theo khối, chỉ cần đã trả phí). */
  function khoiCuaTep(fileName){
    var n = String(fileName||'').replace(/^.*[\\\/]/,'').replace(/\.[A-Za-z0-9]+$/,'');
    /* KHBD: lấy LẦN CUỐI của "_Lop<khối>" — tên bài có thể chứa chữ "Lop" nên
       phần đứng cuối mới là lớp thật. Lớp hay ghi kèm chữ cái ("Lop5A") nên
       KHÔNG đòi ranh giới từ sau chữ số; nhưng chặn số nhiều chữ số ("Lop15"). */
    var m = null, re = /_Lop\s*([1-5])(?![0-9])/gi, x;
    while((x = re.exec(n)) !== null) m = x;
    if(m) return m[1];
    /* KHDH: KHGD_mon_<tên môn>_<khối>_<năm học> — khối là số 1 chữ số đứng
       ngay trước năm học, hoặc là cụm cuối cùng nếu không có năm. */
    if(/^KHGD_mon_/i.test(n)){
      m = n.match(/_([1-5])_\d{4}/);         if(m) return m[1];
      m = n.match(/_([1-5])$/);              if(m) return m[1];
    }
    return '';
  }
  /* Bóc MÔN từ tên tệp KHGD môn học: KHGD_mon_Dao_Duc_1_2026_2027.docx → "Đạo đức".
     Tên tệp KHBD KHÔNG mang tên môn ở nhiều đường tải, nên những nơi đó truyền
     thẳng tên môn vào cổng qua tham số `mon` thay vì trông vào tên tệp. */
  function monCuaTep(fileName){
    var n = String(fileName||'').replace(/^.*[\\\/]/,'').replace(/\.[A-Za-z0-9]+$/,'');
    var m = n.match(/^KHGD_mon_(.+?)_[1-5](?:_\d{4}.*)?$/i);
    return m ? canonMon(m[1].replace(/_+/g,' ').trim()) : '';
  }
  /* Các khối thầy cô có quyền. ⚠️ Phải dựa vào quyenHienHanh() chứ KHÔNG phải
     docQuyen(): docQuyen chỉ đọc phạm vi đã gắn vào bản quyền trên Firebase, nên
     thầy cô CHƯA đăng nhập luôn ra rỗng — đã một lần làm màn Kho báo nhầm "chưa có
     giáo án" trong lúc chờ tải kho. */
  function dsKhoi(){
    return Object.keys(quyenHienHanh()).sort();
  }
  function dsMon(khoi){       // '*' = trọn khối · mảng = mấy môn · null = không có quyền
    var v=quyenHienHanh()[String(khoi||'').replace(/\D/g,'').slice(0,1)];
    return (v===undefined)?null:v;
  }
  function phanCongGVDay(){   // phân công {khối:[môn]} lấy từ thời khoá biểu
    try{ if(typeof window.BX_phanCongGVDay==='function'){ var a=window.BX_phanCongGVDay(); if(a) return a; } }catch(e){}
    return {};
  }
  /* Phạm vi thầy cô TỰ CHỌN ở bảng "Lớp và môn tôi dạy" (index.html) — ưu tiên hơn
     việc suy ngầm từ thời khoá biểu. */
  function quyenDaChon(){
    try{ if(typeof window.BX_quyenDaChon==='function'){
      var s=window.BX_quyenDaChon();
      if(s){ var q=docQuyenNhap(s); if(q && Object.keys(q).length) return q; }
    } }catch(e){}
    return null;
  }
  /* Quyền ĐANG CÓ HIỆU LỰC, theo thứ tự ưu tiên:
       1) đã gắn vào bản quyền (rec.quyen / rec.khoi) — kích hoạt xong là chốt
       2) thầy cô tự chọn ở bảng "Lớp và môn tôi dạy"
       3) suy tạm từ thời khoá biểu (khi chưa chọn gì) */
  /* ⚠️ HIỆU NĂNG: hàm này bị gọi cho TỪNG TIẾT khi lọc kho giáo án (hàng nghìn lần
     mỗi lần vẽ màn Kho). Không nhớ kết quả thì mỗi tiết lại phân tích lại thời khoá
     biểu + lịch báo giảng từ localStorage → màn hình đứng vài giây, đúng kiểu lỗi
     "nút đơ" đã tốn công chẩn đoán hôm 3/8. Nhớ theo khoá = phạm vi đã gắn + phạm vi
     tự chọn; riêng đường suy từ thời khoá biểu thì nhớ tạm 5 giây vì không có cách
     rẻ để biết thầy cô vừa sửa thời khoá biểu. Sửa xong gọi quenQuyen() cho chắc. */
  var _qNho=null, _qKhoa='', _qLuc=0;
  function quyenHienHanh(){
    var gan=(rec&&rec.quyen)||'', chon='';
    if(!gan){ try{ if(typeof window.BX_quyenDaChon==='function') chon=window.BX_quyenDaChon()||''; }catch(e){} }
    var khoa=gan+' '+chon+' '+((rec&&rec.khoi)||'');
    var duaVaoTKB=(!gan && !chon && !(rec&&rec.khoi)), now=Date.now();
    if(_qNho && _qKhoa===khoa && (!duaVaoTKB || now-_qLuc<5000)) return _qNho;
    var q=docQuyen();
    if(!Object.keys(q).length){
      var c=quyenDaChon();
      q=(c && Object.keys(c).length) ? c : tinhQuyen(phanCongGVDay());
    }
    _qNho=q; _qKhoa=khoa; _qLuc=now;
    return q;
  }
  function quenQuyen(){ _qNho=null; _qKhoa=''; }
  function daKhoaQuyen(){ return !!(paid && rec && rec.quyen); }
  /* Chốt phạm vi vào bản quyền. CHỈ ghi khi ĐÃ TRẢ PHÍ — trước đó thầy cô còn được
     đổi lựa chọn thoải mái (thầy Chung chốt 5/8/2026). */
  function ganQuyenLanDau(khoiTep){
    var q=quyenDaChon();
    if(!q){
      var pc=phanCongGVDay(); q=tinhQuyen(pc);
      if(!Object.keys(q).length){
        /* Chưa chọn, chưa khai thời khoá biểu → giữ nếp cũ: mở TRỌN khối đang có,
           để thầy cô mới cài không bị chặn oan. */
        Object.keys(pc).forEach(function(k){ if(/^[1-5]$/.test(k)) q[k]='*'; });
        if(!Object.keys(q).length && khoiTep) q[khoiTep]='*';
      }
    }
    if(!Object.keys(q).length) return {};
    if(!paid) return q;                                 // chưa kích hoạt → dùng, chưa chốt
    var chuoi=ghiQuyen(q), ks=Object.keys(q).sort().join(',');
    try{ if(user&&db){ var u={};
      u['licenses/'+user.uid+'/quyen']=chuoi;
      u['licenses/'+user.uid+'/khoi']=ks;             // giữ trường cũ cho trang Quản trị
      /* (9/8/2026) PHẢI có .catch: suốt thời gian dài lệnh này bị Luật từ chối ÂM THẦM
         (rules không mở quyen/khoi cho GV) nên 20/20 bản quyền trả phí không hề được chốt.
         Rules nay đã mở kiểu "chỉ ghi được khi CHƯA có" — nếu vẫn fail thì phải thấy trong Console. */
      db.ref().update(u).catch(function(e){ console.warn('[BXLIC] chốt quyền chưa ghi được:', (e&&e.message)||e); }); } }catch(e){}
    if(rec){ rec.quyen=chuoi; rec.khoi=ks; }
    return q;
  }
  /* Câu chữ cho thầy cô đọc: "khối 3 (mọi môn) · khối 1 (Đạo đức)" */
  function moTaQuyen(q){
    var ks=Object.keys(q||{}).sort();
    if(!ks.length) return '';
    return ks.map(function(k){
      return 'khối '+k+' ('+(q[k]==='*'?'mọi môn':q[k].join(', '))+')';
    }).join(' · ');
  }
  function showKhoiMismatch(khoiTep, monTep, q){
    var o=overlay('bxlic-khoi'); o.classList.add('on');
    var thu = monTep ? ('môn <b>'+esc(canonMon(monTep))+'</b> của <b>khối '+esc(khoiTep)+'</b>')
                     : ('tài liệu <b>khối '+esc(khoiTep)+'</b>');
    o.innerHTML='<div class="bxlic-card"><div class="bxlic-hd"><h3>📘 Bản quyền theo lớp và môn</h3>'+
      '<button class="x" onclick="BXLIC_close(\'bxlic-khoi\')">×</button></div><div class="bxlic-bd">'+
      '<p style="font-size:14px;line-height:1.7">Bản quyền của thầy/cô dùng cho <b>'+esc(moTaQuyen(q))+'</b>, '+
      'nên chưa mở được '+thu+'.</p>'+
      '<p style="font-size:13.5px;line-height:1.7;color:#5b6b61">Phần được mở gắn theo <b>thời khoá biểu</b> thầy/cô đã khai: '+
      'khối nào dạy từ '+(CONFIG.NGUONG_MON_TRON_KHOI||3)+' môn trở lên thì mở trọn khối, khối chỉ dạy một vài môn '+
      'thì mở đúng môn đó. Nếu năm nay thầy/cô được phân công thêm, xin nhắn '+esc(CONFIG.HOTLINE)+' để được mở thêm.</p>'+
      '<button class="bxlic-btn" onclick="BXLIC_close(\'bxlic-khoi\')">Đã hiểu</button>'+
      '</div></div>';
  }
  /* Cổng kiểm quyền theo (KHỐI, MÔN). Trả true nếu ĐƯỢC.
     im=true → chỉ trả lời, không mở hộp giải thích (dùng khi lọc danh sách). */
  function duocPhep(khoi, mon, im){
    if(!CONFIG.KHOA_THEO_KHOI) return true;
    if(isAdmin()) return true;                        // admin xem được hết
    var k=String(khoi||'').replace(/\D/g,'').slice(0,1);
    if(!k) return true;                               // không rõ khối → không chặn
    var q=quyenHienHanh();
    if(!Object.keys(q).length) return true;           // không xác định được → cho qua
    /* Đã trả phí mà chưa chốt phạm vi → chốt đúng MỘT lần (ganQuyenLanDau đặt luôn
       rec.quyen nên lần gọi sau không vào đây nữa). */
    if(paid && rec && !rec.quyen){ try{ ganQuyenLanDau(k); quenQuyen(); }catch(e){} }
    if(thuQuyen(q,k,mon)) return true;
    if(!im) showKhoiMismatch(k, mon, q);
    return false;
  }
  function canDownloadKhoi(fileName, mon){
    var k=khoiCuaTep(fileName);
    if(!k) return true;                               // tệp không gắn với khối nào
    return duocPhep(k, mon||monCuaTep(fileName));
  }

  window.BXLIC = {
    canDownload: function(){ return paid===true; },
    needPaid: needPaid,                      // tệp này có đòi bản quyền không?
    canDownloadKhoi: canDownloadKhoi,        // tệp này có đúng khối/môn của thầy cô không?
    duocPhep: duocPhep,                      // (khối, môn, im) — cổng chính, dùng được ở mọi nơi
    khoiCuaTep: khoiCuaTep,
    monCuaTep: monCuaTep,
    dsKhoi: dsKhoi,
    dsMon: dsMon,
    quyenTheoKhoi: docQuyen,                 // {khối:'*'|[môn]} đã gắn cho bản quyền
    quyenHienHanh: quyenHienHanh,            // quyền đang có hiệu lực (gắn → tự chọn → TKB)
    quenQuyen: quenQuyen,                    // xoá bộ nhớ tạm — gọi sau khi đổi phạm vi
    daKhoaQuyen: daKhoaQuyen,                // đã kích hoạt & đã chốt phạm vi?
    hotline: function(){ return CONFIG.HOTLINE||''; },
    tinhQuyen: tinhQuyen,                    // {khối:[môn]} → quyền (hàm thuần, có kiểm thử)
    thuQuyen: thuQuyen,                      // (quyền, khối, môn) → bool (hàm thuần)
    moTaQuyen: moTaQuyen,
    showActivate: showActivate,
    openAdmin: openAdmin,
    isAdmin: isAdmin
  };

  /* ------------------------------------------------------------------ *
   *  LẮNG NGHE ĐĂNG NHẬP                                                 *
   * ------------------------------------------------------------------ */
  function onUser(u){
    if(licRef){ try{ licRef.off(); }catch(e){} licRef=null; }
    user=u;
    if(!u){ setPaid(false,0); renderWatermark(); renderBadge(); return; }
    // Optimistic từ cache (để GV đã trả phí dùng được cả khi mạng chập chờn)
    try{ var exp=parseInt(localStorage.getItem(cacheKey(u.uid))||'0',10); if(exp && Date.now()<=exp){ setPaid(true, exp); } else setPaid(false,0); }catch(e){ setPaid(false,0); }
    renderWatermark(); renderBadge();
    // Nghe realtime hồ sơ bản quyền của chính mình
    licRef=db.ref('licenses/'+u.uid);
    licRef.on('value', function(snap){ applyLicense(snap.val()); },
      function(err){ /* thiếu quyền đọc → giữ trạng thái cache, không làm hỏng app */ console.warn('[BXLIC] đọc license lỗi', err&&err.message); });
    // Bổ sung thông tin nhận diện (không bắt buộc)
    try{ db.ref('licenses/'+u.uid).update({ email:u.email||'', hoTen:u.displayName||'', maCK:maCKof(u.uid) }); }catch(e){}
  }

  function boot(){
    if(!window.firebase){ return; }              // offline: bỏ qua, app vẫn chạy
    if(!firebase.apps || !firebase.apps.length){ setTimeout(boot,120); return; }  // chờ index.html initApp
    injectCSS(); guardActions();
    try{ auth=firebase.auth(); db=firebase.database(); }catch(e){ return; }
    auth.onAuthStateChanged(onUser);
    // Hỗ trợ mở quản trị bằng #quantri
    if((location.hash||'').toLowerCase()==='#quantri'){ var t=setInterval(function(){ if(isAdmin()){ clearInterval(t); openAdmin(); } },400); setTimeout(function(){clearInterval(t);},8000); }
  }
  if(document.readyState!=='loading') boot(); else document.addEventListener('DOMContentLoaded',boot);
})();
