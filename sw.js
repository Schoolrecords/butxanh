/* Service worker TỐI GIẢN — 16/8/2026
   Mục đích DUY NHẤT: đủ điều kiện để Chrome cho "Cài Bút Xanh" lên màn hình chính.
   ⚠️ CỐ TÌNH KHÔNG CACHE GÌ CẢ. App là một file index.html ~1 MB đang sửa gần như hàng
   tuần; cache ở đây là thầy cô ôm bản cũ mà không ai biết vì sao lỗi đã vá vẫn còn.
   Mọi yêu cầu đi thẳng ra mạng như khi không có service worker. */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){ /* không can thiệp — để trình duyệt tự tải */ });
