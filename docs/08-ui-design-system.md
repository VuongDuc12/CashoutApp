# VuaHoanTien — 08. Hệ thống thiết kế UI/UX

**Phiên bản:** 1.1  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** Design tokens, nguyên tắc giao diện, component inventory cho VuaHoanTien  
**Tham chiếu thuật ngữ:** `docs/00-glossary.md`

## Mục lục

- [1. Mục tiêu thẩm mỹ](#1-mục-tiêu-thẩm-mỹ)
- [2. Nguyên tắc trải nghiệm](#2-nguyên-tắc-trải-nghiệm)
- [3. Bảng màu thương hiệu](#3-bảng-màu-thương-hiệu)
- [4. Typography](#4-typography)
- [5. Spacing và radius](#5-spacing-và-radius)
- [6. Elevation và glass](#6-elevation-và-glass)
- [7. Motion tokens](#7-motion-tokens)
- [8. Component inventory](#8-component-inventory)
- [9. Mẫu nội dung quảng cáo](#9-mẫu-nội-dung-quảng-cáo)
- [10. Quy tắc accessibility](#10-quy-tắc-accessibility)

## 1. Mục tiêu thẩm mỹ

VuaHoanTien cần thể hiện cảm giác **cao cấp, hiện đại, giàu chuyển động nhưng không ồn ào**.
Giao diện phải đủ đẹp để người dùng tin tưởng một nền tảng kiếm tiền, đồng thời đủ rõ ràng để họ thao tác nhanh khi săn voucher hoặc rút tiền.

Ba tính từ cốt lõi:

- **Sang**: bề mặt tối sâu, điểm nhấn ánh kim, card nhiều lớp.
- **Nhanh**: CTA rõ, phân cấp thông tin mạnh, tránh rối mắt.
- **Đáng tin**: màu trạng thái ví và đơn hàng phải minh bạch, dễ hiểu.

## 2. Nguyên tắc trải nghiệm

- Dark mode là chế độ mặc định cho toàn bộ VuaHoanTien.
- Bố cục ưu tiên **bento grid** cho trang tổng quan, banner và khu vực khuyến mại.
- Chỉ dùng glassmorphism ở hero, modal, promo rail và stat card quan trọng.
- CTA chính luôn là một trong ba hành động: **Copy mã**, **Mua ngay**, **Rút tiền**.
- Trạng thái tiền phải luôn tách bạch: chờ duyệt, khả dụng, đang rút.
- Mọi trang chứa banner quảng cáo phải vẫn giữ được đường đi chính của người dùng.
- Với voucher, badge `Premium` phải nổi bật hơn badge nguồn API nhưng không làm người dùng hiểu nhầm về điều kiện áp dụng.

## 3. Bảng màu thương hiệu

| Token | Giá trị | Mục đích |
|---|---|---|
| `color.bg.canvas` | `#07111F` | Nền sâu nhất của toàn ứng dụng |
| `color.bg.surface` | `#0D1B2E` | Nền card chính |
| `color.bg.elevated` | `#12243C` | Card nổi và side panel |
| `color.bg.glass` | `#11243A99` | Khu vực glass có độ mờ |
| `color.brand.primary` | `#5BE7C4` | Điểm nhấn chính cho VuaHoanTien |
| `color.brand.secondary` | `#7C8CFF` | Điểm nhấn hỗ trợ, phân tách khối |
| `color.brand.accent` | `#FFD66B` | Nhấn khu vực hoa hồng, voucher hot |
| `color.text.primary` | `#F5F8FC` | Chữ chính |
| `color.text.secondary` | `#AFC1D6` | Chữ phụ |
| `color.text.muted` | `#7E93AB` | Chữ mô tả yếu |
| `color.state.success` | `#36E6A5` | Trạng thái thành công, approved |
| `color.state.warning` | `#FFB648` | Trạng thái chờ duyệt, caution |
| `color.state.danger` | `#FF6B81` | Trạng thái lỗi, từ chối, hoàn |
| `color.state.info` | `#63B6FF` | Thông báo trung tính |
| `color.border.soft` | `#FFFFFF14` | Viền card mảnh |
| `color.border.strong` | `#7C8CFF52` | Viền tập trung, card được chọn |

### Gradient chủ đạo

| Token | Giá trị | Cách dùng |
|---|---|---|
| `gradient.hero` | `linear(#7C8CFF -> #5BE7C4)` | Hero chính trang chủ |
| `gradient.reward` | `linear(#FFD66B -> #FF9E57)` | Card cashback và wallet highlight |
| `gradient.voucher` | `linear(#5BE7C4 -> #63B6FF)` | Badge voucher hot |
| `gradient.admin` | `linear(#1B2E49 -> #13233A)` | Header admin và panel lọc |

## 4. Typography

| Token | Khuyến nghị | Vai trò |
|---|---|---|
| `font.family.display` | Be Vietnam Pro hoặc tương đương | Heading thương hiệu |
| `font.family.body` | Inter hoặc tương đương | Nội dung và bảng |
| `font.size.hero` | 56 | Hero title desktop |
| `font.size.h1` | 40 | Heading trang |
| `font.size.h2` | 32 | Heading section |
| `font.size.h3` | 24 | Heading card lớn |
| `font.size.title` | 18 | Tiêu đề card |
| `font.size.body` | 16 | Nội dung mặc định |
| `font.size.caption` | 14 | Label phụ |
| `font.weight.medium` | 500 | Text mặc định |
| `font.weight.semibold` | 600 | CTA và label |
| `font.weight.bold` | 700 | Hero, số liệu, tiêu đề quan trọng |

### Quy tắc typography

- Dùng display font cho hero, tổng tiền, campaign headline.
- Dùng body font cho bảng, form, lịch sử giao dịch.
- Số liệu tiền luôn dùng chữ đậm và canh phải trong bảng.
- Không dùng quá ba cấp nhấn mạnh trên cùng một card.

## 5. Spacing và radius

| Token | Giá trị | Ứng dụng |
|---|---|---|
| `space.2` | 8 | Khoảng cách siêu nhỏ |
| `space.3` | 12 | Label với input |
| `space.4` | 16 | Khoảng cách mặc định trong card |
| `space.5` | 20 | Card compact |
| `space.6` | 24 | Form section |
| `space.8` | 32 | Section chính |
| `space.10` | 40 | Bento gap lớn |
| `radius.sm` | 12 | Button nhỏ |
| `radius.md` | 18 | Input và card thường |
| `radius.lg` | 24 | Hero card và modal |
| `radius.pill` | 999 | Chip, badge, tab |

## 6. Elevation và glass

| Token | Mô tả | Dùng cho |
|---|---|---|
| `shadow.soft` | Bóng dịu, thấp | Card nền thường |
| `shadow.medium` | Bóng nổi rõ | CTA card, dropdown |
| `shadow.glow` | Bóng màu thương hiệu nhẹ | Hero, wallet stat, promo rail |
| `glass.low` | Mờ nhẹ, viền mảnh | Header sticky |
| `glass.medium` | Mờ vừa, có bloom | Modal, campaign card |
| `glass.high` | Mờ sâu, ánh sáng mạnh | Hero seasonal hoặc popup ưu đãi |

Quy tắc:

- Không dùng glass ở bảng dữ liệu dày đặc của admin.
- Không dùng glow cho quá ba phần tử trên một màn hình.
- Mỗi màn hình phải có một điểm nhấn thương hiệu, không nhiều hơn hai.

## 7. Motion tokens

| Token | Giá trị mô tả | Ứng dụng |
|---|---|---|
| `motion.fast` | 140ms | Hover button, chip |
| `motion.normal` | 220ms | Drawer, tooltip, toast |
| `motion.slow` | 320ms | Modal, stat card enter |
| `motion.spring.gentle` | đàn hồi nhẹ | Copy voucher, success states |
| `motion.spring.reward` | đàn hồi vừa | Hiệu ứng cộng tiền khả dụng |
| `motion.fade.overlay` | mờ dần | Banner overlay và popup |

Nguyên tắc motion:

- Chuyển động phải giúp xác nhận thao tác, không chỉ để trang trí.
- Tương tác liên quan tới tiền cần cảm giác chắc chắn hơn là vui nhộn.
- Banner quảng cáo tự động chuyển tối đa theo nhịp chậm để không phá tập trung.

## 8. Component inventory

| Nhóm | Component | Vai trò trong VuaHoanTien |
|---|---|---|
| Navigation | Top navigation premium | Chứa brand, tìm kiếm, ví, notification, avatar |
| Navigation | Side rail admin | Điều hướng admin nhiều lớp, icon rõ |
| Banner | Hero banner | Khu vực chiến dịch lớn, hỗ trợ CTA trực tiếp |
| Banner | Promo strip | Dòng ưu đãi ngắn, chạy ngang |
| Banner | Reward billboard | Banner nhấn mạnh mức hoàn tiền |
| Data | Stat card | Tổng quan số dư, số đơn, tỷ lệ chuyển đổi |
| Data | Filter bar | Bộ lọc voucher, đơn hàng, rút tiền |
| Data | Status badge | Hiển thị trạng thái đơn, ví, banner |
| Commerce | Voucher card | Mã giảm giá, điều kiện, CTA copy |
| Commerce | Voucher source badge | Phân biệt voucher premium và voucher nền từ API |
| Commerce | Cashback result card | Thông tin link đã tạo, dự kiến hoàn tiền |
| Commerce | Tracking trust card | Hiển thị provider, trạng thái redirect và tín hiệu an toàn |
| Commerce | Wallet summary card | Chờ duyệt, khả dụng, đang rút |
| Input | Smart URL input | Ô dán link có kiểm tra domain |
| Input | Withdrawal form block | Form chọn phương thức rút tiền |
| Feedback | Toast | Báo copy thành công, link lỗi, rút tiền thành công |
| Feedback | Timeline | Diễn giải vòng đời đơn hoàn tiền |
| Overlay | Modal xác nhận | Copy voucher, tạo yêu cầu rút, duyệt admin |
| Overlay | Drawer chi tiết | Xem nhanh order hoặc user không rời màn hình |
| Admin | Table module | Bảng dữ liệu lớn với filter và bulk action có kiểm soát |
| Admin | Reconciliation panel | So sánh nội bộ và network theo từng đợt |

## 9. Mẫu nội dung quảng cáo

Vì VuaHoanTien cần nhiều banner nhưng vẫn sang, nội dung quảng cáo nên theo các mẫu sau:

- **Mẫu chiến dịch lớn:** “Săn deal 0h, nhận hoàn tiền rõ ràng ngay trong ví”.
- **Mẫu voucher hot:** “Mã ngon giới hạn, bấm copy là mở đúng link mua”.
- **Mẫu voucher premium:** “Mã premium chọn lọc, ưu tiên hiển thị và tracking chuẩn để khỏi lỡ deal ngon”.
- **Mẫu ví tiền:** “Chờ duyệt hôm nay, khả dụng đúng lúc để rút liền tay”.
- **Mẫu CTA cao cấp:** “Mua ngay qua VuaHoanTien để không bỏ lỡ phần hoàn tiền của bạn”.

Quy tắc trình bày:

- Banner luôn có một thông điệp chính, một thông điệp phụ và một CTA.
- Không nhồi quá ba badge trên cùng banner.
- Banner ở khu vực admin chỉ mang tính thông báo vận hành, không cần phong cách quảng cáo.

## 10. Quy tắc accessibility

- Tương phản chữ và nền phải ưu tiên đọc tốt trong dark mode.
- Trạng thái không chỉ dựa vào màu, phải có nhãn chữ đi kèm.
- Focus state phải rõ trên input, tab, button và row của bảng.
- Các thông tin tiền và trạng thái đơn phải đọc tốt trên mobile.
- Banner tự động không được làm mất khả năng dùng bàn phím.

## Kết luận thiết kế

Hệ thống thiết kế này giúp **VuaHoanTien** giữ một bản sắc cao cấp, hiện đại và có tính thương mại mạnh, nhưng vẫn đảm bảo rõ ràng ở những khu vực nhạy cảm như ví tiền, lịch sử đơn hàng và quản trị vận hành. Tất cả wireframe trong các tài liệu sau phải bám vào token, component và nguyên tắc tại đây.
