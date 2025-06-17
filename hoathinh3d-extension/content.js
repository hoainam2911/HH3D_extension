// Hàm kiểm tra URL có khớp với domain đã lưu không
function isValidHoatHinh3DPage(callback) {
  chrome.storage.sync.get(["hoathinh3dDomain"], (result) => {
    const savedDomain = result.hoathinh3dDomain;
    if (!savedDomain) {
      console.log("[HoatHinh3D] No domain configured. Please set a domain in the extension popup.");
      return;
    }
    const currentURL = window.location.href;
    if (currentURL.startsWith(savedDomain)) {
      console.log(`[HoatHinh3D] Running on valid domain: ${savedDomain}`);
      callback();
    } else {
      console.log(`[HoatHinh3D] Current URL (${currentURL}) does not match saved domain (${savedDomain}). Skipping...`);
    }
  });
}

// Tạo div hiển thị đáp án
function createAnswerOverlay() {
  let overlay = document.getElementById("answer-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "answer-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "10px";
    overlay.style.left = "10px";
    overlay.style.right = "10px";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.color = "#fff";
    overlay.style.padding = "10px";
    overlay.style.zIndex = "9999";
    overlay.style.borderRadius = "5px";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.fontSize = "14px";
    overlay.style.maxHeight = "150px";
    overlay.style.overflowY = "auto";
    overlay.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
    document.body.appendChild(overlay);
  }
  return overlay;
}

// Cập nhật nội dung div hiển thị đáp án
function updateAnswerOverlay(question, answer, status) {
  const overlay = createAnswerOverlay();
  let content = `<strong>Câu hỏi:</strong> ${question}<br>`;
  if (answer) {
    content += `<strong>Đáp án:</strong> ${answer}<br>`;
  } else {
    content += `<strong>Đáp án:</strong> Không tìm thấy<br>`;
  }
  content += `<strong>Trạng thái:</strong> ${status}`;
  overlay.innerHTML = content;
}

// Tạo overlay hiển thị trạng thái Hoang Vực
function createHoangVucOverlay() {
  let overlay = document.getElementById("hoang-vuc-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "hoang-vuc-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "10px";
    overlay.style.right = "10px";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    overlay.style.color = "#fff";
    overlay.style.padding = "15px";
    overlay.style.zIndex = "9999";
    overlay.style.borderRadius = "8px";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.fontSize = "13px";
    overlay.style.minWidth = "250px";
    overlay.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
    overlay.style.border = "2px solid #4facfe";
    document.body.appendChild(overlay);
  }
  return overlay;
}

// Cập nhật nội dung overlay Hoang Vực
function updateHoangVucOverlay(content) {
  const overlay = createHoangVucOverlay();
  overlay.innerHTML = `
    <div style="text-align: center; margin-bottom: 10px;">
      <strong style="color: #4facfe;">⚔️ HOANG VỰC AUTO ⚔️</strong>
    </div>
    ${content}
  `;
}

// Tạo overlay hiển thị trạng thái Khoáng Mạch
function createKhoangMachOverlay() {
  let overlay = document.getElementById("khoang-mach-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "khoang-mach-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "10px";
    overlay.style.right = "10px";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    overlay.style.color = "#fff";
    overlay.style.padding = "15px";
    overlay.style.zIndex = "9999";
    overlay.style.borderRadius = "8px";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.fontSize = "13px";
    overlay.style.minWidth = "280px";
    overlay.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
    overlay.style.border = "2px solid #ffd700";
    document.body.appendChild(overlay);
  }
  return overlay;
}

// Cập nhật nội dung overlay Khoáng Mạch
function updateKhoangMachOverlay(content) {
  const overlay = createKhoangMachOverlay();
  overlay.innerHTML = `
    <div style="text-align: center; margin-bottom: 10px;">
      <strong style="color: #ffd700;">⛏️ KHOÁNG MẠCH AUTO ⛏️</strong>
    </div>
    ${content}
  `;
}

