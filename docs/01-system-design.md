# VuaHoanTien — 01. Thiết kế hệ thống tổng thể

**Phiên bản:** 1.1  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** Kiến trúc tổng thể cho nền tảng cashback và voucher VuaHoanTien  
**Tham chiếu thuật ngữ:** `docs/00-glossary.md`

## Mục lục

- [1. Mục tiêu hệ thống](#1-mục-tiêu-hệ-thống)
- [2. Bối cảnh nghiệp vụ](#2-bối-cảnh-nghiệp-vụ)
- [3. Nguyên tắc kiến trúc](#3-nguyên-tắc-kiến-trúc)
- [4. Tech stack đề xuất](#4-tech-stack-đề-xuất)
- [5. C4 Context Diagram](#5-c4-context-diagram)
- [6. C4 Container Diagram](#6-c4-container-diagram)
- [7. Luồng dữ liệu trọng yếu](#7-luồng-dữ-liệu-trọng-yếu)
- [8. Mô hình bảo mật](#8-mô-hình-bảo-mật)
- [9. Mô hình dữ liệu và bất đồng bộ](#9-mô-hình-dữ-liệu-và-bất-đồng-bộ)
- [10. Khả năng vận hành](#10-khả-năng-vận-hành)
- [11. Rủi ro chính và cách kiểm soát](#11-rủi-ro-chính-và-cách-kiểm-soát)

## 1. Mục tiêu hệ thống

VuaHoanTien là nền tảng web kiếm tiền từ affiliate theo hai luồng cốt lõi:

1. **Luồng voucher**: ingest voucher nền từ AccessTrade / Ecomobi / MasOffer, kết hợp voucher premium từ CMS, ưu tiên hiển thị đúng nguồn và redirect qua affiliate link có tracking chuẩn.
2. **Luồng cashback**: người dùng dán URL sản phẩm thuộc marketplace whitelist, hệ thống chọn provider phù hợp để tạo deep link, ghi nhận chuyển đổi, đối soát và chia tiền về ví.

Mục tiêu của kiến trúc là:

- Tối ưu tốc độ ra mắt cho một sản phẩm single-tenant.
- Bảo vệ logic affiliate và ví tiền ở backend, không để lộ bí mật ra client.
- Đảm bảo đối soát chính xác, có thể điều tra khi phát sinh sai lệch.
- Cho phép admin vận hành đầy đủ voucher, banner, đơn hàng, rút tiền và reconciliation.

## 2. Bối cảnh nghiệp vụ

Hệ thống phục vụ ba nhóm tác nhân chính:

- **Khách vãng lai**: xem banner, xem voucher, dán URL sản phẩm để lấy link mua.
- **Người dùng đã đăng nhập**: theo dõi lịch sử cashback, ví, yêu cầu rút tiền, cập nhật hồ sơ.
- **Quản trị viên**: vận hành nội dung, đơn hàng, ví, rút tiền, cấu hình network và xử lý sai lệch.

Điểm khác biệt nghiệp vụ của VuaHoanTien là vừa cần một trải nghiệm UI đẹp, cao cấp, nhiều điểm chạm quảng cáo, vừa phải giữ độ chính xác rất cao ở phần tracking và ví. Vì vậy tài liệu phải tách bạch ba lớp khái niệm: `voucher_source`, `network_provider` và `marketplace`.

## 3. Nguyên tắc kiến trúc

- **BFF trước, backend domain phía sau**: Next.js phục vụ giao diện và BFF; .NET chịu trách nhiệm nghiệp vụ lõi.
- **Không cập nhật số dư trực tiếp**: mọi thay đổi ví đi qua double-entry ledger.
- **Idempotent ở mọi điểm ingest**: webhook, polling result, approve payout, mark paid.
- **Bảo mật theo nhiều lớp**: middleware chỉ là lớp đầu; quyền và tính hợp lệ phải được kiểm tra lại ở tầng dữ liệu.
- **Ưu tiên bất đồng bộ ở các luồng chậm**: polling, webhook processing, email, thông báo in-app.
- **Thiết kế cho vận hành**: mọi hành động admin quan trọng đều có audit log và correlation key.

## 4. Tech stack đề xuất

| Lớp | Công nghệ | Vai trò |
|---|---|---|
| Web App | Next.js 15 App Router | Render giao diện khách hàng và admin |
| BFF | Route Handlers trong Next.js | Xử lý session cookie, anti-CSRF, chuẩn hóa response |
| Backend Core | .NET 9 Web API | Domain, application, orchestrator cho voucher và cashback |
| Kiến trúc backend | Clean Architecture + CQRS | Giữ logic nghiệp vụ rõ ràng, dễ kiểm soát |
| Cơ sở dữ liệu | PostgreSQL | Lưu dữ liệu giao dịch, nội dung, audit |
| Cache tạm thời | Redis | Rate limiting, session trợ giúp, job locks |
| Hàng chờ | PostgreSQL outbox + worker | Đủ cho giai đoạn đầu, tránh thêm hạ tầng sớm |
| Realtime | SignalR | Cập nhật trạng thái đơn và ví trong ứng dụng |
| Email | Nhà cung cấp email giao dịch | Gửi OTP reset mật khẩu và thông báo quan trọng |
| Quan sát | OpenTelemetry + structured logging | Theo dõi request và background jobs |

## 5. C4 Context Diagram

```text
+------------------+         +-----------------------+
| Khách hàng       |<------->| VuaHoanTien Web App   |
| trình duyệt/web  |         | Next.js + BFF         |
+------------------+         +-----------+-----------+
                                            |
                                            v
                                +-----------+-----------+
                                | .NET Core Service     |
                                | Domain + API nội bộ   |
                                +-----+-----------+-----+
                                      |           |
                      +---------------+           +----------------+
                      v                                            v
         +------------+-----------+                    +------------+-----------+
         | PostgreSQL             |                    | Redis / Worker Locks   |
         | giao dịch + CMS + ví   |                    | rate limit + locks     |
         +------------+-----------+                    +------------+-----------+
                      |                                            |
                      v                                            v
          +------------+-----------+                    +------------+-----------+
          | Affiliate Providers    |                    | Marketplaces đích      |
          | AccessTrade/Ecomobi/   |                    | Shopee/Lazada/...      |
          | MasOffer               |                    |                        |
          +------------------------+                    +------------------------+
```

Giải thích:

- Người dùng chỉ giao tiếp với lớp Next.js/BFF.
- Backend .NET không mở trực tiếp cho trình duyệt công khai ngoài đường BFF nội bộ.
- Affiliate provider là lớp tích hợp tạo link, ingest voucher hoặc trả dữ liệu affiliate.
- Marketplace là đích đến nơi người dùng mua hàng thật sau khi redirect.

## 6. C4 Container Diagram

```text
+--------------------------------------------------------------------------------+
| Container: VuaHoanTien Platform                                                |
|                                                                                |
|  [Next.js Client App]                                                          |
|  - Trang chủ, trang voucher, trang cashback, ví, lịch sử, admin console       |
|  - Dark mode first, bento layout, banner premium                               |
|                                                                                |
|  [Next.js BFF]                                                                 |
|  - Session cookie                                                              |
|  - CSRF protection                                                             |
|  - Request shaping, response shaping                                           |
|  - Rate limiting theo IP, user, route                                          |
|                                                                                |
|  [Internal .NET API]                                                           |
|  - Auth, profile, voucher orchestration                                        |
|  - Voucher ingest + premium CMS orchestration                                  |
|  - Deep link and tracking service                                              |
|  - Network provider adapter                                                    |
|  - Cashback order service                                                      |
|  - Wallet & ledger service                                                     |
|  - Withdrawal service                                                          |
|  - Banner CMS service                                                          |
|  - Reconciliation service                                                      |
|                                                                                |
|  [Workers]                                                                     |
|  - Provider voucher sync worker                                                |
|  - Conversion polling worker                                                   |
|  - Provider callback processor                                                 |
|  - Outbox dispatcher                                                           |
|  - Notification dispatcher                                                     |
|                                                                                |
|  [PostgreSQL]                                                                  |
|  - Core tables, wallet ledger, audit logs, webhook events                      |
|                                                                                |
|  [Redis]                                                                       |
|  - Burst rate limit, anti-abuse counter, distributed lock                      |
+--------------------------------------------------------------------------------+
```

## 7. Luồng dữ liệu trọng yếu

### 7.1 Luồng voucher

1. Worker ingest voucher nền từ AccessTrade / Ecomobi / MasOffer; admin có thể tạo hoặc nâng cấp voucher premium qua CMS.
2. Voucher được chuẩn hóa theo `voucher_source`, `network_provider`, `marketplace`, thời gian hiệu lực và slot hiển thị.
3. Hệ thống de-duplicate theo quy tắc import và ưu tiên voucher CMS premium trước voucher API nền khi trùng campaign.
4. Người dùng mở trang danh sách voucher trong Next.js.
5. Khi bấm **Copy mã** hoặc **Dùng ngay**, BFF tạo `tracking_session` và `voucher_click`.
6. Backend tạo affiliate redirect/deep link qua provider adapter, lưu outbound payload và phục vụ mở app hoặc fallback web.
7. Analytics và reconciliation dùng chung chuỗi định danh `tracking_session_id`, `click_id`, `deep_link_request_id`, `affiliate_click_id` (nếu có).

### 7.2 Luồng cashback

1. Người dùng dán URL sản phẩm thuộc marketplace whitelist như Shopee hoặc Lazada.
2. BFF gọi backend để validate domain, làm sạch URL, xác định marketplace và chọn provider phù hợp.
3. Hệ thống lưu `tracking_sessions`, `deep_link_requests` và liên kết với `voucher_click` nếu luồng khởi phát từ voucher.
4. Người dùng bấm mua, ứng dụng đích được mở bằng deep link; nếu không mở được thì fallback web nhưng vẫn giữ tracking.
5. Provider callback hoặc polling trả dữ liệu chuyển đổi về backend theo adapter tương ứng.
6. Backend tạo hoặc cập nhật `cashback_orders` trạng thái chờ duyệt.
7. Khi dữ liệu affiliate được xác nhận đủ điều kiện, dịch vụ wallet tạo bút toán chuyển từ pending sang available.
8. Người dùng thấy số dư khả dụng tăng theo thời gian thực qua SignalR.

### 7.3 Luồng rút tiền

1. Người dùng mở ví và tạo yêu cầu rút.
2. Hệ thống khóa một phần số dư khả dụng bằng bút toán giữ chỗ.
3. Admin duyệt hoặc từ chối yêu cầu.
4. Khi đã chi trả thành công, hệ thống tạo bút toán debit chính thức và lưu mã giao dịch giải ngân.
5. Nếu thất bại, hệ thống đảo bút toán giữ chỗ và trả tiền lại số dư khả dụng.

## 8. Mô hình bảo mật

### 8.1 Xác thực và phiên đăng nhập

- Email và mật khẩu là phương thức đăng nhập duy nhất.
- JWT lưu trong httpOnly cookie, thời hạn ngắn; refresh token cũng ở cookie bảo mật.
- BFF đọc cookie và gọi backend nội bộ bằng token dịch vụ.
- Các route admin có thêm kiểm tra vai trò ở BFF và ở backend.

### 8.2 Chống lạm dụng

- Rate limit cho đăng nhập, tạo deep link, copy voucher, tạo yêu cầu rút tiền.
- Chặn domain không nằm trong whitelist khi người dùng dán URL sản phẩm.
- Fingerprint nhẹ theo thiết bị và IP để phát hiện click bất thường.
- Quy tắc risk cho rút tiền: tài khoản mới, nhiều yêu cầu liên tiếp, thay đổi ví nhận tiền liên tục.

### 8.3 Bảo vệ dữ liệu

- Không lưu secrets trong frontend.
- Mã hóa dữ liệu nhạy cảm như số tài khoản nhận tiền ở mức lưu trữ.
- Audit log cho mọi thao tác admin: tạo voucher, sửa banner, duyệt rút tiền, sửa trạng thái đơn.
- Webhook có chữ ký xác thực, idempotency và lưu payload gốc để điều tra.

## 9. Mô hình dữ liệu và bất đồng bộ

- PostgreSQL là nguồn sự thật duy nhất cho dữ liệu giao dịch.
- Redis chỉ giữ cache tạm, lock và counter chống lạm dụng.
- Outbox chạy trong cùng giao dịch với cập nhật nghiệp vụ để tránh mất sự kiện.
- Provider polling chạy theo cửa sổ thời gian và khóa theo provider account.
- Callback/webhook từ provider đi vào bảng `webhook_events` trước, sau đó mới xử lý nghiệp vụ.
- Không có cron cập nhật số dư trực tiếp; số dư là kết quả tổng hợp từ ledger.

## 10. Khả năng vận hành

### 10.1 Quan sát

- Mỗi request có correlation id.
- Mỗi order, withdrawal và webhook có public identifier riêng.
- Dashboard vận hành cần có số liệu: tạo link thành công theo provider, click voucher theo source, đơn chờ duyệt, mismatch, chi trả thất bại.

### 10.2 Sao lưu và phục hồi

- PostgreSQL backup hàng ngày, giữ thêm snapshot ngắn hạn trước các thay đổi cấu hình lớn.
- Audit log và ledger là dữ liệu không được chỉnh sửa tay trong cơ sở dữ liệu sản xuất.

### 10.3 Năng lực mở rộng thực tế

- Bắt đầu bằng một database và một backend service là hợp lý cho single-tenant.
- Scale theo chiều ngang ở Next.js và .NET nếu lưu session đúng cách.
- Tách worker thành process riêng để polling và webhook không tranh tài nguyên với request người dùng.

## 11. Rủi ro chính và cách kiểm soát

| Rủi ro | Tác động | Kiểm soát thiết kế |
|---|---|---|
| Provider callback hoặc polling không ổn định | Chậm cập nhật đơn | Adapter theo provider, retry có giới hạn, cửa sổ truy xuất chồng lấn |
| Provider gửi callback trùng | Ghi nhận đơn nhiều lần | Idempotency key + unique index |
| Deep link lỗi hoặc app đích không mở | Mất chuyển đổi | Fallback sang mobile web với tracking session giữ nguyên |
| Voucher API và CMS xung đột ưu tiên | Hiển thị sai mã cần đẩy | Quy tắc `voucher_source` + `promotion_slot` + de-dup rõ ràng |
| User rút tiền trước khi đơn ổn định | Thất thoát tiền | Tách pending balance và available balance |
| Admin thao tác nhầm trạng thái | Sai lệch số dư | Workflow rõ ràng, audit log, xác nhận hai bước |
| Click spam trên voucher | Méo analytics, tăng tải | Rate limit, risk rule, làm sạch traffic |
| Lộ logic backend qua client | Rủi ro bảo mật | BFF pattern, nội bộ hóa .NET API |
| Chỉ kiểm tra auth ở middleware | Bỏ sót quyền truy cập | Verify thêm ở application service và DAL |
| Mismatch dữ liệu network | Chậm chi trả | Màn hình reconciliation chuyên dụng và ghi chú xử lý |

## Kết luận kiến trúc

Thiết kế này giúp **VuaHoanTien** cân bằng ba mục tiêu: trải nghiệm SaaS 2026 đẹp và sang, kiểm soát tracking affiliate chính xác, và vận hành ví tiền an toàn. Next.js 15 đóng vai trò trải nghiệm và BFF, còn .NET 9 giữ toàn bộ nghiệp vụ lõi, từ deep link, cashback order cho đến double-entry ledger và withdrawal.
