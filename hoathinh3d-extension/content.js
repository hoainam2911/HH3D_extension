'use strict';

// Hàm kiểm tra URL có khớp với domain đã lưu không
function isValidHoatHinh3DPage(callback) {
  chrome.storage.sync.get(['hoathinh3dDomain'], (result) => {
    const savedDomain = result.hoathinh3dDomain;
    if (!savedDomain) {
      console.log('[HoatHinh3D] No domain configured. Please set a domain in the extension popup.');
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
  let overlay = document.getElementById('answer-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'answer-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.left = '10px';
    overlay.style.right = '10px';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.color = '#fff';
    overlay.style.padding = '10px';
    overlay.style.zIndex = '9999';
    overlay.style.borderRadius = '5px';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.fontSize = '14px';
    overlay.style.maxHeight = '150px';
    overlay.style.overflowY = 'auto';
    overlay.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
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
  "Tại sao Hàn Lập khi gặp Phong Hi không chạy mà ở lại giúp đỡ chế tạo Phong Lôi Sí ?": "Vì đánh không lại"
};

// Chạy logic chính nếu domain hợp lệ
isValidHoatHinh3DPage(() => {
  function muteAllAudio() {
    const currentURL = window.location.href;
    if (!currentURL.includes('/phong-cuoi')) {
      console.log('[MuteAllAudio] Not muting audio - URL does not contain /phong-cuoi');
      return;
    }
    console.log('[MuteAllAudio] Muting audio on /phong-cuoi page...');
    const blockAudio = () => {
      document.querySelectorAll('audio, video').forEach(media => {
        media.muted = true;
        media.volume = 0;
      });
      const AudioProto = window.Audio && window.Audio.prototype;
      if (AudioProto && !AudioProto._play) {
        AudioProto._play = AudioProto.play;
        AudioProto.play = function() {
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

    waitForElement('#start-quiz-button', button => {
      console.log('Sẽ nhấn nút bắt đầu sau 2 giây...');
      setTimeout(() => {
        button.click();
        processNextQuestion();
      }, 2000);
    });

    function processNextQuestion() {
      if (questionTimeout) clearTimeout(questionTimeout);
      if (nextQuestionTimeout) clearTimeout(nextQuestionTimeout);

      waitForElement('#question', questionElement => {
        questionTimeout = setTimeout(() => {
          const questionText = questionElement.textContent.trim();
          if (!questionText) {
            console.warn('[ProcessQuestion] Question text is empty, retrying...');
            updateAnswerOverlay(questionText, null, 'Câu hỏi trống, thử lại...');
            nextQuestionTimeout = setTimeout(processNextQuestion, 2000);
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
              console.log(`[Match] Potential match - Question: "${key}", Answer: "${value}", Similarity: ${similarity}`);
            }
            if (similarity === 1) break; // Exact match, dừng tìm kiếm
          }

          if (matchedAnswer && bestSimilarity >= 0.9) {
            console.log(`[Match] Confirmed match - Answer: "${matchedAnswer}", Similarity: ${bestSimilarity}`);
            updateAnswerOverlay(questionText, matchedAnswer, 'Đang tìm tùy chọn...');
            waitForElement('.options .option', () => {
              const options = document.querySelectorAll('.options .option');
              console.log(`[Options] Found ${options.length} options`);
              let found = false;
              options.forEach((option, index) => {
                const optionText = option.textContent.trim();
                console.log(`[Option ${index}] Raw: "${optionText}"`);
                if (optionText === matchedAnswer) { // So sánh trực tiếp
                  console.log(`[Click] Exact match for option: "${optionText}"`);
                  try {
                    option.click();
                    console.log(`[Click] Clicked option ${index} successfully`);
                    updateAnswerOverlay(questionText, matchedAnswer, 'Đã chọn tùy chọn khớp chính xác');
                    found = true;
                  } catch (e) {
                    console.error(`[Click] Failed to click option ${index}:`, e);
                    updateAnswerOverlay(questionText, matchedAnswer, 'Lỗi khi chọn tùy chọn');
                  }
                } else if (fuzzyMatch(optionText, matchedAnswer) >= 0.9) {
                  console.log(`[Click] Fuzzy match for option: "${optionText}"`);
                  try {
                    option.click();
                    console.log(`[Click] Clicked option ${index} successfully`);
                    updateAnswerOverlay(questionText, matchedAnswer, 'Đã chọn tùy chọn khớp gần đúng');
                    found = true;
                  } catch (e) {
                    console.error(`[Click] Failed to click option ${index}:`, e);
                    updateAnswerOverlay(questionText, matchedAnswer, 'Lỗi khi chọn tùy chọn');
                  }
                }
              });
              if (!found) {
                console.warn(`Không tìm thấy tùy chọn phù hợp cho đáp án: "${matchedAnswer}"`);
                console.log('[Debug] Available options:', Array.from(options).map(o => o.textContent.trim()));
                updateAnswerOverlay(questionText, matchedAnswer, 'Không tìm thấy tùy chọn phù hợp');
              }
              nextQuestionTimeout = setTimeout(processNextQuestion, 2000);
            }, 5000);
          } else {
            console.warn(`Không tìm thấy câu hỏi phù hợp: "${questionText}" (Best Similarity: ${bestSimilarity})`);
            updateAnswerOverlay(questionText, null, 'Không tìm thấy câu hỏi phù hợp');
            nextQuestionTimeout = setTimeout(processNextQuestion, 2000);
          }
        }, 2000);
      }, 5000);
    }
  }

  function diemDanh() {
    waitForElement('#checkInButton', button => {
      console.log('Sẽ nhấn nút Điểm Danh sau 2 giây...');
      setTimeout(() => {
        button.click();
        console.log('Đã nhấn nút Điểm Danh!');
      }, 2000);
    });
  }

  function phucLoi() {
    function openNextChest() {
      for (let i = 1; i <= 4; i++) {
        const chest = document.querySelector(`#chest-${i}`);
        if (chest && !chest.classList.contains('opened')) {
          console.log(`Phát hiện rương ${i} chưa mở, sẽ thử mở sau 2 giây...`);
          setTimeout(() => {
            chest.click();
            console.log(`Đã nhấn mở rương ${i}`);
          }, 2000);
          break;
        } else if (i === 4) {
          console.log('Tất cả rương đã mở.');
        }
      }
      setTimeout(openNextChest, 30000);
    }
    waitForElement('.chest-progress-container', () => {
      console.log('Bắt đầu kiểm tra rương...');
      openNextChest();
    });
  }

  function thiLuyen() {
    function clickChestImage() {
      const chest = document.querySelector('#chestImage');
      if (chest && chest.classList.contains('chest-close')) {
        console.log('Thí Luyện: Nhấn mở rương...');
        chest.click();
      } else {
        console.log('Thí Luyện: Rương chưa sẵn sàng hoặc đã mở.');
      }
      setTimeout(clickChestImage, 30000);
    }
    waitForElement('#chestImage', () => {
      clickChestImage();
    });
  }

  async function doThach() {
    await sleep(3000);
    await claimRewardIfAvailable();
    const stones = Array.from(document.querySelectorAll('.stone-item'));
    const stoneData = stones.map(stone => {
      const multiplierText = stone.querySelector('.reward-multiplier span')?.textContent.trim() || '';
      const multiplier = parseInt(multiplierText.replace('x', '')) || 0;
      const button = stone.querySelector('.select-stone-button');
      return { multiplier, button };
    });
    const sorted = stoneData.sort((a, b) => b.multiplier - a.multiplier);
    const top2 = sorted.slice(0, 2);
    for (const stone of top2) {
      if (!stone.button) continue;
      stone.button.click();
      await sleep(1000);
      const input = document.querySelector('#bet-amount');
      const confirmBtn = document.querySelector('#confirm-bet');
      if (input && confirmBtn) {
        input.value = '20';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(500);
        confirmBtn.click();
        await sleep(2000);
      }
    }
    async function claimRewardIfAvailable() {
      const claimButton = document.querySelector('#claim-reward-button.claim-reward-button');
      if (claimButton) {
        claimButton.click();
        await sleep(2000);
      }
    }
  }

  async function chucPhuc() {
    const intervalId = setInterval(async () => {
      const blessingSection = document.querySelector('.blessing-section');
      if (blessingSection && blessingSection.innerText.includes('Đạo hạo hết Đạo đã gửi lần chúc phúc cho cấp Đội ngày')) {
        console.log('Đã gửi chúc phúc thành công! Ngừng script.');
        clearInterval(intervalId);
        return;
      }
      const select = document.querySelector('#blessing-default-options');
      const blessButton = document.querySelector('.blessing-button');
      if (!select || !blessButton) {
        console.log('Không tìm thấy phần thiên chúc phúc!');
        return;
      }
      if (select.selectedIndex <= 0) {
        const totalOptions = select.options.length;
        const randomIndex = Math.floor(Math.random() * (totalOptions - 1)) + 1;
        select.selectedIndex = randomIndex;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('Đã chọn lần chúc:', select.options[randomIndex].textContent.trim());
      }
      blessButton.click();
      console.log('Nhấn "Gửi Chúc Phúc"...');
      await sleep(1000);
      const confirmButton = document.querySelector('.custom-modal-button.confirm');
      if (confirmButton) {
        confirmButton.click();
        console.log('Đã xác nhận thành công!');
      } else {
        console.log('Chưa hiện nút xác nhận (có thể do chưa qua captcha).');
      }
    }, 3000);
  }

  function autoClaimRewards() {
    waitForElement('.reward-box', () => {
      const rewardBoxes = document.querySelectorAll('.reward-box');
      if (!rewardBoxes.length) {
        console.log('[AutoClaimRewards] Không tìm thấy rương phần thưởng.');
        return;
      }

      for (const box of rewardBoxes) {
        const boxId = box.getAttribute('id');
        const isUnlocked = box.classList.contains('unlocked');
        const isClaimed = box.classList.contains('claimed');

        if (!isUnlocked) {
          console.log(`[AutoClaimRewards] Rương ${boxId} chưa được mở khóa.`);
          continue;
        }

        if (isClaimed) {
          console.log(`[AutoClaimRewards] Rương ${boxId} đã được nhận.`);
          continue;
        }

        const rewardImage = box.querySelector('.reward-image');
        if (rewardImage) {
          rewardImage.click();
          console.log(`[AutoClaimRewards] Đã nhấn nhận thưởng cho ${boxId}.`);
          sleep(1000); // Đợi 1 giây để đảm bảo hành động được xử lý
        } else {
          console.log(`[AutoClaimRewards] Không tìm thấy hình ảnh rương trong ${boxId}.`);
        }
      }
    }, 10000); // Tăng timeout lên 10 giây để đảm bảo trang tải xong
  }

  async function teLe() {
    await sleep(3000);
    const tongKhoElement = document.querySelector('p.tong-kho-dong-gop strong');
    if (!tongKhoElement) {
      console.log('Không tìm thấy thiên tin Tổng Kho.');
      return;
    }
    const tongKho = parseInt(tongKhoElement.textContent.trim()) || 0;
    if (tongKho < 50) {
      console.log(`Tổng Kho Đông góp (${tongKho}) dưới 50, không thể thực hiện Tế Lễ.`);
      return;
    }
    const teLeButton = document.querySelector('#te-le-button');
    if (!teLeButton) {
      console.log('Không tìm thấy nút Tế Lễ.');
      return;
    }
    if (teLeButton.hasAttribute('disabled')) {
      console.log('Nút Tế Lễ đã bị vô hiệu hóa hoặc đã Tế Lễ.');
      return;
    }
    teLeButton.click();
    console.log('Đã nhấn nút Tế Lễ.');
    await sleep(1000);
    const confirmButton = document.querySelector('.swal2-confirm.swal2-styled');
    if (confirmButton) {
      confirmButton.click();
      console.log('Đã xác nhận Tế Lễ.');
    } else {
      console.log('Không tìm thấy nút xác nhận trước popup.');
    }
  }

  // Chức năng nhận lì xì
  function nhanLiXi() {
    waitForElement('#openButton.lixi-open-button', button => {
      console.log('Phát hiện nút Mở Lì Xì, sẽ nhấn sau 2 giây...');
      setTimeout(() => {
        button.click();
        console.log('Đã nhấn nút Mở Lì Xì!');
      }, 2000);
    }, 5000); // Kiểm tra cứ sau 5 giây
    setInterval(() => {
      const button = document.querySelector('#openButton.lixi-open-button');
      if (button) {
        console.log('Phát hiện nút Mở Lì Xì, sẽ nhấn sau 2 giây...');
        setTimeout(() => {
          button.click();
          console.log('Đã nhấn nút Mở Lì Xì!');
        }, 2000);
      }
    }, 10000); // Kiểm tra lại mỗi 10 giây
  }

  // Chỉ gọi muteAllAudio nếu URL chứa /phong-cuoi
  const currentURL = window.location.href;
  if (currentURL.includes('/phong-cuoi')) {
    muteAllAudio();
    chucPhuc(); // Gọi chức năng chúc phúc
    nhanLiXi(); // Gọi chức năng nhận lì xì
  }

  if (currentURL.includes('/van-dap-tong-mon')) {
    vanDap();
  } else if (currentURL.includes('/diem-danh')) {
    diemDanh();
  } else if (currentURL.includes('/phuc-loi-duong')) {
    phucLoi();
  } else if (currentURL.includes('/thi-luyen-tong-mon-hh3d')) {
    thiLuyen();
  } else if (currentURL.includes('/do-thach-hh3d')) {
    doThach();
  } else if (currentURL.includes('/danh-sach-thanh-vien-tong-mon')) {
    teLe();
  } else if (currentURL.includes('/bang-hoat-dong-ngay')) { 
    console.log('[HoatHinh3D] Chạy auto nhận thưởng bảng hoạt động...');
    autoClaimRewards();
  }
});