// Danh sách câu hỏi và đáp án
const questionAnswers = {
  "Trong 2 Admin của website HoatHinh3D là ai ? (Biệt danh chính xác ở web)": "Từ Dương",
  "Ai là huynh đệ và cũng là người thầy mà Vương Lâm trong Tiên Nghịch kính trọng nhất ?": "Tư Đồ Nam",
  "Ai là mẹ của Đường Tam?": "A Ngân",
  "Ai là người đứng đầu Vũ Hồn Điện?": "Bỉ Bỉ Đông",
  "Ai là nhân vật chính trong bộ phim hoạt hình trung quốc Thần Mộ ?": "Thần Nam",
  "Bách Lý Đông Quân là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Thiếu Niên Bạch Mã Tuý Xuân Phong",
  "Bạch Nguyệt Khôi là tên nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Linh Lung",
  "Bạch Tiểu Thuần là nhân vật chính trong bộ hoạt hình trung quốc nào ?": "Nhất Niệm Vĩnh Hằng",
  "Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng luôn được ai âm thầm giúp đỡ ?": "Đỗ Lăng Phỉ",
  "Bộ phim nào sau đây thuộc tiểu thuyết của tác giả Thiên Tằm Thổ Đậu": "Tất cả đáp án trên",
  "Các cấp bậc nào sau đây thuộc phim Đấu Phá Thương Khung ?": "Đấu Tông",
  "Cháu dượng của Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng là ai ?": "Tống Khuyết",
  "Chủ nhân đời trước của Vẫn Lạc Tâm Viêm trong Đấu Phá Thương Khung là ai ?": "Diệu Thiên Hỏa",
  "Công pháp gì giúp Tiêu Viêm trong Đấu Phá Thương Khung hấp thụ nhiều loại dị hỏa ?": "Phần Quyết",
  "Công pháp nào sau đây là của Hàn Lập trong Phàm Nhân Tu Tiên ?": "Tất cả đáp án trên",
  "Cơ Tử Nguyệt là nhân vật trong các bộ hoạt hình trung quốc nào sau đây ?": "Già Thiên",
  "Dạ Táng còn là biệt danh của ai trong Nhất Niệm Vĩnh Hằng ?": "Bạch Tiểu Thuần",
  "Danh xưng Tàn Thi Bại Thuế là của nhân vật nào trong Hoạ Giang Hồ Chi Bất Lương Nhân ?": "Hàng Thần",
  "Diễm Linh Cơ là nhân vật trong phim hoạt hình trung quốc nào ?": "Thiên Hành Cửu Ca",
  "Diệp Phàm là nhân vật chính trong bộ hoạt hình trung quốc nào ?": "Già Thiên",
  "Diệp Thần trong Tiên Võ Đế Tôn gia nhập Tông Môn nào đầu tiên ?": "Chính Dương Tông",
  "Dược Trần trong Đấu Phá Thương Khung đã từng bị đồ đệ nào phản bội ?": "Hàn Phong",
  "Đại ca của Tiêu Viêm trong Đấu Phá Thương Khung tên gì ?": "Tiêu Đỉnh",
  "Đàm Vân là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Nghịch Thiên Chí Tôn",
  "Đạo lữ của Hàn Lập là ai ?": "Nam Cung Uyển",
  "Đâu là nhân vật chính trong phim Bách Luyện Thành Thần ?": "La Chinh",
  "Đâu là Thái Cổ Thập Hung trong phim Thế Giới Hoàn Mỹ ?": "Tất cả đáp án trên",
  "Đâu là tuyệt kỹ số 1 Hạo Thiên Tông mà Đường Hạo dạy cho con trai trong Đấu La Đại Lục ?": "Đại Tu Di Chùy",
  "Đấu Sát Toàn Viên Kiếm là một kỹ năng trong bộ phim hoạt hình trung quốc nào ?": "Thần Ấn Vương Toạ",
  "Độc Cô Bác trong Đấu La Đại Lục có vũ hồn gì ?": "Bích Lân Xà",
  "Em trai ruột của Thạch Hạo trong Thế Giới Hoàn Mỹ là ai ?": "Tần Hạo",
  "Hàn Lập sở hữu những vật phẩm nào dưới đây ?": "Thanh Trúc Phong Vân Kiếm",
  "Hàn Lập trong Phàm Nhân Tu Tiên đến Thất Huyền Môn bái ai làm thầy ?": "Mặc Đại Phu",
  "Hàn Lâp trong Phàm Nhân Tu Tiên gia nhập môn phái nào đầu tiên ?": "Thất Huyền Môn",
  "Hàn Lập trong Phàm Nhân Tu Tiên từng cứu ai mà bị hấp thụ tu vi giảm xuống Luyện Khí Kỳ ?": "Nam Cung Uyển",
  "Hoang Thiên Đế là nhân vật chính trong bộ phim hoạt hình trung quốc nổi tiếng nào ?": "Thế Giới Hoàn Mỹ",
  "Hoắc Vũ Hạo là hậu nhân của ai trong Sử Lai Khắc ?": "Đái Mộc Bạch",
  "Hồn hoàn màu nào mạnh nhất?": "Đỏ",
  "Huân Nhi là công chúa của bộ tộc nào?": "Cổ Tộc",
  "Khi ở Già Nam Học Viện, Tiêu Viêm thu phục được loại dị hỏa nào ?": "Vẫn Lạc Tâm Viêm",
  "Kính Huyền trong Quyến Tư Lượng là hậu duệ của tộc nào ?": "Thần Tộc",
  "Lạc Ly trong Đại Chúa Tể là nhân vật trong Tộc nào ?": "Lạc Thần Tộc",
  "Lâm Động trong Vũ Động Càn Khôn học được Linh Võ Học nào khi vào bia cổ Đại Hoang ?": "Đại Hoang Tù Thiên Chỉ",
  "Lâm Động trong Vũ Động Càn Khôn luyện hóa Tổ Phù nào đầu tiên ?": "Thôn Phệ Tổ Phù",
  "Lâm Động trong Vũ Động Càn Khôn sử dụng vũ khí loại nào sau đây ?": "Thương",
  "Lâm Phong là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Vạn Giới Độc Tôn",
  "Lâm Thất Dạ là nhân vật trong bộ phim hoạt hình trung quốc nào sau đây ?": "Trảm Thần",
  "Lâm Thất Dạ trong Trảm Thần sở hữu sức mạnh của vị thần nào ?": "Thiên Sứ",
  "Long Tuyền Kiếm xuất hiện trong bộ phim hoạt hình nào dưới đây ?": "Họa Giang Hồ Chi Bất Lương Nhân",
  "Lục Tuyết Kỳ trong Tru Tiên thuộc Phong nào trong Thanh Vân Môn?": "Tiểu Trúc Phong",
  "Lý Tinh Vân trong Họa Giang Hồ Chi Bất Lương Nhân sử dụng vũ khí nào sau đây ?": "Long Tuyền Kiếm",
  "Lý Trường Thọ trong Sư Huynh A Sư Huynh xuyên không về Hồng Hoang bái sư ở đâu ?": "Độ Tiên Môn",
  "Man Hồ Tử trong phim 'Phàm Nhân Tu Tiên' tu luyện công pháp nào?": "Thác Thiên Ma Công",
  "Mẫu thân của La Phong trong Thôn Phệ Tinh Không tên là gì ?": "Cung Tâm Lan",
  "Mẹ của Mạnh Xuyên trong Thương Nguyên Đồ tên là gì ?": "Bạch Niệm Vân",
  "Mẹ của Tần Trần là ai ?": "Tần Nguyệt Trì",
  "Mẹ của Thạch Hạo trong Thế Giới Hoàn Mỹ tên là gì": "Tần Di Ninh",
  "Mối tình đầu của Diệp Thần trong Tiên Võ Đế Tôn là ai ?": "Cơ Ngưng Sương",
  "Mục đích tu luyện của Vương Lâm trong Tiên Nghịch theo diễn biến phim hiện tại là gì ?": "Báo Thù",
  "Mục Trần trong Đại Chúa Tể liên kết Huyết Mạch với ?": "Cửu U Tước",
  "Mục Vân là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Vô Thượng Thần Đế",
  "Nam chính trong bộ hoạt hình trung quốc Ám Hà Truyện là ai ?": "Tô Mộ Vũ",
  "Nam chính trong bộ Quyến Tư Lượng là ai ?": "Kính Huyền",
  "Nghịch Hà Tông là Tông Môn trong bộ hoạt hình trung quốc nào sau đây ?": "Nhất Niệm Vĩnh Hằng",
  "Nghịch Thiên Nhi Hành là một nhân vật trong bộ phim hh3d nào sau đây ?": "Vũ Canh Kỷ",
  "Ngụy Anh (Ngụy Vô Tiện) là nhân vật trong bộ hhtq nào sau đây ?": "Ma Đạo Tổ Sư",
  "Người bạn thuở nhỏ của Trương Tiểu Phàm trong Tru Tiên là ai ?": "Lâm Kinh Vũ",
  "Nhân vật Bách Lý Đồ Minh xuất hiện trong phim hoạt hình nào dưới đây ?": "Trảm Thần Chi Phàm Trần Thần Vực",
  "Nhân vật chính của 'Thần Ấn Vương Tọa' là ai?": "Long Hạo Thần",
  "Nhân vật chính của Đấu La Đại Lục là ai?": "Đường Tam",
  "Nhân vật chính Lý Trường Thọ trong Sư Huynh A Sư Huynh đã tỏ tình với ai ?": "Vân Tiêu",
  "Nhân vật chính trong Thương Nguyên đồ là ai ?": "Mạnh Xuyên",
  "Nhân vật chính trong Yêu Thần Ký tên là gì ?": "Nhiếp Ly",
  "Nhân vật nào luôn bất bại trong phim Hoạt Hình Trung Quốc, được ví như One-Punch Man ?": "Từ Dương",
  "Nhân vật nào sau đây được mệnh danh là Vua Lỳ Đòn trong Đấu Phá Thương Khung ?": "Phượng Thanh Nhi",
  "Nhị ca của Tiêu Viêm trong Đấu Phá Thương Khung tên gì ?": "Tiêu Lệ",
  "Nhiếp Phong là nhân vật chính trong phim hoạt hình trung quốc nào ?": "Chân Võ Đỉnh Phong",
  "Ninh Diêu là một nhân vật trong bộ phim hoạt hình trung quốc nào sau đây ?": "Kiếm Lai",
  "Nữ chính cũng là vợ Đông Bá Tuyết Ưng trong Tuyết Ưng Lĩnh Chủ là ai sau đây ?": "Dư Tĩnh Thu",
  "Nữ chính trong bộ Quyến Tư Lượng là ai ?": "Đồ Lệ",
  "Ông nội của Lâm Động trong Vũ Động Càn Khôn là ai ?": "Lâm Chấn Thiên",
  "Phụ Thân của Lâm Động trong Vũ Động Càn Khôn là ai ?": "Lâm Khiếu",
  "Phương Hàn là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Vĩnh Sinh",
  "Phương Hàn trong Vĩnh Sinh nhận được Giao Phục Hoàng Tuyền Đồ từ ai ?": "Bạch Hải Thiện",
  "Phương Hàn trong Vĩnh Sinh xuất thân là gì ở nhà họ Phương ?": "Nô Bộc",
  "Phượng Thanh Nhi trong Đấu Phá Thương Khung thuộc chủng tộc nào ?": "Thiên Yêu Hoàng Tộc",
  "Số hiệu vị thần của main trong Trảm Thần: Phàm Trần Thần Vực là số mấy ?": "003",
  "Sử Lai Khắc Thất Quái đã từng đến nơi nào để luyện tập?": "Hải Thần Đảo",
  "Sư mẫu của Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng là ai ?": "Hứa Mị Nương",
  "Sư phụ của Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng là ai ?": "Lý Thanh Hậu",
  "Sư phụ của Lý Trường Thọ là ai ?": "Tề Nguyên",
  "Sư phụ mà Diệp Thần yêu trong Tiên Võ Đế Tôn là ai ?": "Sở Huyên Nhi",
  "Sư Phụ thứ 2 của Lý Trường Thọ trong phim": "Thái Thanh Thánh Nhân",
  "Tại sao Đường Tam bị Đường Môn truy sát ở tập đầu phim Đấu La Đại Lục ?": "Học trộm tuyệt học bổn môn",
  "Tần Vũ trong Tinh Thần Biến được tặng pháp bảo siêu cấp vip pro nào để tu luyện nhanh chóng ?": "Khương Lan Tháp",
  "Tần Vũ trong Tinh Thần Biến khiếm khuyết đan điền nhờ đâu mới có thể tu luyện ?": "Lưu Tinh Lệ",
  "Thánh nữ nào trong Già Thiên bị nhân vật chính Diệp Phàm lấy mất cái áo lót ?": "Diêu Hi",
  "Thần Thông Bí Cảnh xuất hiện trong bộ phim hoạt hình nào dưới đây ?": "Vĩnh Sinh",
  "Thần vị mà Đường Tam đạt được là gì?": "Hải Thần và Tu La Thần",
  "Thế lực nào là đối thủ lớn nhất của Tiêu Viêm trong Đấu Phá Thương Khung?": "Hồn Điện",
  "Thú cưng Thôn Thôn trong Nguyên Tôn sinh ra có sức mạnh ngang cảnh giới nào ?": "Thái Sơ Cảnh",
  "Tiêu Khinh Tuyết xuất hiện trong bộ hoạt hình nào dưới đây ?": "Tuyệt Thế Chiến Hồn",
  "Tiêu Viêm đã lập nên thế lực nào khi ở Học Viện Già Nam ?": "Bàn Môn",
  "Tiêu Viêm trong Đấu Phá Thương Khung đã Hẹn Ước 3 Năm với ai ?": "Nạp Lan Yên Nhiên",
  "Tiêu Viêm trong Đấu Phá Thương Khung sử dụng loại vũ khí nào sau đây ?": "Thước",
  "Tiêu Viêm trong Đấu Phá Thương Khung thuộc gia tộc nào?": "Tiêu Gia",
  "Tình đầu của Diệp Phàm trong Già Thiên là ai ?": "Lý Tiểu Mạn",
  "Trần Bình An là nam chính trong bộ phim hoạt hình trung quốc nào ?": "Kiếm Lai",
  "Triệu Ngọc Chân là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Thiếu Niên Bạch Mã Túy Xuân Phong",
  "Trong bộ Đấu Phá Thương Khung, Tiêu Viêm tìm đến ai để cứu Dược Lão ?": "Phong Tôn Giả",
  "Trong bộ Tiên Nghịch, nhân vật chính Vương Lâm khi ở quê nhà còn có tên khác là gì ?": "Thiết Trụ",
  "Trong Đấu La Đại Lục, Đường Hạo là gì của Đường Tam?": "Cha",
  "Trong Già Thiên, thể chất Diệp Phàm là thể chất gì ?": "Hoang Cổ Thánh Thể",
  "Trong Phàm Nhân Tu Tiên ai bị luyện thành khôi lỗi Khúc Hồn ?": "Trương Thiết",
  "Trong phim Tiên Nghịch, Vương Lâm vô tình có được pháp bảo nghịch thiên nào ?": "Thiên Nghịch Châu",
  "Trong Tiên Nghịch, Vương Lâm nhận được truyền thừa gì ở Cổ Thần Chi Địa ?": "Ký Ức",
  "Trong Tru Tiên, Điền Bất Dịch là thủ tọa của Phong nào?": "Đại Trúc Phong",
  "Trong Vĩnh Sinh - Phương Hàn hẹn ước 10 năm cùng với ai ?": "Hoa Thiên Đô",
  "Trước khi đến Linh Khê Tông, Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng ở đâu ?": "Mạo Nhi Sơn Thôn",
  "Trương Tiểu Phàm trong phim Tru Tiên còn có tên gọi là ?": "Quỷ Lệ",
  "Trương Tiểu Phàm trong Tru Tiên từng được nhận vào môn phái nào?": "Thanh Vân Môn",
  "Tử Nghiên trong Đấu Phá Thương Khung thuộc chủng tộc nào ?": "Thái Hư Cổ Long",
  "Vân Triệt là tên nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Nghịch Thiên Tà Thần",
  "Vũ Canh là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Vũ Canh Kỷ",
  "Vũ hồn của Chu Trúc Thanh là gì?": "U Minh Linh Miêu",
  "Vũ hồn của Đới Mộc Bạch là gì?": "Bạch Hổ",
  "Vũ hồn của Mã Hồng Tuấn là gì?": "Hỏa Phượng Hoàng",
  "Vũ hồn của Tiểu Vũ là gì?": "Nhu Cốt Thỏ",
  "Vũ hồn thứ hai của Đường Tam là gì?": "Hạo Thiên Chùy",
  "Vũ khí của Đàm Vân trong Nghịch Thiên Chí Tôn là gì ?": "Hồng Mông Thần Kiếm",
  "Vũ khí mà Tiêu Viêm trong Đấu Phá Thương Khung luôn mang bên mình có tên gọi là gì ?": "Huyền Trọng Xích",
  "Vương Lâm trong phim Tiên Nghịch dựa vào gì để vô địch cùng cảnh giới ?": "Cực Cảnh",
  "Y Lai Khắc Tư là một nhân vật trong bộ phim hoạt hình trung quốc nào sau đây ?": "Cả 1 và 2",
  "Ai là người thầy của Đường Tam?": "Đại Sư",
  "Thiên Hoả Tôn Giả trong Đấu Phá Thương Khung dùng thi thể của ai để hồi sinh ?": "Vân Sơn",
  "Ám tinh giới được xuất hiện trong bộ phim hoạt hình nào dưới đây ?": "Tinh Thần Biến",
  "Tỉnh Cửu là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Đại Đạo Triều Thiên",
  "Lý Tinh Vân là một nhân vật trong bộ phim hoạt hình trung quốc nào sau đây ?": "Họa Giang Hồ Chi Bất Lương Nhân",
  "Tần Mục là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Mục Thần Ký",
  "Tiêu Thần là nhân vật chính trong bộ phim hoạt hình Trung Quốc nào sau đây ?": "Trường Sinh Giới",
  "Tần Nam là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Tuyệt Thế Chiến Hồn",
  "Mục đích chính tu luyện của Tần Vũ trong Tinh Thần Biến là gì ??": "Vì muốn được cưới Khương Lập",
  "Khô Lâu Đà Chủ xuất hiện trong bộ phim hoạt hình nào dưới đây ?": "Võ Thần Chúa Tể",
  "Nhân vật chính trong Man Hoang Tiên Giới là ai ?": "Lục Hàng Chi",
  "Nhân vật chính trong Quân Tử Vô Tật là ai?": "Dao Cơ",
  "Nhân vật chính trong Đấu Chiến Thiên Hạ là ai?": "Đại Phong",
  "Nhân vật chính trong Ta Có Thể Giác Ngộ Vô Hạn là ai?": "Tiêu Vân",
  "Tại sao Hàn Lập khi gặp Phong Hi không chạy mà ở lại giúp đỡ chế tạo Phong Lôi Sí ?": "Vì đánh không lại",
};

