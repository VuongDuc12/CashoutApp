**### 1. Luồng Mã giảm giá (Voucher / Coupon)

* Bước 1: Lấy dữ liệu (System): Hệ thống kéo danh sách mã giảm giá mới nhất về lưu vào Database.
* Bước 2: Hiển thị (User): Người dùng lên web, lướt xem danh sách mã giảm giá.
* Bước 3: Tương tác (Hành động then chốt): Người dùng bấm nút "Copy mã" hoặc "Dùng ngay".
* Bước 4: Gắn Cookie ngầm (System): Ngay khi người dùng bấm nút, hệ thống làm 2 việc cùng lúc:
  * Lưu mã text vào Clipboard (khay nhớ tạm) của người dùng.
  * Tự động mở một tab mới hoặc bật App Shopee/Lazada thông qua Link Affiliate đính kèm trong mã đó. (Đây là lúc cookie Affiliate được lưu vào máy người dùng).
* Bước 5: Mua hàng & Nhận hoa hồng: Người dùng dán mã vừa copy vào bước thanh toán. Đơn thành công, anh nhận được hoa hồng (người dùng không được chia tiền ở luồng này, họ chỉ được lợi là lấy được mã).

### 2. Luồng Hoàn tiền (Cashback)

* Bước 1: Nhập Link (User): Người dùng copy link sản phẩm bất kỳ trên app Shopee/Lazada và dán vào ô tìm kiếm trên web của anh.
* Bước 2: Tạo Link Tracking (System): * Hệ thống nhận link gốc, gọi API của Affiliate Network để tạo ra một Deep Link Affiliate.
* Bước 3: Chuyển hướng (User): Web hiển thị nút "Mua ngay". Người dùng bấm vào, hệ thống dùng Deep Link vừa tạo để mở thẳng App Shopee/Lazada vào đúng trang sản phẩm đó.
* Bước 4: Ghi nhận đơn (System): * Người dùng thanh toán xong.
  * Affiliate Network bắn Webhook trả về thông tin đơn hàng
  * Hệ thống tạo một đơn hoàn tiền trạng thái "Chờ duyệt" và hiển thị lên lịch sử của người dùng.
* Bước 5: Đối soát & Chia tiền (System):
* Sau 15 - 30 ngày (khi đơn hết hạn đổi trả), trạng thái đơn trên mạng lưới Affiliate chuyển thành "Thành công".
* Hệ thống tính toán: Lấy tổng hoa hồng x Tỉ lệ chia (VD: anh giữ 30%, trả user 70%).
* Cộng tiền vào "Số dư có thể rút" trong ví của người dùng.


Tôi có 2 use chính như sau hãy phân tích phát triển phần mềm website để kinh doanh kiếm tiền phần này sass chuẩn chuyên nghiệp 2026 với giao diện xịn. Hãy phần tích systemdessign với nextjs và .net. và phân tích thiết kế full hệ thống từ client đến admin chuẩn use case. tài liệu docs gồm usecase chuẩn đầy đủ hết tất cả kể cả wireframe nhé. Đặc biệt thiết kế giao diện phải đẹp chuẩn ui ux sass 2026 và phải đẹp nhiều banner quảng cáo nữa trông sang đẳng cấp hiện đại ui vượt thời đại luôn. Làm tài liệu đi nhé


