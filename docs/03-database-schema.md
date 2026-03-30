# VuaHoanTien — 03. Thiết kế cơ sở dữ liệu PostgreSQL

**Phiên bản:** 1.1  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** ERD mô tả, bảng dữ liệu, ràng buộc và DDL cho VuaHoanTien  
**Tham chiếu thuật ngữ:** `docs/00-glossary.md`

## Mục lục

- [1. Nguyên tắc mô hình dữ liệu](#1-nguyên-tắc-mô-hình-dữ-liệu)
- [2. Các thực thể chính](#2-các-thực-thể-chính)
- [3. ERD text-based](#3-erd-text-based)
- [4. DDL PostgreSQL](#4-ddl-postgresql)
- [5. Indexes và ràng buộc quan trọng](#5-indexes-và-ràng-buộc-quan-trọng)
- [6. Ghi chú mô hình ví và ledger](#6-ghi-chú-mô-hình-ví-và-ledger)

## 1. Nguyên tắc mô hình dữ liệu

- VuaHoanTien chỉ dùng VND, lưu tiền ở dạng `BIGINT`.
- Mọi bảng giao dịch quan trọng đều có `public_id` để tránh lộ ID nội bộ.
- Các bảng nghiệp vụ quan trọng đều có `created_at` và `updated_at`.
- Bảng ledger là bất biến, không cập nhật số tiền trực tiếp sau khi đã ghi.
- Correlation key phải xuất hiện ở các bảng tracking chính.

## 2. Các thực thể chính

- `users`
- `admin_users`
- `payment_profiles`
- `wallet_accounts`
- `ledger_entries`
- `withdrawal_requests`
- `merchant_stores`
- `campaign_banners`
- `voucher_import_batches`
- `vouchers`
- `voucher_click_events`
- `tracking_sessions`
- `deep_link_requests`
- `cashback_orders`
- `webhook_events`
- `reconciliation_batches`
- `reconciliation_items`
- `audit_logs`
- `notification_events`
- `system_settings`

## 3. ERD text-based

```text
users 1---1 wallet_accounts
users 1---n payment_profiles
users 1---n tracking_sessions
users 1---n deep_link_requests
users 1---n cashback_orders
users 1---n withdrawal_requests
users 1---n notification_events

wallet_accounts 1---n ledger_entries
withdrawal_requests 1---n ledger_entries
cashback_orders 1---n ledger_entries

merchant_stores 1---n vouchers
voucher_import_batches 1---n vouchers
merchant_stores 1---n campaign_banners

vouchers 1---n voucher_click_events
tracking_sessions 1---n voucher_click_events
voucher_click_events 1---n deep_link_requests
tracking_sessions 1---n deep_link_requests
tracking_sessions 1---n cashback_orders
deep_link_requests 1---n cashback_orders

reconciliation_batches 1---n reconciliation_items
cashback_orders 1---n reconciliation_items
webhook_events 1---n reconciliation_items

admin_users 1---n audit_logs
users 1---n audit_logs
```

## 4. DDL PostgreSQL

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_profiles (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    method_type VARCHAR(30) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    account_number_encrypted TEXT NOT NULL,
    provider_code VARCHAR(50),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_accounts (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE merchant_stores (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    marketplace_code VARCHAR(30),
    network_provider_code VARCHAR(30),
    display_name VARCHAR(150) NOT NULL,
    store_slug VARCHAR(160) NOT NULL UNIQUE,
    logo_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaign_banners (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    merchant_store_id BIGINT REFERENCES merchant_stores(id),
    title VARCHAR(180) NOT NULL,
    subtitle VARCHAR(240),
    cta_label VARCHAR(80),
    cta_url TEXT,
    slot_code VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE voucher_import_batches (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    network_provider_code VARCHAR(30) NOT NULL,
    marketplace_code VARCHAR(30),
    batch_type VARCHAR(30) NOT NULL,
    batch_status VARCHAR(30) NOT NULL,
    imported_count INT NOT NULL DEFAULT 0,
    created_by_admin_id BIGINT REFERENCES admin_users(id),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE vouchers (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    merchant_store_id BIGINT REFERENCES merchant_stores(id),
    marketplace_code VARCHAR(30),
    network_provider_code VARCHAR(30) NOT NULL,
    voucher_source VARCHAR(20) NOT NULL DEFAULT 'CMS',
    import_batch_id BIGINT REFERENCES voucher_import_batches(id),
    promotion_slot VARCHAR(50),
    title VARCHAR(180) NOT NULL,
    code_text VARCHAR(120),
    destination_url TEXT NOT NULL,
    short_tracking_url TEXT,
    description TEXT,
    discount_summary VARCHAR(150),
    source_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tracking_sessions (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id),
    flow_type VARCHAR(30) NOT NULL,
    network_provider_code VARCHAR(30),
    marketplace_code VARCHAR(30),
    source_channel VARCHAR(50),
    correlation_key VARCHAR(120) NOT NULL UNIQUE,
    device_fingerprint VARCHAR(120),
    ip_hash VARCHAR(128),
    landing_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE voucher_click_events (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    voucher_id BIGINT NOT NULL REFERENCES vouchers(id),
    tracking_session_id BIGINT NOT NULL REFERENCES tracking_sessions(id),
    click_type VARCHAR(30) NOT NULL,
    voucher_source VARCHAR(20) NOT NULL,
    source_channel VARCHAR(50),
    outbound_affiliate_url TEXT,
    outbound_headers JSONB NOT NULL DEFAULT '{}'::jsonb,
    outbound_time TIMESTAMPTZ,
    platform VARCHAR(20),
    redirect_status VARCHAR(20),
    affiliate_click_id VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE deep_link_requests (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id),
    tracking_session_id BIGINT NOT NULL REFERENCES tracking_sessions(id),
    click_event_id BIGINT REFERENCES voucher_click_events(id),
    network_provider_code VARCHAR(30) NOT NULL,
    marketplace_code VARCHAR(30) NOT NULL,
    original_product_url TEXT NOT NULL,
    affiliate_url TEXT,
    request_status VARCHAR(30) NOT NULL,
    estimated_cashback_vnd BIGINT,
    request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    response_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cashback_orders (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    tracking_session_id BIGINT REFERENCES tracking_sessions(id),
    deep_link_request_id BIGINT REFERENCES deep_link_requests(id),
    network_provider_code VARCHAR(30) NOT NULL,
    marketplace_code VARCHAR(30),
    voucher_source VARCHAR(20),
    affiliate_click_id VARCHAR(150),
    external_order_id VARCHAR(150),
    correlation_key VARCHAR(120) NOT NULL,
    order_status VARCHAR(30) NOT NULL,
    order_amount_vnd BIGINT,
    commission_amount_vnd BIGINT,
    cashback_amount_vnd BIGINT,
    ordered_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (network_provider_code, external_order_id)
);

CREATE TABLE withdrawal_requests (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    wallet_account_id BIGINT NOT NULL REFERENCES wallet_accounts(id),
    payment_profile_id BIGINT NOT NULL REFERENCES payment_profiles(id),
    withdrawal_amount_vnd BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_review',
    risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
    processed_by_admin_id BIGINT REFERENCES admin_users(id),
    payout_reference VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ledger_entries (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    wallet_account_id BIGINT NOT NULL REFERENCES wallet_accounts(id),
    entry_type VARCHAR(40) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    amount_vnd BIGINT NOT NULL,
    balance_bucket VARCHAR(30) NOT NULL,
    cashback_order_id BIGINT REFERENCES cashback_orders(id),
    withdrawal_request_id BIGINT REFERENCES withdrawal_requests(id),
    reference_note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_events (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    network_provider_code VARCHAR(30) NOT NULL,
    event_key VARCHAR(150) NOT NULL UNIQUE,
    event_status VARCHAR(30) NOT NULL,
    signature_valid BOOLEAN NOT NULL DEFAULT FALSE,
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE TABLE reconciliation_batches (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    network_provider_code VARCHAR(30) NOT NULL,
    batch_status VARCHAR(30) NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    created_by_admin_id BIGINT REFERENCES admin_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE reconciliation_items (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    reconciliation_batch_id BIGINT NOT NULL REFERENCES reconciliation_batches(id),
    cashback_order_id BIGINT REFERENCES cashback_orders(id),
    webhook_event_id BIGINT REFERENCES webhook_events(id),
    match_status VARCHAR(40) NOT NULL,
    mismatch_reason VARCHAR(120),
    admin_note TEXT,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE notification_events (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    event_type VARCHAR(40) NOT NULL,
    title VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(26) NOT NULL UNIQUE,
    actor_admin_id BIGINT REFERENCES admin_users(id),
    actor_user_id BIGINT REFERENCES users(id),
    module_code VARCHAR(50) NOT NULL,
    action_code VARCHAR(50) NOT NULL,
    target_public_id VARCHAR(26),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(80) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    updated_by_admin_id BIGINT REFERENCES admin_users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 5. Indexes và ràng buộc quan trọng

```sql
CREATE INDEX idx_tracking_sessions_user_created_at ON tracking_sessions(user_id, created_at DESC);
CREATE INDEX idx_vouchers_source_status_window ON vouchers(voucher_source, status, starts_at, ends_at);
CREATE INDEX idx_cashback_orders_user_status ON cashback_orders(user_id, order_status, created_at DESC);
CREATE INDEX idx_cashback_orders_correlation_key ON cashback_orders(correlation_key);
CREATE INDEX idx_voucher_click_events_tracking_created_at ON voucher_click_events(tracking_session_id, created_at DESC);
CREATE INDEX idx_deep_link_requests_tracking_created_at ON deep_link_requests(tracking_session_id, created_at DESC);
CREATE INDEX idx_withdrawal_requests_status_created_at ON withdrawal_requests(status, created_at DESC);
CREATE INDEX idx_ledger_entries_wallet_created_at ON ledger_entries(wallet_account_id, created_at DESC);
CREATE INDEX idx_webhook_events_provider_status ON webhook_events(network_provider_code, event_status, received_at DESC);
CREATE INDEX idx_reconciliation_items_batch_status ON reconciliation_items(reconciliation_batch_id, match_status);
CREATE INDEX idx_notification_events_user_unread ON notification_events(user_id, read_at, created_at DESC);
```

## 6. Ghi chú mô hình ví và ledger

- `balance_bucket` được dùng để phân biệt `pending`, `available`, `locked_withdrawal`.
- `voucher_source` là metadata bắt buộc để phân biệt voucher nền từ API và voucher premium từ CMS trong toàn chuỗi tracking.
- `voucher_import_batches` nhóm các lần ingest từ provider để admin điều tra import, duplicate và mismatch.
- Khi order mới ghi nhận, ledger tăng `pending`.
- Khi order approved, ledger giảm `pending` và tăng `available` bằng hai bút toán đối ứng.
- Khi user tạo withdrawal request, ledger chuyển từ `available` sang `locked_withdrawal`.
- Khi payout thành công, ledger ghi giảm `locked_withdrawal`.
- Khi payout thất bại hoặc bị từ chối, ledger đảo chiều về `available`.

Thiết kế này giúp **VuaHoanTien** giữ dữ liệu tài chính minh bạch, dễ đối soát và đủ chi tiết để backend team triển khai mà không cần thay đổi mô hình cốt lõi.