// Kiểm tra trạng thái damage cho Hoang Vực
function checkDamageStatus() {
  const damageInfo = document.querySelector(".damage-info");
  if (!damageInfo) {
    return "unknown";
  }

  // Kiểm tra nếu bị ẩn (không buff/debuff)
  if (damageInfo.style.display === "none") {
    return "neutral";
  }

  // Kiểm tra có class increase-damage (tăng 15%)
  if (damageInfo.querySelector(".increase-damage")) {
    return "buff";
  }

  // Kiểm tra có class decrease-damage (giảm 15%)
  if (damageInfo.querySelector(".decrease-damage")) {
    return "debuff";
  }

  return "unknown";
}

// Lấy tên trạng thái damage
function getDamageStatusText(status) {
  switch (status) {
    case "buff":
      return "🔥 Tăng 15% Sát Thương";
    case "neutral":
      return "⚖️ Không Buff/Debuff";
    case "debuff":
      return "❄️ Giảm 15% Sát Thương";
    default:
      return "❓ Không Xác Định";
  }
}

// Reset linh căn
async function resetElement() {
  return new Promise((resolve) => {
    const resetButton = document.querySelector("#change-element-button");
    if (!resetButton) {
      console.log("[HoangVuc] Không tìm thấy nút reset linh căn");
      resolve(false);
      return;
    }

    updateHoangVucOverlay(`
      <div>📊 Trạng thái: ${getDamageStatusText(checkDamageStatus())}</div>
      <div style="margin-top: 8px;">🔄 Đang reset linh căn...</div>
    `);

    resetButton.click();

    // Đợi popup xuất hiện và nhấn xác nhận
    setTimeout(() => {
      const confirmButton = document.querySelector(".swal2-confirm");
      if (confirmButton) {
        confirmButton.click();

        // Đợi reset hoàn tất
        setTimeout(() => {
          resolve(true);
        }, 2000);
      } else {
        console.log("[HoangVuc] Không tìm thấy nút xác nhận");
        resolve(false);
      }
    }, 1000);
  });
}

// Kiểm tra xem có cần reset không
function shouldReset(strategy, currentStatus) {
  switch (strategy) {
    case "none":
      return false;
    case "avoid":
      return currentStatus === "debuff";
    case "buff":
      return currentStatus !== "buff";
    default:
      return false;
  }
}

// Bắt đầu đánh boss
async function startBattle() {
  updateHoangVucOverlay(`
    <div>📊 Trạng thái: ${getDamageStatusText(checkDamageStatus())}</div>
    <div style="margin-top: 8px;">⚔️ Bắt đầu khiêu chiến...</div>
  `);

  const battleButton = document.querySelector("#battle-button");
  if (battleButton) {
    battleButton.click();

    // Đợi và nhấn tấn công
    setTimeout(() => {
      const attackButton = document.querySelector(".attack-button");
      if (attackButton) {
        attackButton.click();
        updateHoangVucOverlay(`
          <div>📊 Trạng thái: ${getDamageStatusText(checkDamageStatus())}</div>
          <div style="margin-top: 8px;">⚔️ Đã bắt đầu tấn công!</div>
          <div style="margin-top: 5px; color: #4ade80;">✅ Hoàn thành!</div>
        `);
      }
    }, 2000);
  }
}

// Lấy tên chiến thuật
function getStrategyText(strategy) {
  switch (strategy) {
    case "none":
      return "🚫 Không Reset";
    case "avoid":
      return "🛡️ Tránh Debuff";
    case "buff":
      return "⚡ Tìm Buff";
    default:
      return "❓ Không Xác Định";
  }
}

