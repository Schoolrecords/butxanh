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
    SO_LAN_DOI_MAY_TOI_DA: 2,                  // đổi máy tối đa / năm học
    HOTLINE: 'Zalo/ĐT thầy Chung'              // hiển thị khi hết lượt đổi máy
  };

  /* ------------------------------------------------------------------ *
   *  TIỆN ÍCH                                                            *
   * ------------------------------------------------------------------ */
  function esc(s){ return (s==null?'':String(s)).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];}); }
  function fnv(str){ var h=0x811c9dc5; str=String(str); for(var i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=(h+((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)))>>>0; } return h>>>0; }
  function fmtVND(n){ return (n||0).toLocaleString('vi-VN')+'đ'; }
  function fmtDate(ms){ if(!ms) return '—'; try{ return new Date(ms).toLocaleDateString('vi-VN'); }catch(e){ return '—'; } }

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
  // Mã chuyển khoản ngắn, ổn định theo tài khoản (để đối soát tự động ở Phần 2)
  function maCKof(uid){ return ('BX'+fnv(uid).toString(36).toUpperCase()).slice(0,8); }

  /* ------------------------------------------------------------------ *
   *  TRẠNG THÁI                                                          *
   * ------------------------------------------------------------------ */
  var auth=null, db=null, user=null, licRef=null, rec=null, dev=deviceId();
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
    if(!user){ try{ if(window.FBX) FBX.login(); }catch(e){} return; }
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
          (dyn?('<button class="bxlic-btn sec" style="margin-top:8px" onclick="BXLIC_saveQR()">💾 Lưu ảnh mã QR về máy</button>'+
                '<details class="bxlic-help"><summary>📱 Đang dùng điện thoại, quét mã thế nào?</summary>'+
                  '<div>1️⃣ Bấm <b>Lưu ảnh mã QR về máy</b> ở trên.<br>'+
                  '2️⃣ Mở app ngân hàng ▸ <b>Quét mã QR</b> ▸ chọn <b>ảnh từ thư viện</b>.<br>'+
                  '3️⃣ App tự điền <b>đủ số tiền và nội dung</b> — chỉ bấm xác nhận.<br>'+
                  '<i>Mở bằng máy tính thì quét thẳng bằng điện thoại là xong.</i></div>'+
                '</details>'):'')+
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
  function applyLicense(r){
    rec=r||null;
    var now=Date.now();
    var okPaid = !!(rec && rec.daTraPhi) && (!rec.ngayHetHan || now<=rec.ngayHetHan);
    if(!okPaid){ setPaid(false, 0); return; }

    // Đã trả phí & còn hạn → kiểm tra thiết bị
    var bound=rec.device;
    if(!bound){                                   // chưa gắn máy → gắn máy này (lần đầu)
      try{ db.ref('licenses/'+user.uid+'/device').set(dev); }catch(e){}
      setPaid(true, rec.ngayHetHan||hetHanFor(rec.namHoc||curNamHoc())); return;
    }
    if(bound===dev){ setPaid(true, rec.ngayHetHan||hetHanFor(rec.namHoc||curNamHoc())); return; }

    // Máy lạ → khoá, mời đổi máy nếu còn lượt
    setPaid(false, 0);
    var used=rec.soLanDoiMay||0, left=CONFIG.SO_LAN_DOI_MAY_TOI_DA-used;
    showDeviceMismatch(left);
  }

  function showDeviceMismatch(left){
    var o=overlay('bxlic-dev');
    var body = left>0
      ? '<p style="font-size:14px;line-height:1.6">Bản quyền của thầy/cô đang gắn với <b>một thiết bị khác</b>. '+
        'Thầy/cô còn <b>'+left+'</b> lượt chuyển sang máy mới trong năm học này.</p>'+
        '<button class="bxlic-btn" onclick="BXLIC_switchDevice()">📲 Dùng bản quyền trên máy này</button>'+
        '<button class="bxlic-btn sec" onclick="BXLIC_close(\'bxlic-dev\')">Để sau</button>'
      : '<p style="font-size:14px;line-height:1.6">Bản quyền đã <b>hết lượt đổi thiết bị</b> trong năm học này. '+
        'Vui lòng liên hệ <b>'+esc(CONFIG.HOTLINE)+'</b> để được hỗ trợ chuyển máy.</p>'+
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
    db.ref().update(upd).then(function(){ closeOv('bxlic-dev'); /* listener sẽ tự mở khoá */ })
      .catch(function(){ if(window.bxAlert) bxAlert('Chưa đổi được máy (kiểm tra mạng).'); });
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
      var html='<div class="bxlic-note" style="margin:0 0 12px">Chờ xác nhận: <b>'+waiting.length+'</b> · Tổng tài khoản: <b>'+uids.length+'</b>. '+
        'Bấm <b>Kích hoạt</b> sau khi đã nhận được 99.000đ (đối chiếu Nội dung CK).</div>';
      html+='<div style="overflow:auto;max-height:60vh"><table class="bxlic-tbl"><thead><tr>'+
        '<th>Họ tên / Email</th><th>Mã CK</th><th>Trạng thái</th><th>Năm học</th><th>Hết hạn</th><th>Đổi máy</th><th>Thao tác</th></tr></thead><tbody>';
      if(!rows.length){ html+='<tr><td colspan="7" style="text-align:center;color:#889;padding:16px">Chưa có tài khoản nào yêu cầu.</td></tr>'; }
      rows.forEach(function(x){
        var r=x.r, ok=!!r.daTraPhi;
        html+='<tr>'+
          '<td><b>'+esc(r.hoTen||'—')+'</b><br><span style="color:#667;font-size:12px">'+esc(r.email||'')+'</span>'+(r.daYeuCau&&!ok?' <span style="color:#b00020">• chờ</span>':'')+'</td>'+
          '<td><code>'+esc(r.maCK||maCKof(x.uid))+'</code></td>'+
          '<td><span class="bxlic-tag '+(ok?'ok':'no')+'">'+(ok?'Đã trả':'Chưa')+'</span></td>'+
          '<td>'+esc(r.namHoc||'—')+'</td>'+
          '<td>'+fmtDate(r.ngayHetHan)+'</td>'+
          '<td>'+(r.soLanDoiMay||0)+'/'+CONFIG.SO_LAN_DOI_MAY_TOI_DA+'</td>'+
          '<td style="white-space:nowrap">'+
            '<button class="bxlic-mini" onclick="BXLIC_activate(\''+x.uid+'\')">'+(ok?'Gia hạn':'Kích hoạt')+'</button>'+
            '<button class="bxlic-mini d" onclick="BXLIC_resetDevice(\''+x.uid+'\')">Reset máy</button>'+
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
  window.BXLIC_activate=function(uid){
    var nh=curNamHoc();
    var upd={};
    upd['licenses/'+uid+'/daTraPhi']=true;
    upd['licenses/'+uid+'/namHoc']=nh;
    upd['licenses/'+uid+'/ngayHetHan']=hetHanFor(nh);
    upd['licenses/'+uid+'/soLanDoiMay']=0;
    upd['licenses/'+uid+'/daYeuCau']=false;
    upd['licenses/'+uid+'/kichHoatTs']=firebase.database.ServerValue.TIMESTAMP;
    db.ref().update(upd).then(function(){ openAdmin(); }).catch(function(e){ if(window.bxAlert) bxAlert('Lỗi kích hoạt: '+((e&&e.message)||'')); });
  };
  window.BXLIC_resetDevice=function(uid){
    var upd={}; upd['licenses/'+uid+'/device']=null; upd['licenses/'+uid+'/soLanDoiMay']=0;
    db.ref().update(upd).then(function(){ openAdmin(); }).catch(function(){});
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
     MIỄN PHÍ: link bài giảng trình chiếu, mẫu trống (Mau_*), lịch báo giảng, thời khoá biểu,
     danh sách học sinh, báo cáo thống kê, sao lưu dữ liệu cá nhân, bài giảng PPTX tự tạo… */
  var RE_CAN_PHI = /^(KHBD_|KHGD_mon_|KhoGiaoAn_)/i;
  function needPaid(fileName){
    var n = String(fileName||'').replace(/^.*[\\\/]/,'');
    return RE_CAN_PHI.test(n);
  }

  window.BXLIC = {
    canDownload: function(){ return paid===true; },
    needPaid: needPaid,                      // tệp này có đòi bản quyền không?
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
