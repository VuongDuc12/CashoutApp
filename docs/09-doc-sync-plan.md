# VuaHoanTien — 09. Kế hoạch đồng bộ tài liệu theo use case voucher và tracking

**Phiên bản:** 1.0  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** Ghi nhận phạm vi ảnh hưởng và checklist đồng bộ sau khi `docs/02-use-cases.md` được cập nhật theo mô hình voucher API/CMS và tracking chain mới.

## 1. Tóm tắt thay đổi nguồn gốc

Từ use case mới, bộ tài liệu hệ thống phải thống nhất 5 quyết định nghiệp vụ sau:

1. Voucher có hai nguồn chuẩn: `API` và `CMS`.
2. Voucher API đi qua các network provider như **AccessTrade / Ecomobi / MasOffer**.
3. Voucher CMS premium được ưu tiên hiển thị trước voucher API nền khi trùng campaign hoặc slot quan trọng.
4. Tracking chain chuẩn là `tracking_session` → `voucher_click` → `deep_link_request` → `outbound redirect` → `affiliate callback/polling` → `reconciliation`.
5. `network_provider` và `marketplace` là hai khái niệm khác nhau, phải tách riêng ở mọi tài liệu, schema và API.

## 2. Phạm vi tài liệu bị ảnh hưởng

| Tài liệu | Mức ảnh hưởng | Nội dung phải đồng bộ |
|---|---|---|
| `docs/00-glossary.md` | Cao | Thuật ngữ provider, marketplace, voucher_source, premium/API |
| `docs/01-system-design.md` | Cao | Luồng voucher, cashback, context/container, risk, vận hành |
| `docs/02-use-cases.md` | Rất cao | Nguồn use case chuẩn mới |
| `docs/03-database-schema.md` | Cao | Thêm trường và bảng phục vụ source, import batch, tracking chain |
| `docs/04-api-specification.md` | Cao | Request/response và endpoint admin import/sync theo provider |
| `docs/05-wireframes-client.md` | Trung bình | Badge premium/API, trust card tracking |
| `docs/06-wireframes-admin.md` | Cao | Filter source/provider, panel điều tra click chain |
| `docs/07-integration-specs.md` | Rất cao | Chuyển từ mô hình Shopee/Lazada-only sang provider + marketplace |
| `docs/08-ui-design-system.md` | Thấp | Badge source, trust card và content guideline |

## 3. Checklist đồng bộ bắt buộc

- [x] Chuẩn hóa terminology `network_provider` vs `marketplace`.
- [x] Bổ sung `voucher_source` vào use case, system design, schema, API và wireframe.
- [x] Bổ sung logic ưu tiên hiển thị **CMS premium trước API** ở tài liệu nghiệp vụ và kiến trúc.
- [x] Chuẩn hóa tracking chain với các định danh `tracking_session_id`, `click_id`, `deep_link_request_id`, `affiliate_click_id`.
- [x] Thêm khái niệm import batch cho voucher ingest từ provider.
- [x] Cập nhật admin flow để lọc, sync và reconciliation theo provider/source.

## 4. Thứ tự cập nhật khuyến nghị

1. `02-use-cases` làm nguồn chuẩn nghiệp vụ.
2. `00-glossary` để cố định từ vựng dùng chung.
3. `01-system-design` và `07-integration-specs` để cập nhật mô hình vận hành.
4. `03-database-schema` và `04-api-specification` để khóa lại contract kỹ thuật.
5. `05/06/08` để đồng bộ UI, wireframe và guideline hiển thị.

## 5. Giả định đã dùng trong đợt đồng bộ này

- AccessTrade, Ecomobi, MasOffer được mô hình hóa là **provider layer**.
- Shopee và Lazada tiếp tục là **marketplace whitelist chính** trong giai đoạn hiện tại.
- `click_id` là định danh business-level được expose từ bản ghi click event; ở tài liệu schema có thể được biểu diễn qua `public_id` hoặc field tương đương khi triển khai thực tế.
- Callback hay polling là khả năng tùy provider; domain nội bộ không được phụ thuộc trực tiếp vào một cơ chế duy nhất.

## 6. Definition of done cho bộ docs

Bộ tài liệu được xem là đồng bộ khi:

- Không còn tài liệu nào dùng Shopee/Lazada như tên gọi mặc định của `affiliate network`.
- Tài liệu kỹ thuật nào có tracking đều thể hiện được chuỗi click → deep link → redirect → conversion.
- Mọi tài liệu admin đều lọc và điều tra được theo `voucher_source`, `network_provider`, `marketplace`.
- Không còn chỗ nào dùng `source` mơ hồ thay cho `voucher_source`.

Tài liệu này đóng vai trò checklist điều phối để các lần chỉnh sửa sau không làm lệch lại mô hình use case đã chuẩn hóa.