// Chức năng chính Hoang Vực
async function hoangVuc() {
  await sleep(1000);

  // Lấy chiến thuật đã chọn, nếu chưa có thì hiển thị popup chọn
  chrome.storage.sync.get(["hoangVucStrategy"], async (result) => {
    const strategy = result.hoangVucStrategy;

    // Nếu chưa có strategy hoặc strategy không hợp lệ, hiển thị popup chọn
    if (!strategy || !["none", "avoid", "buff"].includes(strategy)) {
      updateHoangVucOverlay(`
        <div>🎯 Chưa chọn chiến thuật</div>
        <div style="margin-top: 8px;">📋 Vui lòng chọn chiến thuật từ popup extension</div>
      `);
      return;
    }

    let resetCount = 0;
    const maxResets = 20; // Giới hạn số lần reset để tránh vòng lặp vô hạn

    updateHoangVucOverlay(`
      <div>🎯 Chiến thuật: ${getStrategyText(strategy)}</div>
      <div style="margin-top: 8px;">📊 Đang kiểm tra trạng thái...</div>
    `);

    // Vòng lặp reset linh căn
    while (resetCount < maxResets) {
      const currentStatus = checkDamageStatus();

      updateHoangVucOverlay(`
        <div>🎯 Chiến thuật: ${getStrategyText(strategy)}</div>
        <div style="margin-top: 8px;">📊 Trạng thái: ${getDamageStatusText(currentStatus)}</div>
        <div style="margin-top: 5px;">🔄 Lần reset: ${resetCount}</div>
      `);

      if (!shouldReset(strategy, currentStatus)) {
        updateHoangVucOverlay(`
          <div>🎯 Chiến thuật: ${getStrategyText(strategy)}</div>
          <div style="margin-top: 8px;">📊 Trạng thái: ${getDamageStatusText(currentStatus)}</div>
          <div style="margin-top: 5px; color: #4ade80;">✅ Đã đạt yêu cầu!</div>
        `);
        break;
      }

      const resetSuccess = await resetElement();
      if (!resetSuccess) {
        updateHoangVucOverlay(`
          <div>🎯 Chiến thuật: ${getStrategyText(strategy)}</div>
          <div style="margin-top: 8px;">❌ Reset thất bại!</div>
        `);
        break;
      }

      resetCount++;
      await sleep(3000); // Đợi giữa các lần reset
    }

    if (resetCount >= maxResets) {
      updateHoangVucOverlay(`
        <div>🎯 Chiến thuật: ${getStrategyText(strategy)}</div>
        <div style="margin-top: 8px;">⚠️ Đã đạt giới hạn reset!</div>
        <div style="margin-top: 5px;">📊 Trạng thái: ${getDamageStatusText(checkDamageStatus())}</div>
      `);
    }

    // Bắt đầu đánh boss sau 2 giây
    setTimeout(() => {
      startBattle();
    }, 2000);
  });
}

// Thay thế toàn bộ chức năng khoangMach() bằng logic mới
// Thay thế toàn bộ chức năng khoangMach() bằng logic mới với debug logs
async function khoangMach() {
  console.log("[KhoangMach] 🚀 Bắt đầu chức năng Khoáng Mạch");
  await sleep(1000);

  // Danh sách ID mỏ theo loại
  const goldMines = [51, 52, 53, 54, 55, 56, 64, 73]; // Mỏ Thượng
  const silverMines = [
    70, 32, 47, 35, 59, 67, 66, 44, 31, 46, 50, 42, 68, 37, 43, 74, 75, 65, 49, 72, 48, 39, 33, 40, 38, 36, 58, 34, 60,
    57, 45, 41, 71, 62, 69, 61,
  ]; // Mỏ Trung

  console.log("[KhoangMach] 📋 Danh sách mỏ Thượng:", goldMines);
  console.log("[KhoangMach] 📋 Danh sách mỏ Trung:", silverMines);

  chrome.storage.sync.get(["khoangMachSelectedId"], async (result) => {
    const selectedId = result.khoangMachSelectedId;
    console.log("[KhoangMach] 🎯 ID mỏ đã chọn:", selectedId);

    if (!selectedId) {
      console.log("[KhoangMach] ❌ Chưa chọn ID mỏ");
      updateKhoangMachOverlay(`
        <div>🎯 Chưa chọn ID mỏ</div>
        <div style="margin-top: 8px;">📋 Vui lòng chọn ID mỏ từ popup extension</div>
      `);
      return;
    }

    // Xác định loại mỏ dựa trên ID
    let mineType = "";
    let mineTypeName = "";
    const selectedIdNum = Number.parseInt(selectedId);
    console.log("[KhoangMach] 🔢 ID mỏ dạng số:", selectedIdNum);

    if (goldMines.includes(selectedIdNum)) {
      mineType = "gold";
      mineTypeName = "Thượng";
      console.log("[KhoangMach] ✅ Xác định loại mỏ: THƯỢNG");
    } else if (silverMines.includes(selectedIdNum)) {
      mineType = "silver";
      mineTypeName = "Trung";
      console.log("[KhoangMach] ✅ Xác định loại mỏ: TRUNG");
    } else {
      console.log("[KhoangMach] ❌ ID mỏ không hợp lệ:", selectedId);
      updateKhoangMachOverlay(`
        <div>❌ ID mỏ không hợp lệ: ${selectedId}</div>
        <div style="margin-top: 8px;">📋 Vui lòng chọn ID mỏ hợp lệ từ popup extension</div>
      `);
      return;
    }

    console.log("[KhoangMach] 📊 Thông tin mỏ:");
    console.log("  - ID:", selectedId);
    console.log("  - Loại:", mineTypeName);
    console.log("  - Data-mine-type:", mineType);

    updateKhoangMachOverlay(`
      <div>⛏️ Loại mỏ: ${mineTypeName}</div>
      <div>🎯 ID mỏ: ${selectedId}</div>
      <div style="margin-top: 8px;">📋 Đang tải trang...</div>
    `);

    // Debug: Kiểm tra trang hiện tại
    console.log("[KhoangMach] 🌐 URL hiện tại:", window.location.href);
    console.log("[KhoangMach] 📄 Document ready state:", document.readyState);

    // Nhấn nút loại mỏ trước
    setTimeout(() => {
      console.log("[KhoangMach] 🔍 Bắt đầu tìm nút loại mỏ...");

      // Thử nhiều selector khác nhau
      const selectors = [
        `button.mine-type-button[data-mine-type="${mineType}"]`,
        `button[data-mine-type="${mineType}"]`,
        `.mine-type-button[data-mine-type="${mineType}"]`,
        `[data-mine-type="${mineType}"]`,
      ];

      let mineTypeButton = null;
      let usedSelector = "";

      for (const selector of selectors) {
        console.log("[KhoangMach] 🔍 Thử selector:", selector);
        mineTypeButton = document.querySelector(selector);
        if (mineTypeButton) {
          usedSelector = selector;
          console.log("[KhoangMach] ✅ Tìm thấy nút với selector:", selector);
          break;
        } else {
          console.log("[KhoangMach] ❌ Không tìm thấy với selector:", selector);
        }
      }

      // Debug: Liệt kê tất cả nút có class mine-type-button
      const allMineTypeButtons = document.querySelectorAll(
        "button.mine-type-button, .mine-type-button, [class*='mine-type'], [class*='mine'], [data-mine-type]",
      );
      console.log(`[KhoangMach] 📋 Tìm thấy ${allMineTypeButtons.length} nút có liên quan đến mine:`);
      allMineTypeButtons.forEach((btn, index) => {
        const classes = btn.className;
        const dataType = btn.getAttribute("data-mine-type");
        const id = btn.id;
        const text = btn.textContent.trim();
        console.log(`  ${index + 1}. Classes: "${classes}", Data-type: "${dataType}", ID: "${id}", Text: "${text}"`);
      });

      // Debug: Liệt kê tất cả button trên trang
      const allButtons = document.querySelectorAll("button");
      console.log(`[KhoangMach] 🔘 Tổng số button trên trang: ${allButtons.length}`);
      allButtons.forEach((btn, index) => {
        if (
          btn.textContent.includes("Thượng") ||
          btn.textContent.includes("Trung") ||
          btn.textContent.includes("gold") ||
          btn.textContent.includes("silver")
        ) {
          console.log(
            `  Button ${index + 1}: "${btn.textContent.trim()}" - Classes: "${btn.className}" - Data: ${JSON.stringify(
              btn.dataset,
            )}`,
          );
        }
      });

      if (mineTypeButton) {
        console.log("[KhoangMach] ✅ Tìm thấy nút loại mỏ:", mineTypeButton);
        console.log("[KhoangMach] 📊 Thông tin nút:");
        console.log("  - Tag:", mineTypeButton.tagName);
        console.log("  - Classes:", mineTypeButton.className);
        console.log("  - ID:", mineTypeButton.id);
        console.log("  - Text:", mineTypeButton.textContent.trim());
        console.log("  - Data-mine-type:", mineTypeButton.getAttribute("data-mine-type"));
        console.log("  - Disabled:", mineTypeButton.disabled);
        console.log("  - Style display:", mineTypeButton.style.display);
        console.log("  - Offset width:", mineTypeButton.offsetWidth);
        console.log("  - Offset height:", mineTypeButton.offsetHeight);

        console.log("[KhoangMach] 🖱️ Chuẩn bị nhấn nút loại mỏ...");

        try {
          mineTypeButton.click();
          console.log(`[KhoangMach] ✅ Đã nhấn nút loại mỏ ${mineTypeName} thành công!`);

          updateKhoangMachOverlay(`
            <div>⛏️ Loại mỏ: ${mineTypeName}</div>
            <div>🎯 ID mỏ: ${selectedId}</div>
            <div style="margin-top: 8px;">✅ Đã chọn loại mỏ</div>
            <div style="margin-top: 5px;">📋 Đang tải danh sách mỏ...</div>
          `);

          // Đợi danh sách mỏ load rồi bắt đầu auto vào mỏ
          setTimeout(() => {
            console.log("[KhoangMach] ⏰ Bắt đầu tìm mỏ sau khi chờ 4 giây...");
            startAutoMiningById(selectedId, mineTypeName);
          }, 4000); // Tăng thời gian chờ lên 4 giây
        } catch (error) {
          console.error("[KhoangMach] ❌ Lỗi khi nhấn nút loại mỏ:", error);
          updateKhoangMachOverlay(`
            <div>⛏️ Loại mỏ: ${mineTypeName}</div>
            <div>🎯 ID mỏ: ${selectedId}</div>
            <div style="margin-top: 8px; color: #f56565;">❌ Lỗi khi nhấn nút loại mỏ!</div>
          `);
        }
      } else {
        console.log("[KhoangMach] ❌ Không tìm thấy nút loại mỏ nào!");
        updateKhoangMachOverlay(`
          <div>⛏️ Loại mỏ: ${mineTypeName}</div>
          <div>🎯 ID mỏ: ${selectedId}</div>
          <div style="margin-top: 8px; color: #f56565;">❌ Không tìm thấy nút loại mỏ!</div>
        `);
      }
    }, 2000); // Chờ 2 giây để trang load
  });
}

