# VuaHoanTien — 07. Đặc tả tích hợp network provider và marketplace

**Phiên bản:** 1.1  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** Tích hợp provider API, deep link, callback/polling, voucher ingest và reconciliation cho VuaHoanTien  
**Tham chiếu thuật ngữ:** `docs/00-glossary.md`

## Mục lục

- [1. Mục tiêu tích hợp](#1-mục-tiêu-tích-hợp)
- [2. Nguyên tắc chung](#2-nguyên-tắc-chung)
- [3. Tích hợp network provider (AccessTrade / Ecomobi / MasOffer)](#3-tích-hợp-network-provider-accesstrade--ecomobi--masoffer)
- [4. Tích hợp marketplace đích (Shopee / Lazada)](#4-tích-hợp-marketplace-đích-shopee--lazada)
- [5. Chuẩn correlation và tracking](#5-chuẩn-correlation-và-tracking)
- [6. Quy trình xử lý lỗi](#6-quy-trình-xử-lý-lỗi)
- [7. Quy trình reconciliation](#7-quy-trình-reconciliation)
- [8. Yêu cầu vận hành và giám sát](#8-yêu-cầu-vận-hành-và-giám-sát)

## 1. Mục tiêu tích hợp

VuaHoanTien phụ thuộc vào network provider như AccessTrade, Ecomobi, MasOffer và vào marketplace đích như Shopee, Lazada để:

- Ingest voucher nền số lượng lớn và chuẩn hóa dữ liệu import.
- Tạo deep link hoặc short link đúng chuẩn affiliate.
- Ghi nhận click và chuyển đổi có thể đối soát.
- Đồng bộ trạng thái đơn để tính cashback và chia tiền an toàn.

Tích hợp phải đủ chắc để phục vụ cả client flow lẫn admin reconciliation.

## 2. Nguyên tắc chung

- Không gọi trực tiếp affiliate API từ trình duyệt.
- Tất cả request outbound đi qua backend .NET.
- Secrets của từng network được lưu an toàn ở backend.
- Mọi request outbound và inbound đều gắn correlation key.
- Luôn tách riêng `network_provider_code` và `marketplace_code` trong dữ liệu lưu trữ và API.
- Luồng voucher phải giữ được `voucher_source` (API hoặc CMS) tới tận reconciliation.
- Mọi event từ network phải được lưu raw payload trước khi xử lý nghiệp vụ.
- Nếu không xác định được user từ payload, bản ghi bị đưa vào hàng chờ điều tra thay vì bỏ qua.

## 3. Tích hợp network provider (AccessTrade / Ecomobi / MasOffer)

### 3.1 Trách nhiệm của provider adapter

- Mỗi provider adapter chịu trách nhiệm xác thực, mapping field và chuẩn hóa response về schema nội bộ.
- Provider có thể hỗ trợ một hoặc nhiều khả năng: ingest voucher, tạo deep link, callback chuyển đổi, polling báo cáo.
- VuaHoanTien không giả định mọi provider có cùng cơ chế callback; adapter phải ẩn khác biệt đó khỏi domain layer.

### 3.2 Luồng ingest voucher nền

1. Worker hoặc admin kích hoạt import batch cho provider cụ thể.
2. Backend gọi API voucher của provider và nhận danh sách voucher gốc.
3. Hệ thống chuẩn hóa merchant, marketplace, thời gian hiệu lực và discount summary.
4. Áp dụng de-dup theo hash nghiệp vụ (merchant + code + valid_from).
5. Lưu `voucher_import_batches` và gắn `voucher_source=API` cho voucher được import.
6. Nếu có voucher CMS premium cùng campaign, hệ thống vẫn giữ bản CMS ở vị trí ưu tiên hiển thị.

### 3.3 Luồng tạo deep link qua provider

1. BFF hoặc backend nhận nhu cầu tạo redirect/deep link từ voucher flow hoặc cashback flow.
2. Domain layer xác định `marketplace_code`, `network_provider_code`, `voucher_source` và correlation key.
3. Adapter provider gọi API tạo link hoặc affiliate redirect tương ứng.
4. Hệ thống lưu `tracking_sessions`, `voucher_click_events` và `deep_link_requests`.
5. Outbound payload (affiliate URL + headers) được lưu để phục vụ reconciliation.
6. Response trả về cho client luôn gồm `tracking_session_id`, `deep_link_request_id` và `affiliate_click_id` nếu provider trả ngay.

### 3.4 Luồng ingest callback hoặc polling từ provider

1. Provider gửi callback hoặc worker polling lấy batch chuyển đổi theo năng lực tích hợp thực tế.
2. Payload gốc được lưu vào `webhook_events` hoặc batch log trước khi vào domain logic.
3. Adapter chuẩn hóa về schema nội bộ và tìm `tracking_sessions`, `voucher_click_events`, `deep_link_requests`.
4. Nếu đã có order tương ứng thì cập nhật idempotent; nếu chưa có thì tạo `cashback_orders`.
5. Nếu thiếu correlation key hoặc không map được chuỗi click, sự kiện bị đưa vào hàng `needs_review`.

## 4. Tích hợp marketplace đích (Shopee / Lazada)

### 4.1 Vai trò của marketplace

- Marketplace là đích mua hàng thật của người dùng sau khi được redirect qua affiliate link.
- Trong phạm vi hiện tại, whitelist chính tập trung vào Shopee và Lazada.
- Marketplace không nhất thiết trùng với provider; một provider có thể phục vụ nhiều marketplace.

### 4.2 Quy tắc validate URL marketplace

1. URL đầu vào phải thuộc domain whitelist của marketplace hỗ trợ.
2. Backend chuẩn hóa URL, bóc tách nhận diện merchant hoặc product nếu có.
3. Nếu marketplace không có provider phù hợp đang hoạt động, request bị từ chối sớm.
4. Tất cả request hợp lệ đều phải gắn `marketplace_code` từ đầu luồng.

### 4.3 Quy tắc mở outbound sang app hoặc web

1. Client luôn ưu tiên mở app đích nếu thiết bị hỗ trợ.
2. Nếu app không mở được, hệ thống fallback sang mobile web nhưng giữ nguyên affiliate tracking.
3. `redirect_status` phải được lưu ở `voucher_click_events` hoặc event tương đương để hỗ trợ reconciliation.

### 4.4 Lưu ý riêng cho marketplace

- URL sản phẩm hợp lệ chưa chắc đã có offer affiliate hợp lệ ở provider đang chọn.
- Một số marketplace có thể mở app tốt hơn web; nhưng tracking phải giữ ổn định ở cả hai trường hợp.
- Không cập nhật trực tiếp ví từ luồng callback/polling đồng bộ.

## 5. Chuẩn correlation và tracking

### 5.1 Correlation key chuẩn

Correlation key nội bộ của VuaHoanTien nên gồm các thành phần nghiệp vụ có thể tách được:

- Mã phiên tracking
- Mã người dùng công khai hoặc guest token
- Nguồn traffic
- Loại flow: voucher hoặc cashback
- Provider và marketplace nếu cần phân biệt ở downstream reconciliation

Mục tiêu là giúp admin truy vết từ click → deep link request → order → ledger entries.

### 5.2 Các bảng phải chia sẻ cùng định danh

- `tracking_sessions`
- `voucher_click_events`
- `deep_link_requests`
- `cashback_orders`
- `webhook_events`
- `reconciliation_batches`

### 5.3 Kịch bản fallback

- Nếu app marketplace không mở được, hệ thống chuyển sang mobile web có cùng affiliate tracking.
- Nếu user chưa đăng nhập khi click, hệ thống vẫn tạo session guest; khi user đăng nhập sau đó chỉ dùng để hỗ trợ điều tra, không nối tùy tiện.
- Nếu URL sản phẩm không hợp lệ, trả lỗi rõ ràng và không gửi request ra network.

## 6. Quy trình xử lý lỗi

| Tình huống | Cách phát hiện | Cách xử lý |
|---|---|---|
| API provider tạo link timeout | Outbound request quá SLA | Retry ngắn có giới hạn, sau đó trả lỗi mềm |
| API provider trả URL rỗng | Validate response lỗi | Lưu event lỗi, không tạo request hoàn chỉnh |
| Callback hoặc batch thiếu trường tương quan | Payload không map được | Đưa vào `needs_review`, không bỏ qua |
| Polling trả đơn trùng | Unique key va chạm | Bỏ qua an toàn, tăng counter duplicate |
| Provider từ chối xác thực | Signature invalid | Ghi log cảnh báo bảo mật, không nhận dữ liệu |
| Sản phẩm không hỗ trợ affiliate | Response chỉ ra offer không hợp lệ | Trả thông báo rõ cho user, không hiển thị cashback dự kiến |
| Partial refund sau khi đã approve | Order amount giảm | Sinh adjustment và bút toán đảo chiều một phần |

## 7. Quy trình reconciliation

### 7.1 Batch reconciliation

1. Admin hoặc scheduler tạo `reconciliation_batch` theo provider và khoảng thời gian.
2. Hệ thống nạp dữ liệu provider và dữ liệu nội bộ vào cùng một tập so sánh.
3. So khớp theo order external id, correlation key, amount, trạng thái và chuỗi tracking liên quan.
4. Gắn nhãn từng dòng: `matched`, `amount_mismatch`, `missing_internal`, `missing_network`, `status_mismatch`.
5. Admin mở giao diện mismatch để xử lý từng trường hợp.

### 7.2 Quy tắc xử lý mismatch

- `missing_internal`: tạo bản ghi điều tra, không tự tạo cashback order nếu thiếu nền tảng chứng cứ.
- `missing_network`: giữ nguyên trạng thái nội bộ nhưng đưa vào cảnh báo.
- `amount_mismatch`: yêu cầu admin xác minh với raw payload, click history, `voucher_source` và `affiliate_click_id`.
- `status_mismatch`: ưu tiên dữ liệu provider nhưng phải lưu giải thích thay đổi.

## 8. Yêu cầu vận hành và giám sát

- Dashboard vận hành phải có số lượng deep link tạo thành công theo từng provider và marketplace.
- Theo dõi tỷ lệ callback/polling hợp lệ, số event lặp, số mismatch đang mở.
- Cảnh báo khi import voucher hoặc conversion sync thất bại liên tiếp vượt ngưỡng.
- Cảnh báo khi provider nhận lỗi xác thực vượt ngưỡng.
- Lưu lại lịch sử thay đổi cấu hình provider để điều tra khi tracking tụt mạnh.

## Kết luận tích hợp

Tích hợp của **VuaHoanTien** phải được thiết kế theo tư duy “tracking trước, payout sau”. Dù provider nào được dùng để ingest voucher hoặc tạo link, toàn bộ dữ liệu cuối cùng vẫn phải hội tụ về cùng một chuẩn correlation, `voucher_source`, `network_provider_code` và `marketplace_code` để đội vận hành xử lý reconciliation chính xác.
