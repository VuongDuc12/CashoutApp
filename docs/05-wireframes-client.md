# VuaHoanTien — 05. Wireframe client

**Phiên bản:** 1.1  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** Wireframe ASCII cho toàn bộ khu vực khách hàng của VuaHoanTien  
**Tham chiếu thuật ngữ:** `docs/00-glossary.md`, `docs/08-ui-design-system.md`, `docs/02-use-cases.md`

## Mục lục

- [1. Quy ước wireframe](#1-quy-ước-wireframe)
- [2. Danh sách màn hình](#2-danh-sách-màn-hình)
- [3. Wireframe chi tiết](#3-wireframe-chi-tiết)

## 1. Quy ước wireframe

- Mỗi wireframe client của **VuaHoanTien** gắn với use case tương ứng.
- Banner quảng cáo được giữ nổi bật nhưng không che CTA chính.
- Tất cả màn hình ưu tiên dark mode first.

## 2. Danh sách màn hình

- WF-C01 Trang chủ campaign hub
- WF-C02 Danh sách voucher
- WF-C03 Chi tiết voucher
- WF-C04 Kết quả tạo deep link cashback
- WF-C05 Đăng ký
- WF-C06 Đăng nhập
- WF-C07 Dashboard người dùng
- WF-C08 Lịch sử đơn cashback
- WF-C09 Chi tiết đơn cashback
- WF-C10 Ví và rút tiền
- WF-C11 Cài đặt hồ sơ thanh toán
- WF-C12 Trung tâm thông báo

## 3. Wireframe chi tiết

### WF-C01 — Trang chủ campaign hub
**Use cases:** UC-C03, UC-C04, UC-C06

```text
+--------------------------------------------------------------------------------+
| Top Nav | Logo VuaHoanTien | Search | Voucher | Cashback | Ví | Thông báo |    |
+--------------------------------------------------------------------------------+
| HERO BANNER PREMIUM                                                        CTA |
| "Săn deal xịn, mua chuẩn link, nhận hoàn tiền rõ ràng"                      |
| [Dán link sản phẩm vào đây..............................................] [Tạo]|
+----------------------------+------------------------------+--------------------+
| Banner dọc chiến dịch      | Bento card voucher hot       | Wallet teaser      |
| 0h sale / flash deal       | mã nổi bật / điều kiện       | chờ duyệt/khả dụng |
+----------------------------+------------------------------+--------------------+
| Promo strip: Shopee hot | Lazada hot | Brand day | Free ship | Bank week       |
+--------------------------------------------------------------------------------+
| Grid voucher đề xuất                                                     [Xem] |
| [Voucher Card: Premium] [Voucher Card: API] [Voucher Card] [Voucher Card]      |
+--------------------------------------------------------------------------------+
```

### WF-C02 — Danh sách voucher
**Use cases:** UC-C04, UC-C05

```text
+--------------------------------------------------------------------------------+
| Header page | Banner mini merchant | Filter chips: Sàn | Ngành hàng | Hot | Mới |
+--------------------------------------------------------------------------------+
| Sidebar filter           | Voucher grid                                           |
| - Shopee                 | [Card mã 1][Card mã 2][Card mã 3]                       |
| - Lazada                 | [Card mã 4][Card mã 5][Card mã 6]                       |
| - Nguồn: Premium / API   | [Badge Premium ưu tiên][Badge API nền]                  |
| - % giảm                 | [Card mã 7][Card mã 8][Card mã 9]                       |
| - HSD                    |                                                       ...|
+--------------------------------------------------------------------------------+
```

### WF-C03 — Chi tiết voucher
**Use cases:** UC-C05

```text
+--------------------------------------------------------------------------------+
| Breadcrumb | Voucher / Merchant / Campaign                                     |
+--------------------------------------------------------------------------------+
| Card trái: mô tả voucher lớn     | Card phải: mã / trạng thái / CTA             |
| - Điều kiện áp dụng              | [ COPY MÃ ]                                   |
| - Khung giờ vàng                 | [ DÙNG NGAY ]                                 |
| - Merchant related banners       | Nguồn: Premium/API | Tracking chuẩn           |
+--------------------------------------------------------------------------------+
| Vùng voucher tương tự                                                     [>]  |
+--------------------------------------------------------------------------------+
```

### WF-C04 — Kết quả tạo deep link cashback
**Use cases:** UC-C06, UC-C07

```text
+--------------------------------------------------------------------------------+
| Step 1 Dán link  -> Step 2 Kiểm tra -> Step 3 Mua ngay                         |
+--------------------------------------------------------------------------------+
| Product preview card     | Cashback estimate card       | Trust card            |
| ảnh / tên / sàn          | dự kiến hoàn / lưu ý delay   | provider / session id |
+--------------------------+------------------------------+----------------------+
| [ MUA NGAY QUA VUAHOANTIEN ]      [ MỞ BẰNG APP ]      [ FALLBACK WEB ]         |
+--------------------------------------------------------------------------------+
```

### WF-C05 — Đăng ký
**Use cases:** UC-C01

```text
+-----------------------------------------------------------+
| Logo VuaHoanTien                                          |
| Tạo tài khoản để lưu đơn hàng và rút tiền về ví của bạn   |
| [Email.................................................]   |
| [Mật khẩu..............................................]   |
| [Xác nhận mật khẩu.....................................]   |
| [ ] Đồng ý điều khoản                                   |
| [ TẠO TÀI KHOẢN ]                                        |
| Link: Đã có tài khoản? Đăng nhập                         |
+-----------------------------------------------------------+
```

### WF-C06 — Đăng nhập
**Use cases:** UC-C02

```text
+-----------------------------------------------------------+
| Hero bên trái: lý do dùng VuaHoanTien                     |
| Form bên phải                                             |
| [Email.................................................]   |
| [Mật khẩu..............................................]   |
| [ ĐĂNG NHẬP ]                                             |
| Link: Quên mật khẩu | Tạo tài khoản                       |
+-----------------------------------------------------------+
```

### WF-C07 — Dashboard người dùng
**Use cases:** UC-C08, UC-C09, UC-C12

```text
+--------------------------------------------------------------------------------+
| Greeting | Wallet stat | Pending | Available | Đang rút                         |
+--------------------------------------------------------------------------------+
| Cột trái: banner reward           | Cột phải: timeline thông báo              |
| chiến dịch đang chạy              | đơn mới / order approved / payout         |
+-----------------------------------+--------------------------------------------+
| Module: đơn gần đây               | Module: voucher hot                         |
| [row][row][row]                   | [card][card][card]                          |
+--------------------------------------------------------------------------------+
```

### WF-C08 — Lịch sử đơn cashback
**Use cases:** UC-C08

```text
+--------------------------------------------------------------------------------+
| Header + filter bar: Trạng thái | Sàn | Thời gian | Search                       |
+--------------------------------------------------------------------------------+
| Table / cards                                                                 |
| Mã đơn | Sàn | Giá trị | Cashback | Trạng thái | Ngày mua | [Chi tiết]            |
| .....                                                                       ...|
+--------------------------------------------------------------------------------+
```

### WF-C09 — Chi tiết đơn cashback
**Use cases:** UC-C08

```text
+--------------------------------------------------------------------------------+
| Order header | public id | trạng thái | network                                |
+--------------------------------------------------------------------------------+
| Left: timeline                 | Right: amount summary                        |
| clicked -> tracked -> pending  | giá trị đơn                                 |
| approved / reversed            | hoa hồng                                    |
| note nếu mismatch              | cashback user                               |
+--------------------------------------------------------------------------------+
```

### WF-C10 — Ví và rút tiền
**Use cases:** UC-C09, UC-C10

```text
+--------------------------------------------------------------------------------+
| Wallet hero | Pending | Available | Locked Withdrawal                         |
+--------------------------------------------------------------------------------+
| Left: form rút tiền                  | Right: lịch sử rút                        |
| Chọn phương thức                     | status / amount / date                    |
| Chọn hồ sơ nhận tiền                 | [row][row][row]                           |
| Nhập số tiền                         |                                            |
| [ GỬI YÊU CẦU RÚT ]                  |                                            |
+--------------------------------------------------------------------------------+
```

### WF-C11 — Cài đặt hồ sơ thanh toán
**Use cases:** UC-C11

```text
+--------------------------------------------------------------------------------+
| Tabs: Hồ sơ | Thanh toán | Bảo mật                                            |
+--------------------------------------------------------------------------------+
| Danh sách payment profile hiện có                                             |
| [Ngân hàng mặc định] [MoMo] [ZaloPay]                                         |
| Form bên dưới: account name / account number / provider / default             |
| [ LƯU THÔNG TIN ]                                                              |
+--------------------------------------------------------------------------------+
```

### WF-C12 — Trung tâm thông báo
**Use cases:** UC-C12

```text
+--------------------------------------------------------------------------------+
| Header thông báo | unread count | filter                                       |
+--------------------------------------------------------------------------------+
| [Thông báo approved cashback]                                                  |
| [Thông báo withdrawal approved]                                                |
| [Thông báo payout completed]                                                   |
| [Thông báo mismatch resolved]                                                  |
+--------------------------------------------------------------------------------+
```

Tập wireframe này bảo đảm khu vực khách hàng của **VuaHoanTien** bao phủ đầy đủ các hành trình chính từ banner khám phá, săn voucher theo nguồn premium/API, tạo deep link, theo dõi đơn, đến rút tiền và nhận thông báo.