// Thay thế function startAutoMiningById với debug logs chi tiết
let isEntering = false;
function startAutoMiningById(mineId, mineTypeName) {
  console.log("[KhoangMach] 🎯 Bắt đầu tìm mỏ ID:", mineId);

  let attemptCount = 0;

  updateKhoangMachOverlay(`
    <div>⛏️ Loại mỏ: ${mineTypeName}</div>
    <div>🎯 ID mỏ: ${mineId}</div>
    <div style="margin-top: 8px;">🔄 Đang thử vào mỏ...</div>
    <div>📊 Lần thử: ${attemptCount}</div>
  `);

  const tryEnterMine = () => {
    if (isEntering) {
      console.log(`[KhoangMach] ⏸️ Đang xử lý, bỏ qua lần thử này`);
      return; // Tránh spam khi đang xử lý
    }

    // Check if interval should be cleared (user already in mine)
    let leaveButton =
      document.querySelector(`button.leave-mine[data-mine-id="${mineId}"]`) ||
      document.querySelector(`[data-mine-id="${mineId}"] button.leave-mine`);
    if (leaveButton) {
      console.log("[KhoangMach] 🛑 Phát hiện đã ở trong mỏ, dừng spam interval");
      if (window.khoangMachSpamInterval) {
        clearInterval(window.khoangMachSpamInterval);
        window.khoangMachSpamInterval = null;
      }
      return;
    }

    attemptCount++;
    console.log(`[KhoangMach] 🔄 === LẦN THỬ ${attemptCount} ===`);
    console.log(`[KhoangMach] 🎯 Tìm mỏ ID: ${mineId}`);

    updateKhoangMachOverlay(`
      <div>⛏️ Loại mỏ: ${mineTypeName}</div>
      <div>🎯 ID mỏ: ${mineId}</div>
      <div style="margin-top: 8px;">🔄 Đang thử vào mỏ...</div>
      <div>📊 Lần thử: ${attemptCount}</div>
    `);

    // Debug: Kiểm tra DOM hiện tại
    console.log("[KhoangMach] 🔍 Kiểm tra DOM hiện tại...");

    // Tìm tất cả element có data-mine-id
    const allMineElements = document.querySelectorAll("[data-mine-id]");
    console.log(`[KhoangMach] 📋 Tìm thấy ${allMineElements.length} element có data-mine-id:`);
    allMineElements.forEach((el, index) => {
      const id = el.getAttribute("data-mine-id");
      const tag = el.tagName;
      const classes = el.className;
      const text = el.textContent.trim().substring(0, 50);
      console.log(`  ${index + 1}. ID: ${id}, Tag: ${tag}, Classes: "${classes}", Text: "${text}..."`);
    });

    // Kiểm tra mỏ có bị hòa bình không
    const mineElement = document.querySelector(`[data-mine-id="${mineId}"]`);
    console.log(`[KhoangMach] 🔍 Tìm element mỏ với ID ${mineId}:`, mineElement);

    if (mineElement) {
      console.log("[KhoangMach] ✅ Tìm thấy element mỏ!");
      console.log("  - Tag:", mineElement.tagName);
      console.log("  - Classes:", mineElement.className);
      console.log("  - Text:", mineElement.textContent.trim());

      const isPeaceful = mineElement.querySelector(".peace-icon") !== null;
      const mineName = mineElement.querySelector(".mine-name")?.textContent.trim() || `Mỏ ${mineId}`;
      console.log(`[KhoangMach] 🕊️ Kiểm tra hòa bình: ${isPeaceful}`);
      console.log(`[KhoangMach] 📛 Tên mỏ: "${mineName}"`);

      if (isPeaceful) {
        console.log("[KhoangMach] ❌ Mỏ đã bị hòa bình, dừng auto mining");
        updateKhoangMachOverlay(`
          <div>⛏️ Loại mỏ: ${mineTypeName}</div>
          <div>🎯 ID mỏ: ${mineId}</div>
          <div style="margin-top: 8px; color: #f56565;">🕊️ Mỏ "${mineName}" đã bị hòa bình!</div>
          <div style="margin-top: 5px; font-size: 11px;">Vui lòng chọn mỏ khác từ popup extension</div>
        `);

        // Dừng spam
        if (window.khoangMachSpamInterval) {
          clearInterval(window.khoangMachSpamInterval);
        }
        return; // Dừng auto mining
      }
    } else {
      console.log("[KhoangMach] ❌ Không tìm thấy element mỏ");
    }

    // Tìm và nhấn nút vào mỏ - but first check if already in mine
    console.log("[KhoangMach] 🔍 Kiểm tra trạng thái hiện tại...");

    // Check if user is already in the mine (leave-mine button exists)
    leaveButton =
      document.querySelector(`button.leave-mine[data-mine-id="${mineId}"]`) ||
      document.querySelector(`[data-mine-id="${mineId}"] button.leave-mine`) ||
      document.querySelector(`[data-mine-id="${mineId}"] .leave-mine`);

    if (leaveButton) {
      console.log("[KhoangMach] ✅ Đã ở trong mỏ (tìm thấy nút rời mỏ), dừng auto mining");
      const mineName =
        document.querySelector(`[data-mine-id="${mineId}"] .mine-name`)?.textContent.trim() || `Mỏ ${mineId}`;

      updateKhoangMachOverlay(`
        <div>⛏️ Loại mỏ: ${mineTypeName}</div>
        <div>🎯 ID mỏ: ${mineId}</div>
        <div style="margin-top: 8px; color: #4ade80;">✅ Đã ở trong mỏ "${mineName}"!</div>
        <div style="margin-top: 5px; font-size: 11px;">🎉 Auto mining hoàn thành!</div>
      `);

      // Dừng spam
      if (window.khoangMachSpamInterval) {
        clearInterval(window.khoangMachSpamInterval);
        window.khoangMachSpamInterval = null;
      }
      isEntering = false;
      return; // Dừng auto mining
    }

    console.log("[KhoangMach] 🔍 Tìm nút vào mỏ...");

    // Thử nhiều selector khác nhau
    const enterSelectors = [
      `button.enter-mine[data-mine-id="${mineId}"]`,
      `button[data-mine-id="${mineId}"]`,
      `.enter-mine[data-mine-id="${mineId}"]`,
      `[data-mine-id="${mineId}"] button.enter-mine`,
      `[data-mine-id="${mineId}"] button`,
      `[data-mine-id="${mineId}"] .enter-mine`,
    ];

    let enterButton = null;
    let usedEnterSelector = "";

    for (const selector of enterSelectors) {
      console.log("[KhoangMach] 🔍 Thử selector nút vào:", selector);
      enterButton = document.querySelector(selector);
      if (enterButton) {
        usedEnterSelector = selector;
        console.log("[KhoangMach] ✅ Tìm thấy nút vào với selector:", selector);
        break;
      } else {
        console.log("[KhoangMach] ❌ Không tìm thấy với selector:", selector);
      }
    }

    // Debug: Liệt kê tất cả nút enter-mine
    const allEnterButtons = document.querySelectorAll(
      "button.enter-mine, .enter-mine, [class*='enter'], button[data-mine-id]",
    );
    console.log(`[KhoangMach] 📋 Tìm thấy ${allEnterButtons.length} nút có liên quan đến enter:`);
    allEnterButtons.forEach((btn, index) => {
      const classes = btn.className;
      const dataId = btn.getAttribute("data-mine-id");
      const text = btn.textContent.trim();
      console.log(`  ${index + 1}. Classes: "${classes}", Data-ID: "${dataId}", Text: "${text}"`);
    });

    if (enterButton) {
      console.log("[KhoangMach] ✅ Tìm thấy nút vào mỏ!");
      console.log("  - Tag:", enterButton.tagName);
      console.log("  - Classes:", enterButton.className);
      console.log("  - Text:", enterButton.textContent.trim());
      console.log("  - Data-mine-id:", enterButton.getAttribute("data-mine-id"));
      console.log("  - Disabled:", enterButton.disabled);
      console.log("  - Style display:", enterButton.style.display);

      isEntering = true;
      console.log(`[KhoangMach] 🖱️ Nhấn nút vào mỏ ID: ${mineId}`);

      try {
        enterButton.click();
        console.log("[KhoangMach] ✅ Đã nhấn nút vào mỏ thành công!");

        // Đợi popup xác nhận xuất hiện
        setTimeout(() => {
          console.log("[KhoangMach] 🔍 Tìm popup xác nhận...");

          const confirmSelectors = [
            ".swal2-confirm.swal2-styled",
            ".swal2-confirm",
            "button.swal2-confirm",
            "[class*='swal2-confirm']",
            "button[class*='confirm']",
          ];

          let confirmButton = null;
          for (const selector of confirmSelectors) {
            console.log("[KhoangMach] 🔍 Thử selector confirm:", selector);
            confirmButton = document.querySelector(selector);
            if (confirmButton) {
              console.log("[KhoangMach] ✅ Tìm thấy nút confirm với selector:", selector);
              break;
            }
          }

          console.log(`[KhoangMach] 🔍 Nút xác nhận:`, confirmButton);

          if (confirmButton) {
            const buttonText = confirmButton.textContent.trim();
            console.log(`[KhoangMach] 📝 Text nút xác nhận: "${buttonText}"`);

            if (
              buttonText.includes("Có") ||
              buttonText.includes("vào") ||
              buttonText.includes("OK") ||
              buttonText.includes("Xác nhận")
            ) {
              console.log(`[KhoangMach] 🖱️ Nhấn nút xác nhận`);
              confirmButton.click();
              console.log("[KhoangMach] ✅ Đã nhấn nút xác nhận!");

              // Đợi kiểm tra kết quả
              setTimeout(() => {
                console.log("[KhoangMach] 🔍 Kiểm tra kết quả...");
                checkMiningResult(mineId, mineTypeName);
              }, 3000); // Tăng thời gian chờ
            } else {
              console.log("[KhoangMach] ❌ Text nút xác nhận không đúng");
              isEntering = false;
            }
          } else {
            console.log(`[KhoangMach] ❌ Không tìm thấy nút xác nhận`);

            // Debug: Liệt kê tất cả button có thể là confirm
            const allConfirmButtons = document.querySelectorAll("button, [role='button']");
            console.log(`[KhoangMach] 📋 Tất cả button có thể là confirm:`);
            allConfirmButtons.forEach((btn, index) => {
              const text = btn.textContent.trim();
              const classes = btn.className;
              if (
                text.includes("Có") ||
                text.includes("vào") ||
                text.includes("OK") ||
                text.includes("Xác nhận") ||
                classes.includes("confirm")
              ) {
                console.log(`  ${index + 1}. Text: "${text}", Classes: "${classes}"`);
              }
            });

            isEntering = false;
          }
        }, 2000); // Tăng thời gian chờ popup
      } catch (error) {
        console.error("[KhoangMach] ❌ Lỗi khi nhấn nút vào mỏ:", error);
        isEntering = false;
      }
    } else {
      console.log(`[KhoangMach] ❌ Không tìm thấy nút vào mỏ ID: ${mineId}`);
    }
  };

  // Bắt đầu thử vào mỏ ngay lập tức
  setTimeout(() => {
    console.log("[KhoangMach] ⏰ Bắt đầu thử vào mỏ sau 2 giây...");
    tryEnterMine();
  }, 2000);

  // Spam liên tục mỗi 8 giây
  const spamInterval = setInterval(() => {
    if (!isEntering) {
      console.log("[KhoangMach] 🔄 Spam interval - thử lại...");
      tryEnterMine();
    } else {
      console.log("[KhoangMach] ⏸️ Spam interval - đang xử lý, bỏ qua...");
    }
  }, 8000); // Tăng interval lên 8 giây

  // Lưu interval để có thể clear sau này
  window.khoangMachSpamInterval = spamInterval;
  console.log("[KhoangMach] ✅ Đã thiết lập spam interval");
}

