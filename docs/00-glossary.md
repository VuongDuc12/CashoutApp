# VuaHoanTien — 00. Bảng thuật ngữ chuẩn

**Phiên bản:** 1.1  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** Chuẩn hóa thuật ngữ dùng chung cho toàn bộ bộ tài liệu VuaHoanTien  
**Tài liệu liên quan:** `docs/01-system-design.md`, `docs/02-use-cases.md`, `docs/03-database-schema.md`, `docs/04-api-specification.md`

## Mục lục

- [1. Mục tiêu tài liệu](#1-mục-tiêu-tài-liệu)
- [2. Quy ước sử dụng thuật ngữ](#2-quy-ước-sử-dụng-thuật-ngữ)
- [3. Bảng thuật ngữ nghiệp vụ và kỹ thuật](#3-bảng-thuật-ngữ-nghiệp-vụ-và-kỹ-thuật)
- [4. Quy ước đặt tên thống nhất](#4-quy-ước-đặt-tên-thống-nhất)
- [5. Thuật ngữ không sử dụng trong phạm vi hiện tại](#5-thuật-ngữ-không-sử-dụng-trong-phạm-vi-hiện-tại)

## 1. Mục tiêu tài liệu

Tài liệu này là chuẩn tham chiếu thuật ngữ cho toàn bộ hệ thống **VuaHoanTien**.
Mục tiêu là để đội sản phẩm, thiết kế, backend, frontend, QA và vận hành dùng cùng một cách gọi tên.
Mọi tài liệu còn lại trong thư mục `docs/` đều phải ưu tiên các thuật ngữ tại đây.

## 2. Quy ước sử dụng thuật ngữ

- Luôn dùng tên thương hiệu là **VuaHoanTien** hoặc **Vua Hoàn Tiền**.
- Ngôn ngữ chính là tiếng Việt, nhưng giữ lại tên tiếng Anh chuẩn khi cần đối chiếu kỹ thuật.
- Với thực thể dữ liệu, dùng số ít trong mô tả khái niệm và số nhiều trong tên bảng.
- Với trạng thái, dùng tiếng Anh ở mức dữ liệu và tiếng Việt ở mức giao diện.
- Với tiền tệ, toàn hệ thống chỉ dùng **VND** và lưu ở dạng số nguyên.
- Với affiliate tracking, phân biệt rõ **network provider** (AccessTrade, Ecomobi, MasOffer) và **marketplace đích** (ví dụ Shopee, Lazada).

## 3. Bảng thuật ngữ nghiệp vụ và kỹ thuật

| Thuật ngữ tiếng Việt | Thuật ngữ tiếng Anh | Định nghĩa ngắn | Cách dùng trong VuaHoanTien |
|---|---|---|---|
| Tiếp thị liên kết | Affiliate Marketing | Mô hình kiếm tiền dựa trên đơn hàng được ghi nhận qua liên kết theo dõi | Nguồn doanh thu cốt lõi của nền tảng |
| Nhà cung cấp mạng liên kết | Network Provider | Đối tác cung cấp API voucher, deep link hoặc dữ liệu affiliate | Bao gồm AccessTrade, Ecomobi, MasOffer |
| Sàn đích | Marketplace | Nơi người dùng thực hiện mua hàng thật sau khi được redirect | Giai đoạn hiện tại tập trung vào Shopee và Lazada |
| Mã giảm giá | Voucher | Mã ưu đãi dùng tại bước thanh toán | Hiển thị ở khu vực săn mã |
| Nguồn voucher | Voucher Source | Nguồn gốc nghiệp vụ của voucher | Chỉ dùng hai giá trị: `API` hoặc `CMS` |
| Voucher nền từ API | API Voucher | Voucher ingest tự động từ provider | Dùng để phủ số lượng lớn, không mặc định là premium |
| Voucher premium CMS | CMS Premium Voucher | Voucher do admin tạo hoặc nâng cấp thủ công | Được ưu tiên hiển thị và có thể gắn slot nổi bật |
| Phiếu ưu đãi | Coupon | Cách gọi tương đương với voucher | Dùng trong nội dung marketing nhưng không dùng làm tên bảng |
| Hoàn tiền | Cashback | Khoản chia lại cho người dùng từ hoa hồng affiliate | Luồng doanh thu chia sẻ cho người dùng |
| Hoa hồng | Commission | Doanh thu nhận từ hệ tích hợp affiliate khi đơn thành công | Dùng làm cơ sở tính tỷ lệ chia |
| Liên kết sâu | Deep Link | Liên kết mở đúng trang sản phẩm trong app hoặc web đích | Tạo ra khi người dùng dán URL sản phẩm |
| Liên kết rút gọn | Short Link | Link đã được mạng lưới hoặc hệ thống rút gọn | Áp dụng cho banner, voucher và chiến dịch |
| Chuyển hướng theo dõi | Tracking Redirect | Bước điều hướng qua link affiliate để gắn định danh | Xảy ra khi người dùng bấm mua hoặc dùng mã |
| Cookie liên kết | Affiliate Cookie | Dấu vết theo dõi ở phía trình duyệt hoặc app đích | Phục vụ ghi nhận đơn hàng |
| Phiên theo dõi | Tracking Session | Phiên tương tác dùng để nối hành vi click với chuyển đổi | Lưu cùng nguồn truy cập và thiết bị |
| Lượt bấm mã | Voucher Click | Sự kiện người dùng bấm copy mã hoặc dùng ngay | Ghi nhận cho analytics và đối soát |
| Yêu cầu tạo link | Deep Link Request | Bản ghi khi người dùng gửi URL sản phẩm để hệ thống tạo link affiliate | Dùng để theo dõi tỷ lệ tạo link thành công |
| Đơn hoàn tiền | Cashback Order | Bản ghi nghiệp vụ đại diện cho đơn hàng có khả năng hoàn tiền | Hiển thị trong lịch sử người dùng |
| Đơn chờ duyệt | Pending Order | Đơn chưa đủ điều kiện ghi nhận số dư rút được | Trạng thái trung gian sau khi có chuyển đổi |
| Đơn đủ điều kiện | Approved Order | Đơn đã qua đối soát và được chấp nhận trả cashback | Tạo bút toán chuyển tiền khả dụng |
| Đơn bị từ chối | Rejected Order | Đơn không hợp lệ hoặc bị mạng lưới từ chối | Không cộng tiền cho người dùng |
| Đơn bị hoàn | Reversed Order | Đơn đã từng được ghi nhận nhưng sau đó bị điều chỉnh âm | Sinh bút toán đảo chiều |
| Đối soát | Reconciliation | Quá trình so sánh dữ liệu nội bộ với dữ liệu mạng lưới | Thực hiện theo lịch và khi admin chạy tay |
| Sai lệch đối soát | Reconciliation Mismatch | Tình huống dữ liệu hai bên không khớp | Có màn hình xử lý riêng trong admin |
| Ví người dùng | Wallet Account | Tài khoản số dư nghiệp vụ của người dùng | Không phải ví điện tử bên thứ ba |
| Số dư chờ duyệt | Pending Balance | Tiền dự kiến nhận nhưng chưa rút được | Tăng khi đơn đang chờ xác nhận |
| Số dư khả dụng | Available Balance | Tiền người dùng có thể yêu cầu rút | Tăng khi đơn được duyệt |
| Sổ cái kép | Double-entry Ledger | Cơ chế ghi nhận tiền bằng bút toán đối ứng, không cập nhật số dư trực tiếp | Bắt buộc cho luồng ví VuaHoanTien |
| Bút toán | Ledger Entry | Dòng ghi nhận thay đổi giá trị trong sổ cái | Dùng cho cộng, trừ, đảo chiều, giải ngân |
| Yêu cầu rút tiền | Withdrawal Request | Đề nghị người dùng rút số dư khả dụng | Đi qua các bước duyệt, chi trả, hoàn tất |
| Giải ngân | Disbursement | Hành động chuyển tiền ra ngoài hệ thống | Có thể qua ngân hàng, MoMo hoặc ZaloPay |
| Chuyển khoản ngân hàng | Bank Transfer | Kênh thanh toán rút tiền qua tài khoản ngân hàng | Kênh mặc định |
| Ví điện tử | E-wallet | Kênh chi trả qua MoMo hoặc ZaloPay | Chỉ dùng cho rút tiền |
| Bảng quảng cáo | Banner | Thành phần hiển thị khuyến mại, chiến dịch hoặc mã nổi bật | Quản trị từ CMS nội bộ |
| Khu vực nổi bật | Hero Banner | Banner chính tại đầu trang | Ưu tiên cho chiến dịch lớn |
| Hệ quản trị nội dung nhẹ | Light CMS | Nhóm tính năng quản lý banner, khối nội dung và liên kết | Không phải CMS tổng quát |
| Nhật ký kiểm toán | Audit Log | Dấu vết hành động quản trị viên và thao tác hệ thống quan trọng | Dùng cho điều tra và tuân thủ |
| Sự kiện webhook | Webhook Event | Payload callback gửi từ provider hoặc đối tác bên ngoài vào endpoint hệ thống | Phải lưu raw payload trước khi xử lý |
| Polling chuyển đổi | Conversion Polling | Tiến trình chủ động gọi API để lấy dữ liệu chuyển đổi hoặc batch báo cáo | Tùy theo khả năng của từng provider |
| Khóa idempotency | Idempotency Key | Khóa ngăn xử lý trùng một yêu cầu hoặc một webhook | Dùng ở API và ingestion pipeline |
| Hộp thư đi giao dịch | Transactional Outbox | Mẫu đảm bảo phát sự kiện sau khi ghi dữ liệu thành công | Dùng cho thông báo nội bộ và tích hợp |
| BFF | Backend for Frontend | Lớp API ở phía Next.js chuyên phục vụ giao diện web | Che giấu backend .NET khỏi trình duyệt |
| Kiến trúc sạch | Clean Architecture | Cách tổ chức backend tách domain, application, infrastructure | Áp dụng cho .NET API |
| CQRS | Command Query Responsibility Segregation | Tách luồng ghi và đọc dữ liệu | Dùng ở tầng ứng dụng |
| Route group | Route Group | Cách phân tách khu vực client và admin trong Next.js | Giữ layout và quyền truy cập rõ ràng |
| Giao diện tối | Dark Mode | Chế độ màu tối của sản phẩm | Là chế độ ưu tiên về thẩm mỹ |
| Bento Grid | Bento Grid | Bố cục thẻ nhiều kích cỡ, giàu điểm nhấn | Phong cách UI chính cho trang chủ |
| Glassmorphism chọn lọc | Selective Glassmorphism | Hiệu ứng nền mờ chỉ áp dụng ở vùng cần nhấn mạnh | Dùng cho modal, top card, overlay |
| Chuyển động lò xo | Spring Motion | Chuyển động có độ đàn hồi tự nhiên | Áp dụng cho micro interaction |
| Dòng đời đơn hàng | Order Lifecycle | Chuỗi trạng thái từ ghi nhận đến chi trả | Chuẩn hóa xuyên suốt tài liệu |
| Nguồn truy cập | Traffic Source | Kênh mà người dùng đến nền tảng | Dùng cho phân tích marketing nội bộ |
| Kịch bản chống lạm dụng | Abuse Prevention | Bộ quy tắc chống spam, click ảo, rút tiền bất thường | Có trong system design và API spec |
| Danh sách trắng tên miền | Domain Whitelist | Danh sách domain sản phẩm được phép tạo deep link | Ngăn URL giả mạo hoặc độc hại |
| Xác minh ở DAL | DAL-level Verification | Kiểm tra quyền và dữ liệu ngay tại lớp truy cập dữ liệu | Không chỉ tin middleware |
| Màn hình điều hành | Dashboard | Giao diện tổng hợp số liệu chính cho admin | Mở đầu khu vực quản trị |
| Luồng thay thế | Alternate Flow | Nhánh rẽ ngoài luồng chính của use case | Bắt buộc trong tài liệu use case |
| Điều kiện tiên quyết | Preconditions | Điều kiện phải có trước khi use case chạy | Dùng trong mọi use case |
| Điều kiện sau cùng | Postconditions | Kết quả chắc chắn sau khi use case hoàn tất | Dùng trong mọi use case |
| Quy tắc rủi ro | Risk Rule | Điều kiện chặn, cảnh báo hoặc đưa vào hàng chờ duyệt | Áp dụng cho rút tiền và link bất thường |
| Tỷ lệ chia | Payout Ratio | Tỷ lệ chia hoa hồng giữa nền tảng và người dùng | Do admin cấu hình ở mức hệ thống |
| Độ trễ chấp nhận được | SLA | Mức thời gian mục tiêu cho xử lý và phản hồi | Dùng trong yêu cầu vận hành |
| Bản ghi thông báo | Notification Event | Sự kiện tạo thông báo trong ứng dụng hoặc email | Dùng cho thông báo nội bộ và email quan trọng |
| Trạng thái công bố | Publish State | Tình trạng hiển thị của banner hoặc voucher | Có thể là draft, scheduled, active, paused |
| Hàng chờ xử lý | Processing Queue | Nhóm công việc bất đồng bộ đang chờ thực thi | Áp dụng cho polling, webhook, email |
| Khóa tương quan | Correlation Key | Giá trị dùng để nối sự kiện click, order, payout qua nhiều hệ thống | Dùng xuyên suốt giữa tracking session, click, deep link và reconciliation |
| Định danh công khai | Public Identifier | Mã hiển thị ra giao diện thay vì lộ ID nội bộ | Dùng cho order code và voucher slug |

## 4. Quy ước đặt tên thống nhất

- Tên sản phẩm hiển thị: **VuaHoanTien**.
- Tên khu vực người dùng: **Khu vực khách hàng**.
- Tên khu vực quản trị: **Admin Console**.
- Tên bảng dữ liệu dùng số nhiều, ví dụ: `users`, `cashback_orders`, `ledger_entries`.
- Tên API dùng tiền tố `/api/` cho BFF và `/internal/` cho gọi nội bộ nếu có mô tả.
- Tên use case theo mẫu `UC-Cxx` cho client và `UC-Axx` cho admin.
- Tên wireframe theo mẫu `WF-Cxx` cho client và `WF-Axx` cho admin.
- Trạng thái hiển thị tiếng Việt, trạng thái lưu trữ tiếng Anh để thuận tiện đối soát.

## 5. Thuật ngữ không sử dụng trong phạm vi hiện tại

- Không dùng thuật ngữ đa tiền tệ vì VuaHoanTien chỉ hỗ trợ VND.
- Không dùng các cách gọi đăng nhập ngoài email và mật khẩu trong tài liệu hiện tại.
- Không mở rộng thêm marketplace ngoài Shopee và Lazada trong bộ tài liệu hiện tại, trừ khi có use case mới.
- Không dùng thuật ngữ thông báo đẩy trên thiết bị vì phạm vi hiện tại chỉ có in-app và email.
- Không dùng ngôn ngữ chung chung như “enterprise-grade”, “future-ready”, “microservices-ready”.

Tài liệu này là mốc tham chiếu bắt buộc khi viết mới hoặc cập nhật các tài liệu khác trong bộ tài liệu **VuaHoanTien**.
