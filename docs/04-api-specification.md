# VuaHoanTien — 04. Đặc tả API

**Phiên bản:** 1.1  
**Cập nhật lần cuối:** 2026-03-30  
**Phạm vi:** REST API cho client BFF, admin console và tích hợp nội bộ của VuaHoanTien  
**Tham chiếu thuật ngữ:** `docs/00-glossary.md`

## Mục lục

- [1. Quy ước API](#1-quy-ước-api)
- [2. API xác thực và hồ sơ](#2-api-xác-thực-và-hồ-sơ)
- [3. API voucher và banner](#3-api-voucher-và-banner)
- [4. API cashback và wallet](#4-api-cashback-và-wallet)
- [5. API admin](#5-api-admin)
- [6. API webhook và reconciliation](#6-api-webhook-và-reconciliation)

## 1. Quy ước API

- Tất cả response JSON có `success`, `data`, `error`.
- Auth required nghĩa là BFF hoặc backend phải có phiên hợp lệ.
- Các mã lỗi nghiệp vụ cần rõ để UI hiển thị đúng ngữ cảnh.
- Các field về tích hợp phải tách bạch `networkProviderCode`, `marketplaceCode`, `voucherSource` và các định danh tracking.
- Dưới đây là danh mục endpoint cốt lõi cho **VuaHoanTien**.

## 2. API xác thực và hồ sơ

### 1. POST `/api/auth/register`
- **Auth Required:** Không
- **Request Body:** email, password, agreeToTerms
- **Response Body:** userSummary, sessionCreated
- **Error Codes:** EMAIL_EXISTS, WEAK_PASSWORD

### 2. POST `/api/auth/login`
- **Auth Required:** Không
- **Request Body:** email, password
- **Response Body:** sessionUser, dashboardRedirect
- **Error Codes:** INVALID_CREDENTIALS, ACCOUNT_LOCKED

### 3. POST `/api/auth/logout`
- **Auth Required:** Có
- **Request Body:** none
- **Response Body:** loggedOut=true
- **Error Codes:** UNAUTHORIZED

### 4. GET `/api/me`
- **Auth Required:** Có
- **Request Body:** none
- **Response Body:** profileSummary
- **Error Codes:** UNAUTHORIZED

### 5. PATCH `/api/me/profile`
- **Auth Required:** Có
- **Request Body:** displayName
- **Response Body:** updatedProfile
- **Error Codes:** VALIDATION_ERROR

### 6. GET `/api/me/payment-profiles`
- **Auth Required:** Có
- **Request Body:** none
- **Response Body:** paymentProfiles[]
- **Error Codes:** UNAUTHORIZED

### 7. POST `/api/me/payment-profiles`
- **Auth Required:** Có
- **Request Body:** methodType, accountName, accountNumber, providerCode
- **Response Body:** paymentProfile
- **Error Codes:** INVALID_PAYMENT_PROFILE

### 8. PATCH `/api/me/payment-profiles/{paymentProfileId}`
- **Auth Required:** Có
- **Request Body:** accountName, accountNumber, isDefault
- **Response Body:** paymentProfile
- **Error Codes:** PROFILE_NOT_FOUND, VALIDATION_ERROR

## 3. API voucher và banner

### 9. GET `/api/home`
- **Auth Required:** Không
- **Request Body:** none
- **Response Body:** heroBanner, promoBanners, featuredVouchers, walletTeaser
- **Error Codes:** none

### 10. GET `/api/banners`
- **Auth Required:** Không
- **Request Body:** slotCode, pageCode
- **Response Body:** banners[]
- **Error Codes:** none

### 11. GET `/api/vouchers`
- **Auth Required:** Không
- **Request Body:** query params marketplace, merchant, voucherSource, promotionSlot, sort
- **Response Body:** items[], filters, pagination
- **Error Codes:** INVALID_FILTER

### 12. GET `/api/vouchers/{voucherId}`
- **Auth Required:** Không
- **Request Body:** none
- **Response Body:** voucherDetail, voucherSource, networkProviderCode, marketplaceCode, promotionSlot
- **Error Codes:** VOUCHER_NOT_FOUND

### 13. POST `/api/vouchers/{voucherId}/copy`
- **Auth Required:** Không
- **Request Body:** clickType, sourceChannel
- **Response Body:** codeText, redirectUrl, trackingSessionId, clickId, voucherSource, networkProviderCode, marketplaceCode
- **Error Codes:** VOUCHER_EXPIRED, RATE_LIMITED

### 14. POST `/api/vouchers/{voucherId}/use-now`
- **Auth Required:** Không
- **Request Body:** sourceChannel
- **Response Body:** redirectUrl, trackingSessionId, clickId, voucherSource, networkProviderCode, marketplaceCode
- **Error Codes:** VOUCHER_INACTIVE, RATE_LIMITED

## 4. API cashback và wallet

### 15. POST `/api/cashback/deep-links`
- **Auth Required:** Không
- **Request Body:** originalProductUrl, sourceChannel
- **Response Body:** deepLinkRequestId, trackingSessionId, clickId, networkProviderCode, marketplaceCode, affiliateUrl, estimatedCashback, requestStatus
- **Error Codes:** INVALID_DOMAIN, PRODUCT_NOT_ELIGIBLE, NETWORK_TIMEOUT

### 16. POST `/api/cashback/deep-links/{requestId}/open`
- **Auth Required:** Không
- **Request Body:** preferredTarget=app|web
- **Response Body:** outboundUrl, fallbackUrl, affiliateClickId, redirectStatus
- **Error Codes:** REQUEST_NOT_FOUND, LINK_EXPIRED

### 17. GET `/api/me/cashback-orders`
- **Auth Required:** Có
- **Request Body:** query params status, network, page
- **Response Body:** items[], summary, pagination
- **Error Codes:** UNAUTHORIZED

### 18. GET `/api/me/cashback-orders/{orderId}`
- **Auth Required:** Có
- **Request Body:** none
- **Response Body:** orderDetail, timeline, relatedLedgerEntries
- **Error Codes:** ORDER_NOT_FOUND

### 19. GET `/api/me/wallet`
- **Auth Required:** Có
- **Request Body:** none
- **Response Body:** pendingBalanceVnd, availableBalanceVnd, lockedWithdrawalVnd
- **Error Codes:** UNAUTHORIZED

### 20. GET `/api/me/wallet/ledger`
- **Auth Required:** Có
- **Request Body:** query params bucket, page
- **Response Body:** ledgerEntries[], pagination
- **Error Codes:** UNAUTHORIZED

### 21. POST `/api/me/withdrawals`
- **Auth Required:** Có
- **Request Body:** paymentProfileId, amountVnd
- **Response Body:** withdrawalRequest
- **Error Codes:** INSUFFICIENT_AVAILABLE_BALANCE, RISK_REVIEW_REQUIRED, BELOW_MINIMUM_WITHDRAWAL

### 22. GET `/api/me/withdrawals`
- **Auth Required:** Có
- **Request Body:** query params status
- **Response Body:** withdrawalRequests[]
- **Error Codes:** UNAUTHORIZED

### 23. GET `/api/me/notifications`
- **Auth Required:** Có
- **Request Body:** query params unreadOnly
- **Response Body:** notificationItems[]
- **Error Codes:** UNAUTHORIZED

### 24. POST `/api/me/notifications/{notificationId}/read`
- **Auth Required:** Có
- **Request Body:** none
- **Response Body:** markedRead=true
- **Error Codes:** NOTIFICATION_NOT_FOUND

## 5. API admin

### 25. GET `/api/admin/dashboard`
- **Auth Required:** Có, admin
- **Request Body:** query params range
- **Response Body:** overviewStats, pendingQueues, alertSummary
- **Error Codes:** FORBIDDEN

### 26. GET `/api/admin/users`
- **Auth Required:** Có, admin
- **Request Body:** query params query, status
- **Response Body:** users[], pagination
- **Error Codes:** FORBIDDEN

### 27. GET `/api/admin/users/{userId}`
- **Auth Required:** Có, admin
- **Request Body:** none
- **Response Body:** userDetail, walletSummary, orderSummary, withdrawalSummary
- **Error Codes:** USER_NOT_FOUND

### 28. PATCH `/api/admin/users/{userId}/status`
- **Auth Required:** Có, admin
- **Request Body:** status, reason
- **Response Body:** updatedUserStatus
- **Error Codes:** INVALID_STATUS

### 29. GET `/api/admin/vouchers`
- **Auth Required:** Có, admin
- **Request Body:** query params status, merchant, networkProvider, marketplace, voucherSource, promotionSlot
- **Response Body:** vouchers[], pagination
- **Error Codes:** FORBIDDEN

### 30. POST `/api/admin/vouchers`
- **Auth Required:** Có, admin
- **Request Body:** title, codeText, destinationUrl, networkProviderCode, marketplaceCode, voucherSource, promotionSlot, startsAt, endsAt
- **Response Body:** voucher
- **Error Codes:** INVALID_DESTINATION_URL, VALIDATION_ERROR

### 31. PATCH `/api/admin/vouchers/{voucherId}`
- **Auth Required:** Có, admin
- **Request Body:** mutable voucher fields, voucherSource, promotionSlot, destinationUrl, status
- **Response Body:** voucher
- **Error Codes:** VOUCHER_NOT_FOUND

### 32. POST `/api/admin/vouchers/{voucherId}/publish`
- **Auth Required:** Có, admin
- **Request Body:** none
- **Response Body:** publishedVoucher
- **Error Codes:** INVALID_PUBLISH_STATE

### 32A. POST `/api/admin/voucher-import-batches`
- **Auth Required:** Có, admin
- **Request Body:** networkProviderCode, marketplaceCode, batchType, previewOnly
- **Response Body:** importBatch, previewItems[], duplicateSummary
- **Error Codes:** INVALID_PROVIDER_CONFIG, PROVIDER_RATE_LIMITED

### 32B. GET `/api/admin/voucher-import-batches/{batchId}`
- **Auth Required:** Có, admin
- **Request Body:** none
- **Response Body:** importBatch, importedItems[], duplicateItems[]
- **Error Codes:** BATCH_NOT_FOUND

### 33. GET `/api/admin/banners`
- **Auth Required:** Có, admin
- **Request Body:** query params slot, status
- **Response Body:** banners[]
- **Error Codes:** FORBIDDEN

### 34. POST `/api/admin/banners`
- **Auth Required:** Có, admin
- **Request Body:** title, subtitle, ctaLabel, ctaUrl, slotCode, startsAt, endsAt
- **Response Body:** banner
- **Error Codes:** INVALID_BANNER_SCHEDULE

### 35. PATCH `/api/admin/banners/{bannerId}`
- **Auth Required:** Có, admin
- **Request Body:** mutable banner fields
- **Response Body:** banner
- **Error Codes:** BANNER_NOT_FOUND

### 36. GET `/api/admin/cashback-orders`
- **Auth Required:** Có, admin
- **Request Body:** query params status, networkProvider, marketplace, voucherSource, user, mismatchOnly
- **Response Body:** orders[], pagination
- **Error Codes:** FORBIDDEN

### 37. GET `/api/admin/cashback-orders/{orderId}`
- **Auth Required:** Có, admin
- **Request Body:** none
- **Response Body:** orderDetail, trackingSession, clickDetail, deepLinkRequest, rawNetworkSummary, walletImpact
- **Error Codes:** ORDER_NOT_FOUND

### 38. POST `/api/admin/cashback-orders/{orderId}/adjust`
- **Auth Required:** Có, admin
- **Request Body:** adjustmentType, amountVnd, reason
- **Response Body:** adjustmentResult
- **Error Codes:** INVALID_ADJUSTMENT

### 39. GET `/api/admin/withdrawals`
- **Auth Required:** Có, admin
- **Request Body:** query params status, methodType, riskFlag
- **Response Body:** withdrawalRequests[], pagination
- **Error Codes:** FORBIDDEN

### 40. POST `/api/admin/withdrawals/{withdrawalId}/approve`
- **Auth Required:** Có, admin
- **Request Body:** note
- **Response Body:** approvedWithdrawal
- **Error Codes:** WITHDRAWAL_NOT_FOUND, INVALID_TRANSITION

### 41. POST `/api/admin/withdrawals/{withdrawalId}/reject`
- **Auth Required:** Có, admin
- **Request Body:** reason
- **Response Body:** rejectedWithdrawal
- **Error Codes:** INVALID_TRANSITION

### 42. POST `/api/admin/withdrawals/{withdrawalId}/mark-paid`
- **Auth Required:** Có, admin
- **Request Body:** payoutReference
- **Response Body:** paidWithdrawal
- **Error Codes:** DUPLICATE_PAYOUT_REFERENCE, INVALID_TRANSITION

### 43. GET `/api/admin/reconciliation/batches`
- **Auth Required:** Có, admin
- **Request Body:** query params network, status
- **Response Body:** batches[]
- **Error Codes:** FORBIDDEN

### 44. POST `/api/admin/reconciliation/batches`
- **Auth Required:** Có, admin
- **Request Body:** networkCode, periodStart, periodEnd
- **Response Body:** batch
- **Error Codes:** INVALID_PERIOD, BATCH_OVERLAP

### 45. GET `/api/admin/reconciliation/batches/{batchId}`
- **Auth Required:** Có, admin
- **Request Body:** none
- **Response Body:** batchSummary, reconciliationItems[]
- **Error Codes:** BATCH_NOT_FOUND

### 46. POST `/api/admin/reconciliation/items/{itemId}/resolve`
- **Auth Required:** Có, admin
- **Request Body:** resolutionType, note
- **Response Body:** resolvedItem
- **Error Codes:** ITEM_NOT_FOUND, INVALID_RESOLUTION

### 47. POST `/api/admin/jobs/poll-network`
- **Auth Required:** Có, admin
- **Request Body:** networkProviderCode, marketplaceCode, periodStart, periodEnd
- **Response Body:** jobAccepted
- **Error Codes:** JOB_ALREADY_RUNNING, NETWORK_RATE_LIMITED

### 48. GET `/api/admin/audit-logs`
- **Auth Required:** Có, admin
- **Request Body:** query params module, actor, dateRange
- **Response Body:** auditLogs[], pagination
- **Error Codes:** FORBIDDEN

### 49. GET `/api/admin/settings/payout-policy`
- **Auth Required:** Có, admin
- **Request Body:** none
- **Response Body:** payoutPolicy
- **Error Codes:** FORBIDDEN

### 50. PATCH `/api/admin/settings/payout-policy`
- **Auth Required:** Có, admin
- **Request Body:** defaultUserCashbackRate, minWithdrawalVnd
- **Response Body:** payoutPolicy
- **Error Codes:** POLICY_VALIDATION_ERROR

## 6. API webhook và reconciliation

### 51. POST `/api/webhooks/providers/{providerCode}/conversions`
- **Auth Required:** Không theo session, có chữ ký network
- **Request Body:** payload từ network
- **Response Body:** accepted=true
- **Error Codes:** INVALID_SIGNATURE, DUPLICATE_EVENT

### 52. POST `/api/internal/providers/{providerCode}/poll-results`
- **Auth Required:** Nội bộ
- **Request Body:** normalizedConversionBatch
- **Response Body:** importedCount, duplicateCount, mismatchCount
- **Error Codes:** INTERNAL_AUTH_FAILED

### 53. GET `/api/internal/reconciliation/summary`
- **Auth Required:** Nội bộ hoặc admin service
- **Request Body:** query params network, period
- **Response Body:** summary
- **Error Codes:** INVALID_PERIOD

Đặc tả này cung cấp đủ hơn 30 endpoint để đội frontend và backend của **VuaHoanTien** chia trách nhiệm rõ ràng và bám đúng use case đã xác định.