// Sửa function checkMiningResult
function checkMiningResult(mineId, mineTypeName) {
  console.log(`[KhoangMach] Kiểm tra kết quả vào mỏ ID: ${mineId}`);

  // Đợi 2 giây để thông báo xuất hiện
  setTimeout(() => {
    // Kiểm tra thông báo thành công
    const successNotification = document.querySelector(".notifications .toast.success span");
    console.log(`[KhoangMach] Thông báo thành công:`, successNotification?.textContent);

    if (successNotification && successNotification.textContent.includes("Đã di chuyển sang khoáng mạch")) {
      const mineName = successNotification.textContent.match(/"([^"]+)"/)?.[1] || `Mỏ ${mineId}`;

      updateKhoangMachOverlay(`
        <div>⛏️ Loại mỏ: ${mineTypeName}</div>
        <div>🎯 ID mỏ: ${mineId}</div>
        <div style="margin-top: 8px; color: #4ade80;">✅ Đã vào mỏ "${mineName}" thành công!</div>
      `);

      // Dừng spam
      if (window.khoangMachSpamInterval) {
        clearInterval(window.khoangMachSpamInterval);
        window.khoangMachSpamInterval = null;
      }
      isEntering = false;
      return;
    }

    // Additional check: Look for leave-mine button as confirmation of successful entry
    setTimeout(() => {
      let leaveButton =
        document.querySelector(`button.leave-mine[data-mine-id="${mineId}"]`) ||
        document.querySelector(`[data-mine-id="${mineId}"] button.leave-mine`) ||
        document.querySelector(`[data-mine-id="${mineId}"] .leave-mine`);

      if (leaveButton) {
        console.log("[KhoangMach] ✅ Phát hiện nút rời mỏ - xác nhận đã vào mỏ thành công!");
        const mineName =
          document.querySelector(`[data-mine-id="${mineId}"] .mine-name`)?.textContent.trim() || `Mỏ ${mineId}`;

        updateKhoangMachOverlay(`
          <div>⛏️ Loại mỏ: ${mineTypeName}</div>
          <div>🎯 ID mỏ: ${mineId}</div>
          <div style="margin-top: 8px; color: #4ade80;">✅ Đã vào mỏ "${mineName}" thành công!</div>
          <div style="margin-top: 5px; font-size: 11px;">🎉 Auto mining hoàn thành!</div>
        `);

        // Dừng spam
        if (window.khoangMachSpamInterval) {
          clearInterval(window.khoangMachSpamInterval);
          window.khoangMachSpamInterval = null;
        }
        isEntering = false;
        return;
      }
    }, 1000);

    // Kiểm tra thông báo lỗi
    const errorNotification = document.querySelector(".notifications .toast.error span");
    console.log(`[KhoangMach] Thông báo lỗi:`, errorNotification?.textContent);

    if (errorNotification) {
      if (errorNotification.textContent.includes("Khoáng Mạch đã đầy")) {
        updateKhoangMachOverlay(`
          <div>⛏️ Loại mỏ: ${mineTypeName}</div>
          <div>🎯 ID mỏ: ${mineId}</div>
          <div style="margin-top: 8px; color: #fbbf24;">⚠️ Mỏ đầy, đang thử lại...</div>
        `);

        // Tiếp tục thử
        isEntering = false;
        return;
      }

      // Kiểm tra thông báo hết phiên
      if (errorNotification.textContent.includes("Phiên đã hết hạn")) {
        updateKhoangMachOverlay(`
          <div>⛏️ Loại mỏ: ${mineTypeName}</div>
          <div>🎯 ID mỏ: ${mineId}</div>
          <div style="margin-top: 8px; color: #f56565;">🔄 Phiên hết hạn, đang reload...</div>
        `);

        // Dừng spam và reload trang
        if (window.khoangMachSpamInterval) {
          clearInterval(window.khoangMachSpamInterval);
        }

        setTimeout(() => {
          location.reload();
        }, 2000);
        return;
      }
    }

    // Không có thông báo gì hoặc thông báo khác, tiếp tục thử
    console.log(`[KhoangMach] Không có thông báo rõ ràng, tiếp tục thử`);
    isEntering = false;
  }, 2000);
}

// Xóa các function không cần thiết: showMineSelectionPopup, startAutoMining

