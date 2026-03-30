# VuaHoanTien — 06. Wireframe admin

**Phiên bản:** 1.1  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** Wireframe ASCII cho khu vực quản trị của VuaHoanTien  
**Tham chiếu thuật ngữ:** `docs/00-glossary.md`, `docs/08-ui-design-system.md`, `docs/02-use-cases.md`

## Mục lục

- [1. Quy ước wireframe admin](#1-quy-ước-wireframe-admin)
- [2. Danh sách màn hình](#2-danh-sách-màn-hình)
- [3. Wireframe chi tiết](#3-wireframe-chi-tiết)

## 1. Quy ước wireframe admin

- Admin Console của **VuaHoanTien** ưu tiên đọc dữ liệu nhanh và xử lý chính xác.
- Khu vực admin ít hiệu ứng hơn client nhưng vẫn giữ thẩm mỹ đồng nhất.
- Bảng dữ liệu là thành phần chủ đạo, drawer chi tiết là thành phần phụ trợ.

## 2. Danh sách màn hình

- WF-A01 Đăng nhập admin
- WF-A02 Dashboard vận hành
- WF-A03 Danh sách voucher admin
- WF-A04 Tạo hoặc sửa voucher
- WF-A05 Quản lý banner
- WF-A06 Danh sách order cashback
- WF-A07 Chi tiết order cashback
- WF-A08 Queue rút tiền
- WF-A09 Chi tiết yêu cầu rút
- WF-A10 Danh sách người dùng
- WF-A11 Chi tiết người dùng
- WF-A12 Reconciliation batches
- WF-A13 Chi tiết mismatch reconciliation
- WF-A14 Audit logs

## 3. Wireframe chi tiết

### WF-A01 — Đăng nhập admin
**Use case:** UC-A01

```text
+-----------------------------------------------------------+
| VuaHoanTien Admin Console                                 |
| [Email admin...........................................]   |
| [Mật khẩu..............................................]   |
| [ ĐĂNG NHẬP QUẢN TRỊ ]                                    |
+-----------------------------------------------------------+
```

### WF-A02 — Dashboard vận hành
**Use case:** UC-A02

```text
+--------------------------------------------------------------------------------+
| Side Rail | Dashboard | Orders | Withdrawals | Reconciliation | CMS | Audit    |
+--------------------------------------------------------------------------------+
| Top stat row: GMV | Commission | Cashback Pending | Approved | Mismatch        |
+--------------------------------------------------------------------------------+
| Left large chart                 | Right alert cards                             |
| conversion trend by provider     | callback errors / payout queue / import sync |
+----------------------------------+-----------------------------------------------+
| Bottom tables: latest withdrawals | latest mismatches | premium/API source mix    |
+--------------------------------------------------------------------------------+
```

### WF-A03 — Danh sách voucher admin
**Use case:** UC-A03

```text
+--------------------------------------------------------------------------------+
| Header: Voucher Management | [Tạo voucher mới] [Import từ provider]            |
+--------------------------------------------------------------------------------+
| Filter: status | merchant | provider | marketplace | source | slot | time      |
+--------------------------------------------------------------------------------+
| Table: title | code | merchant | provider | source | slot | status | actions    |
+--------------------------------------------------------------------------------+
```

### WF-A04 — Tạo hoặc sửa voucher
**Use case:** UC-A03

```text
+--------------------------------------------------------------------------------+
| Form editor voucher                                                            |
| title | code text | destination url | provider | marketplace | source          |
| description | promotion slot | import batch (readonly nếu từ API)             |
| schedule start/end | publish state                                            |
| [Lưu draft] [Publish]                                                         |
+--------------------------------------------------------------------------------+
```

### WF-A05 — Quản lý banner
**Use case:** UC-A04

```text
+--------------------------------------------------------------------------------+
| Header: Campaign Banners | [Tạo banner]                                        |
+--------------------------------------------------------------------------------+
| Grid/table mixed view                                                          |
| slot | title | CTA | thời gian | trạng thái | preview | actions                |
+--------------------------------------------------------------------------------+
```

### WF-A06 — Danh sách order cashback
**Use case:** UC-A05

```text
+--------------------------------------------------------------------------------+
| Filter bar: provider | marketplace | source | status | user | mismatch only     |
+--------------------------------------------------------------------------------+
| Table: order id | user | provider | source | amount | cashback | status | open   |
+--------------------------------------------------------------------------------+
```

### WF-A07 — Chi tiết order cashback
**Use case:** UC-A05, UC-A14

```text
+--------------------------------------------------------------------------------+
| Order summary | external id | correlation key | trạng thái                     |
+--------------------------------------------------------------------------------+
| Left: tracking & payload            | Right: wallet impact                      |
| click id / source / provider        | pending credit                            |
| tracking session / deep link req    | available transfer                        |
| affiliate click id / raw payload    | adjustment / reversal actions             |
+--------------------------------------------------------------------------------+
```

### WF-A08 — Queue rút tiền
**Use case:** UC-A07

```text
+--------------------------------------------------------------------------------+
| Header withdrawals | pending count | risk review count                          |
+--------------------------------------------------------------------------------+
| Table: request id | user | method | amount | risk | created | action           |
+--------------------------------------------------------------------------------+
```

### WF-A09 — Chi tiết yêu cầu rút
**Use cases:** UC-A07, UC-A08

```text
+--------------------------------------------------------------------------------+
| Withdrawal detail | user summary | wallet summary                              |
+--------------------------------------------------------------------------------+
| Left: payout info                    | Right: risk and order context             |
| method, account, amount              | recent orders / flags / notes             |
| [Approve] [Reject] [Mark Paid]       | payout reference input                    |
+--------------------------------------------------------------------------------+
```

### WF-A10 — Danh sách người dùng
**Use case:** UC-A09

```text
+--------------------------------------------------------------------------------+
| User search | filter status | high risk only                                   |
+--------------------------------------------------------------------------------+
| Table: user | email | status | total cashback | available | last login | action |
+--------------------------------------------------------------------------------+
```

### WF-A11 — Chi tiết người dùng
**Use case:** UC-A09

```text
+--------------------------------------------------------------------------------+
| User header | status | joined date | [Khóa / Mở khóa]                           |
+--------------------------------------------------------------------------------+
| Tab 1: profile   Tab 2: wallet   Tab 3: orders   Tab 4: withdrawals            |
+--------------------------------------------------------------------------------+
| Summary cards + activity timeline                                               |
+--------------------------------------------------------------------------------+
```

### WF-A12 — Reconciliation batches
**Use case:** UC-A13

```text
+--------------------------------------------------------------------------------+
| Header reconciliation | [Tạo batch mới]                                        |
+--------------------------------------------------------------------------------+
| Table: batch id | provider | marketplace | period | matched | mismatched | open |
+--------------------------------------------------------------------------------+
```

### WF-A13 — Chi tiết mismatch reconciliation
**Use case:** UC-A06

```text
+--------------------------------------------------------------------------------+
| Batch summary | matched | amount mismatch | missing internal | missing network  |
+--------------------------------------------------------------------------------+
| Left table: mismatch rows            | Right drawer: resolution panel            |
| order / reason / source / status     | payload | click chain | admin note        |
|                                      | [Resolve] [Escalate] [Keep Open]          |
+--------------------------------------------------------------------------------+
```

### WF-A14 — Audit logs
**Use case:** UC-A12

```text
+--------------------------------------------------------------------------------+
| Filter actor | module | action | date range                                    |
+--------------------------------------------------------------------------------+
| Table: time | actor | module | action | target | metadata summary               |
+--------------------------------------------------------------------------------+
```

Tập wireframe admin này giúp đội thiết kế và phát triển triển khai **VuaHoanTien** theo đúng hành trình vận hành thực tế: quan sát hệ thống, xử lý voucher và banner, duyệt payout, điều tra mismatch và kiểm soát audit.
