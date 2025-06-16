document.getElementById('save').addEventListener('click', () => {
  let domainInput = document.getElementById('domain').value.trim();
  const status = document.getElementById('status');
  const error = document.getElementById('error');

  // Xóa thông báo cũ
  status.textContent = '';
  error.textContent = '';

  // Kiểm tra domain hợp lệ
  const urlPattern = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\//;
  try {
    // Phân tích URL và bỏ query parameters
    const url = new URL(domainInput);
    domainInput = `${url.protocol}//${url.hostname}/`; // Chỉ lấy protocol, hostname, và thêm dấu /
    console.log(`[Popup] Parsed domain: ${domainInput}`);
  } catch (e) {
    error.textContent = 'Invalid domain! Please enter a valid URL (e.g., https://hoathinh3d.com/).';
    return;
  }

  // Kiểm tra domain đã được chuẩn hóa
  if (!urlPattern.test(domainInput)) {
    error.textContent = 'Invalid domain! Please enter a valid URL (e.g., https://hoathinh3d.com/).';
    return;
  }

  // Lưu domain vào chrome.storage
  chrome.storage.sync.set({ hoathinh3dDomain: domainInput }, () => {
    status.textContent = 'Domain saved successfully!';
    // Xóa thông báo sau 3 giây
    setTimeout(() => {
      status.textContent = '';
    }, 3000);
  });
});

// Xử lý hiển thị QR code
const qrContainer = document.getElementById('qr-container');
const qrImage = document.getElementById('qr-image');
let isQrVisible = false;
let currentQr = null;

// Xử lý nút "Liên hệ" (Zalo QR)
document.getElementById('contact').addEventListener('click', () => {
  if (isQrVisible && currentQr === 'zalo') {
    // Nếu QR Zalo đang hiển thị, ẩn đi
    qrContainer.style.display = 'none';
    isQrVisible = false;
    currentQr = null;
  } else {
    // Hiển thị QR Zalo
    qrImage.src = 'zalo.png';
    qrContainer.style.display = 'block';
    isQrVisible = true;
    currentQr = 'zalo';
  }
});

// Xử lý nút "Donate" (Momo QR)
document.getElementById('donate').addEventListener('click', () => {
  if (isQrVisible && currentQr === 'momo') {
    // Nếu QR Momo đang hiển thị, ẩn đi
    qrContainer.style.display = 'none';
    isQrVisible = false;
    currentQr = null;
  } else {
    // Hiển thị QR Momo
    qrImage.src = 'momo.png';
    qrContainer.style.display = 'block';
    isQrVisible = true;
    currentQr = 'momo';
  }
});