// Chạy logic chính nếu domain hợp lệ
isValidHoatHinh3DPage(() => {
  function muteAllAudio() {
    const currentURL = window.location.href;
    if (!currentURL.includes("/phong-cuoi")) {
      console.log("[MuteAllAudio] Not muting audio - URL does not contain /phong-cuoi");
      return;
    }
    console.log("[MuteAllAudio] Muting audio on /phong-cuoi page...");
    const blockAudio = () => {
      document.querySelectorAll("audio, video").forEach((media) => {
        media.muted = true;
        media.volume = 0;
      });
      const AudioProto = window.Audio && window.Audio.prototype;
      if (AudioProto && !AudioProto._play) {
        AudioProto._play = AudioProto.play;
        AudioProto.play = function () {
          this.muted = true;
          this.volume = 0;
          return this._play.call(this);
        };
      }
    };
    blockAudio();
    setInterval(blockAudio, 1000);
  }

  async function vanDap() {
    let questionTimeout = null;
    let nextQuestionTimeout = null;

    waitForElement("#start-quiz-button", (button) => {
      console.log("Sẽ nhấn nút bắt đầu sau 1 giây...");
      setTimeout(() => {
        button.click();
        processNextQuestion();
      }, 1000);
    });

    function processNextQuestion() {
      if (questionTimeout) clearTimeout(questionTimeout);
      if (nextQuestionTimeout) clearTimeout(nextQuestionTimeout);

      waitForElement(
        "#question",
        (questionElement) => {
          questionTimeout = setTimeout(() => {
            const questionText = questionElement.textContent.trim();
            if (!questionText) {
              console.warn("[ProcessQuestion] Question text is empty, retrying...");
              updateAnswerOverlay(questionText, null, "Câu hỏi trống, thử lại...");
              nextQuestionTimeout = setTimeout(processNextQuestion, 1000);
              return;
            }
            console.log(`[ProcessQuestion] Question: "${questionText}"`);

            // So sánh trực tiếp với danh sách câu hỏi trong questionAnswers
            let matchedAnswer = null;
            let bestSimilarity = 0;
            for (const [key, value] of Object.entries(questionAnswers)) {
              const similarity = fuzzyMatch(key, questionText); // So sánh trực tiếp
              if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                matchedAnswer = value;
                console.log(
                  `[Match] Potential match - Question: "${key}", Answer: "${value}", Similarity: ${similarity}`,
                );
              }
              if (similarity === 1) break; // Exact match, dừng tìm kiếm
            }

            if (matchedAnswer && bestSimilarity >= 0.9) {
              console.log(`[Match] Confirmed match - Answer: "${matchedAnswer}", Similarity: ${bestSimilarity}`);
              updateAnswerOverlay(questionText, matchedAnswer, "Đang tìm tùy chọn...");
              waitForElement(
                ".options .option",
                () => {
                  const options = document.querySelectorAll(".options .option");
                  console.log(`[Options] Found ${options.length} options`);
                  let found = false;
                  options.forEach((option, index) => {
                    const optionText = option.textContent.trim();
                    console.log(`[Option ${index}] Raw: "${optionText}"`);
                    if (optionText === matchedAnswer) {
                      // So sánh trực tiếp
                      console.log(`[Click] Exact match for option: "${optionText}"`);
                      try {
                        option.click();
                        console.log(`[Click] Clicked option ${index} successfully`);
                        updateAnswerOverlay(questionText, matchedAnswer, "Đã chọn tùy chọn khớp chính xác");
                        found = true;
                      } catch (e) {
                        console.error(`[Click] Failed to click option ${index}:`, e);
                        updateAnswerOverlay(questionText, matchedAnswer, "Lỗi khi chọn tùy chọn");
                      }
                    } else if (fuzzyMatch(optionText, matchedAnswer) >= 0.9) {
                      console.log(`[Click] Fuzzy match for option: "${optionText}"`);
                      try {
                        option.click();
                        console.log(`[Click] Clicked option ${index} successfully`);
                        updateAnswerOverlay(questionText, matchedAnswer, "Đã chọn tùy chọn khớp gần đúng");
                        found = true;
                      } catch (e) {
                        console.error(`[Click] Failed to click option ${index}:`, e);
                        updateAnswerOverlay(questionText, matchedAnswer, "Lỗi khi chọn tùy chọn");
                      }
                    }
                  });
                  if (!found) {
                    console.warn(`Không tìm thấy tùy chọn phù hợp cho đáp án: "${matchedAnswer}"`);
                    console.log(
                      "[Debug] Available options:",
                      Array.from(options).map((o) => o.textContent.trim()),
                    );
                    updateAnswerOverlay(questionText, matchedAnswer, "Không tìm thấy tùy chọn phù hợp");
                  }
                  nextQuestionTimeout = setTimeout(processNextQuestion, 1000);
                },
                3000,
              );
            } else {
              console.warn(`Không tìm thấy câu hỏi phù hợp: "${questionText}" (Best Similarity: ${bestSimilarity})`);
              updateAnswerOverlay(questionText, null, "Không tìm thấy câu hỏi phù hợp");
              nextQuestionTimeout = setTimeout(processNextQuestion, 1000);
            }
          }, 1000);
        },
        3000,
      );
    }
  }

  function diemDanh() {
    waitForElement("#checkInButton", (button) => {
      console.log("Sẽ nhấn nút Điểm Danh sau 1 giây...");
      setTimeout(() => {
        button.click();
        console.log("Đã nhấn nút Điểm Danh!");
      }, 1000);
    });
  }

  function phucLoi() {
    function openNextChest() {
      for (let i = 1; i <= 4; i++) {
        const chest = document.querySelector(`#chest-${i}`);
        if (chest && !chest.classList.contains("opened")) {
          console.log(`Phát hiện rương ${i} chưa mở, sẽ thử mở sau 1 giây...`);
          setTimeout(() => {
            chest.click();
            console.log(`Đã nhấn mở rương ${i}`);
          }, 1000);
          break;
        } else if (i === 4) {
          console.log("Tất cả rương đã mở.");
        }
      }
      setTimeout(openNextChest, 15000);
    }
    waitForElement(".chest-progress-container", () => {
      console.log("Bắt đầu kiểm tra rương...");
      openNextChest();
    });
  }

  function thiLuyen() {
    function clickChestImage() {
      const chest = document.querySelector("#chestImage");
      if (chest && chest.classList.contains("chest-close")) {
        console.log("Thí Luyện: Nhấn mở rương...");
        chest.click();
      } else {
        console.log("Thí Luyện: Rương chưa sẵn sàng hoặc đã mở.");
      }
      setTimeout(clickChestImage, 15000);
    }
    waitForElement("#chestImage", () => {
      clickChestImage();
    });
  }

  async function doThach() {
    await sleep(1000);
    await claimRewardIfAvailable();
    const stones = Array.from(document.querySelectorAll(".stone-item"));
    const stoneData = stones.map((stone) => {
      const multiplierText = stone.querySelector(".reward-multiplier span")?.textContent.trim() || "";
      const multiplier = Number.parseInt(multiplierText.replace("x", "")) || 0;
      const button = stone.querySelector(".select-stone-button");
      return { multiplier, button };
    });
    const sorted = stoneData.sort((a, b) => b.multiplier - a.multiplier);
    const top2 = sorted.slice(0, 2);
    for (const stone of top2) {
      if (!stone.button) continue;
      stone.button.click();
      await sleep(500);
      const input = document.querySelector("#bet-amount");
      const confirmBtn = document.querySelector("#confirm-bet");
      if (input && confirmBtn) {
        input.value = "20";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(300);
        confirmBtn.click();
        await sleep(1000);
      }
    }
    async function claimRewardIfAvailable() {
      const claimButton = document.querySelector("#claim-reward-button.claim-reward-button");
      if (claimButton) {
        claimButton.click();
        await sleep(1000);
      }
    }
  }

  async function chucPhuc() {
    const intervalId = setInterval(async () => {
      const blessingSection = document.querySelector(".blessing-section");
      if (
        blessingSection &&
        blessingSection.innerText.includes("Đạo hạo hết Đạo đã gửi lần chúc phúc cho cấp Đội ngày")
      ) {
        console.log("Đã gửi chúc phúc thành công! Ngừng script.");
        clearInterval(intervalId);
        return;
      }
      const select = document.querySelector("#blessing-default-options");
      const blessButton = document.querySelector(".blessing-button");
      if (!select || !blessButton) {
        console.log("Không tìm thấy phần thiên chúc phúc!");
        return;
      }
      if (select.selectedIndex <= 0) {
        const totalOptions = select.options.length;
        const randomIndex = Math.floor(Math.random() * (totalOptions - 1)) + 1;
        select.selectedIndex = randomIndex;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        console.log("Đã chọn lần chúc:", select.options[randomIndex].textContent.trim());
      }
      blessButton.click();
      console.log('Nhấn "Gửi Chúc Phúc"...');
      await sleep(500);
      const confirmButton = document.querySelector(".custom-modal-button.confirm");
      if (confirmButton) {
        confirmButton.click();
        console.log("Đã xác nhận thành công!");
      } else {
        console.log("Chưa hiện nút xác nhận (có thể do chưa qua captcha).");
      }
    }, 1500);
  }

  function autoClaimRewards() {
    waitForElement(
      ".reward-box",
      () => {
        const rewardBoxes = document.querySelectorAll(".reward-box");
        if (!rewardBoxes.length) {
          console.log("[AutoClaimRewards] Không tìm thấy rương phần thưởng.");
          return;
        }

        console.log(`[AutoClaimRewards] Tìm thấy ${rewardBoxes.length} rương phần thưởng.`);

        let claimedCount = 0;
        const maxClaims = 2; // Nhận tối đa 2 rương

        // Duyệt qua tất cả các rương
        rewardBoxes.forEach((box, index) => {
          const boxId = box.getAttribute("id") || `box-${index}`;
          const isUnlocked = box.classList.contains("unlocked");
          const isClaimed = box.classList.contains("claimed");

          console.log(`[AutoClaimRewards] Rương ${boxId} - Unlocked: ${isUnlocked}, Claimed: ${isClaimed}`);

          if (!isUnlocked) {
            console.log(`[AutoClaimRewards] Rương ${boxId} chưa được mở khóa.`);
            return;
          }

          if (isClaimed) {
            console.log(`[AutoClaimRewards] Rương ${boxId} đã được nhận.`);
            return;
          }

          if (claimedCount >= maxClaims) {
            console.log(`[AutoClaimRewards] Đã nhận đủ ${maxClaims} rương.`);
            return;
          }

          // Tìm nút nhận thưởng trong rương
          const rewardImage = box.querySelector(".reward-image");
          const claimButton = box.querySelector("button") || box.querySelector(".claim-btn") || box.querySelector("[onclick]");

          if (rewardImage) {
            console.log(`[AutoClaimRewards] Nhấn reward-image cho rương ${boxId}`);
            setTimeout(() => {
              rewardImage.click();
              claimedCount++;
            }, claimedCount * 1000); // Delay giữa các lần nhấn
          } else if (claimButton) {
            console.log(`[AutoClaimRewards] Nhấn claim button cho rương ${boxId}`);
            setTimeout(() => {
              claimButton.click();
              claimedCount++;
            }, claimedCount * 1000); // Delay giữa các lần nhấn
          } else {
            // Thử nhấn trực tiếp vào rương
            console.log(`[AutoClaimRewards] Nhấn trực tiếp vào rương ${boxId}`);
            setTimeout(() => {
              box.click();
              claimedCount++;
            }, claimedCount * 1000); // Delay giữa các lần nhấn
          }
        });

        console.log(`[AutoClaimRewards] Đã lên lịch nhận ${Math.min(claimedCount, maxClaims)} rương.`);
      },
      5000,
    ); // Kiểm tra cứ sau 5 giây
  }

  async function teLe() {
    await sleep(1000);

    const teLeButton = document.querySelector("#te-le-button");
    if (!teLeButton) {
      console.log("Không tìm thấy nút Tế Lễ.");
      return;
    }

    console.log("Đã nhấn nút Tế Lễ.");
    teLeButton.click();

    await sleep(1000);

    const confirmButton = document.querySelector(".swal2-confirm.swal2-styled");
    if (confirmButton) {
      confirmButton.click();
      console.log("Đã xác nhận Tế Lễ.");
    } else {
      console.log("Không tìm thấy nút xác nhận.");
    }
  }

  // Chức năng nhận lì xì
  function nhanLiXi() {
    waitForElement(
      "#openButton.lixi-open-button",
      (button) => {
        console.log("Phát hiện nút Mở Lì Xì, sẽ nhấn sau 1 giây...");
        setTimeout(() => {
          button.click();
          console.log("Đã nhấn nút Mở Lì Xì!");
        }, 1000);
      },
      3000,
    ); // Kiểm tra cứ sau 3 giây
    setInterval(() => {
      const button = document.querySelector("#openButton.lixi-open-button");
      if (button) {
        console.log("Phát hiện nút Mở Lì Xì, sẽ nhấn sau 1 giây...");
        setTimeout(() => {
          button.click();
          console.log("Đã nhấn nút Mở Lì Xì!");
        }, 1000);
      }
    }, 5000); // Kiểm tra lại mỗi 5 giây
  }

  // Chức năng đánh bí cảnh
  function danhBiCanh() {
    waitForElement(
      "#challenge-boss-btn",
      (challengeButton) => {
        if (challengeButton.textContent.includes("KHIÊU CHIẾN")) {
          console.log("Phát hiện nút Khiêu Chiến, sẽ nhấn sau 1 giây...");
          setTimeout(() => {
            challengeButton.click();
            console.log("Đã nhấn nút Khiêu Chiến!");
            waitForElement(
              "#attack-boss-btn",
              (attackButton) => {
                if (attackButton.textContent.includes("Tấn Công")) {
                  console.log("Phát hiện nút Tấn Công, sẽ nhấn sau 1 giây...");
                  setTimeout(() => {
                    attackButton.click();
                    console.log("Đã nhấn nút Tấn Công!");
                  }, 1000);
                }
              },
              3000,
            );
          }, 1000);
        }
      },
      3000,
    ); // Kiểm tra cứ sau 3 giây
    // Kiểm tra cứ sau 3 giây
    setInterval(() => {
      const challengeButton = document.querySelector("#challenge-boss-btn");
      if (challengeButton && challengeButton.textContent.includes("KHIÊU CHIẾN")) {
        console.log("Phát hiện nút Khiêu Chiến, sẽ nhấn sau 1 giây...");
        setTimeout(() => {
          challengeButton.click();
          console.log("Đã nhấn nút Khiêu Chiến!");
          const attackButton = document.querySelector("#attack-boss-btn");
          if (attackButton && attackButton.textContent.includes("Tấn Công")) {
            console.log("Phát hiện nút Tấn Công, sẽ nhấn sau 1 giây...");
            setTimeout(() => {
              attackButton.click();
              console.log("Đã nhấn nút Tấn Công!");
            }, 1000);
          }
        }, 1000);
      }
    }, 5000); // Kiểm tra lại mỗi 5 giây
  }

  // Chức năng luận võ đầu tiên
  function luanVoDauTien() {
    waitForElement(
      "#joinBattleImg",
      (joinButton) => {
        console.log("Phát hiện nút Gia Nhập, sẽ nhấn sau 1 giây...");
        setTimeout(() => {
          joinButton.click();
          console.log("Đã nhấn nút Gia Nhập!");
          waitForElement(
            ".swal2-confirm.swal2-styled",
            (confirmButton) => {
              if (confirmButton.textContent.includes("Tham gia")) {
                console.log("Phát hiện nút Tham gia, sẽ nhấn sau 1 giây...");
                setTimeout(() => {
                  confirmButton.click();
                  console.log("Đã nhấn nút Tham gia!");
                  // Kích hoạt auto accept toggle sau khi tham gia
                  const autoAcceptToggle = document.querySelector("#auto_accept_toggle");
                  if (autoAcceptToggle && !autoAcceptToggle.checked) {
                    console.log("Phát hiện nút auto accept, sẽ nhấn sau 1 giây...");
                    setTimeout(() => {
                      autoAcceptToggle.click();
                      console.log("Đã kích hoạt auto accept toggle!");
                    }, 1000);
                  }
                }, 1000);
              }
            },
            3000,
          );
        }, 1000);
      },
      3000,
    ); // Kiểm tra cứ sau 3 giây
    setInterval(() => {
      const joinButton = document.querySelector("#joinBattleImg");
      if (joinButton) {
        console.log("Phát hiện nút Gia Nhập, sẽ nhấn sau 1 giây...");
        setTimeout(() => {
          joinButton.click();
          console.log("Đã nhấn nút Gia Nhập!");
          const confirmButton = document.querySelector(".swal2-confirm.swal2-styled");
          if (confirmButton && confirmButton.textContent.includes("Tham gia")) {
            console.log("Phát hiện nút Tham gia, sẽ nhấn sau 1 giây...");
            setTimeout(() => {
              confirmButton.click();
              console.log("Đã nhấn nút Tham gia!");
              const autoAcceptToggle = document.querySelector("#auto_accept_toggle");
              if (autoAcceptToggle && !autoAcceptToggle.checked) {
                console.log("Phát hiện nút auto accept, sẽ nhấn sau 1 giây...");
                setTimeout(() => {
                  autoAcceptToggle.click();
                  console.log("Đã kích hoạt auto accept toggle!");
                }, 1000);
              }
            }, 1000);
          }
        }, 1000);
      }
    }, 5000); // Kiểm tra lại mỗi 5 giây
  }

  // Chỉ gọi các chức năng dựa trên URL
  const currentURL = window.location.href;
  if (currentURL.includes("/phong-cuoi")) {
    muteAllAudio();
    chucPhuc(); // Gọi chức năng chúc phúc
    nhanLiXi(); // Gọi chức năng nhận lì xì
  } else if (currentURL.includes("/bi-canh-tong-mon")) {
    danhBiCanh(); // Gọi chức năng đánh bí cảnh
  } else if (currentURL.includes("/luan-vo-duong")) {
    luanVoDauTien(); // Gọi chức năng luận võ đầu tiên
  } else if (currentURL.includes("/van-dap-tong-mon")) {
    vanDap();
  } else if (currentURL.includes("/diem-danh")) {
    diemDanh();
  } else if (currentURL.includes("/phuc-loi-duong")) {
    phucLoi();
  } else if (currentURL.includes("/thi-luyen-tong-mon-hh3d")) {
    thiLuyen();
  } else if (currentURL.includes("/do-thach-hh3d")) {
    doThach();
  } else if (currentURL.includes("/danh-sach-thanh-vien-tong-mon")) {
    teLe();
  } else if (currentURL.includes("/bang-hoat-dong-ngay")) {
    console.log("[HoatHinh3D] Chạy auto nhận thưởng bảng hoạt động...");
    autoClaimRewards();
  } else if (currentURL.includes("/hoang-vuc")) {
    console.log("[HoatHinh3D] Chạy auto Hoang Vực...");
    hoangVuc();
  } else if (currentURL.includes("/khoang-mach")) {
    console.log("[HoatHinh3D] Chạy auto Khoáng Mạch...");
    khoangMach();
  }
});

// Hàm sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Hàm so sánh gần đúng (fuzzy matching)
function fuzzyMatch(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const matrix = Array(s1.length + 1)
    .fill(null)
    .map(() => Array(s2.length + 1).fill(0));

  for (let i = 0; i <= s1.length; i++) {
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0 || j === 0) {
        matrix[i][j] = 0;
      } else if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const longestCommonSubsequenceLength = matrix[s1.length][s2.length];
  return longestCommonSubsequenceLength / Math.max(s1.length, s2.length);
}

// Hàm đợi element xuất hiện
function waitForElement(selector, callback, timeout = 5000) {
  let element = document.querySelector(selector);
  if (element) {
    callback(element);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    element = document.querySelector(selector);
    if (element) {
      callback(element);
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => {
    observer.disconnect();
    console.log(`Không tìm thấy element "${selector}" sau ${timeout}ms.`);
  }, timeout);
}

// Lắng nghe tin nhắn từ background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "clicked_browser_action") {
    // Lấy URL hiện tại của tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var currentURL = tabs[0].url;

      // Kiểm tra URL và thực hiện hành động tương ứng
      if (currentURL.includes("/tu-luyen")) {
        // Thêm logic xử lý Tu Luyện
        console.log("Đang ở trang Tu Luyện");
        // Thêm code của bạn ở đây
      } else if (currentURL.includes("/the-gioi")) {
        // Thêm logic xử lý Thế Giới
        console.log("Đang ở trang Thế Giới");
        // Thêm code của bạn ở đây
      } else if (currentURL.includes("/hoang-vuc")) {
        hoangVuc();
      } else if (currentURL.includes("/khoang-mach")) {
        khoangMach();
      }
    });
  }
});