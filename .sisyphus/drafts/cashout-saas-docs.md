# Draft: CashoutApp SaaS Documentation Suite

## Requirements (confirmed)
- **Project type**: Greenfield — zero code exists, only `promt.md` requirements file
- **Deliverable**: Documentation ONLY (no implementation code)
  - System Design Document
  - Full Use Case Document (client + admin)
  - Wireframe Descriptions (all screens)
  - API Specifications
  - Database Schema Design
  - Architecture Decision Records (ADRs)
- **Tech Stack**: Next.js 15 (App Router) + .NET 9 Web API + PostgreSQL
- **Affiliate Networks**: Both Shopee Affiliate + Lazada Affiliate (accounts exist)
- **Admin Features**: ALL — Voucher CRUD, User Management, Order Management, Dashboard Analytics, Withdrawal Management, CMS Banner
- **Payment/Withdrawal**: Bank Transfer + E-Wallet (MoMo/ZaloPay)
- **UI Standard**: SaaS 2026 — bento grids, selective glassmorphism, spring animations, dark mode, premium look with advertising banners

## Business Flows (2 core)

### Flow 1: Voucher/Coupon
1. System pulls coupons from affiliate networks → DB
2. User browses coupon listing
3. User clicks "Copy Code" or "Use Now"
4. System: copy to clipboard + open affiliate link in new tab (cookie tracking)
5. User applies code at checkout → operator earns commission (no cashback to user)

### Flow 2: Cashback
1. User pastes Shopee/Lazada product URL
2. System creates affiliate deep link via API
3. User clicks "Buy Now" → redirect via deep link to app
4. Affiliate Network sends webhook → create pending cashback order
5. After 15-30 days confirmation → calculate split (e.g. 70% user, 30% platform) → credit user wallet

## Technical Decisions
- **Architecture**: BFF pattern — Next.js API routes proxy to .NET backend, no direct browser-to-.NET
- **Auth**: JWT in httpOnly cookies, DAL verification at every layer
- **Real-time**: SignalR for cashback notifications
- **Wallet**: Double-entry ledger, immutable entries, materialized balances
- **Admin**: Same Next.js app with route groups + role-based layouts
- **i18n**: next-intl with Vietnamese as default locale
- **.NET Pattern**: Clean Architecture (Ardalis template) + CQRS with MediatR
- **Webhook Handling**: Transactional Outbox pattern with idempotency keys

## Research Findings

### Shopee Affiliate API
- GraphQL API at `open-api.affiliate.shopee.{country}/graphql`
- Auth: SHA256 HMAC signature
- Key operations: `generateShortLink`, `productOfferV2`, `conversionReport`
- **NO webhook push** — must poll `conversionReport` for order reconciliation
- Sub_id supports 5 slots for tracking (tenantId-userId-campaign-channel-custom)

### Lazada Affiliate API
- HasOffers (TUNE) platform
- REST API with LAZOP SDK, HMAC-MD5 auth
- Deep link generator via HasOffers
- **S2S Postback URL** for order tracking (real webhook support)
- `aff_sub` parameter = correlation key to map back to user sessions

### Wallet/Ledger
- Double-entry bookkeeping is mandatory for cashback platforms
- Pending → Available balance separation prevents premature credits
- Reversals only, never UPDATE/DELETE on ledger entries
- `NUMERIC(20,2)` for money (VND), `decimal` in C#

### UI Trends (2026)
- Bento grid layouts (67% top SaaS products)
- Selective glassmorphism (modals, sidebars only)
- Spring-based micro-animations (Framer Motion)
- Dark mode first design
- Calm design / progressive disclosure
- Command palette (Cmd+K)
- Emotional design (celebration animations on cashback)

## Scope Boundaries
- INCLUDE: Full documentation suite — system design, use cases, wireframes, API specs, DB schema, ADRs
- INCLUDE: Both client-facing and admin panel design
- INCLUDE: Both Shopee and Lazada integration specs
- EXCLUDE: Actual implementation code
- EXCLUDE: Deployment/DevOps documentation (unless explicitly requested)
- EXCLUDE: Testing strategy documentation (no code = no tests)

## Open Questions — RESOLVED
- ✅ Language: **Tiếng Việt** (Vietnamese)
- ✅ Brand name: **VuaHoanTien** (Vua Hoàn Tiền = King of Cashback)
- ✅ Model: **Single-tenant** — one website for one business
- ✅ Auth: **Email + Password** only (no social login)
- ✅ Referral: **Phase 2** — design noted but not priority
- ❓ Minimum withdrawal amount: Default to 50,000 VND (industry standard Vietnam)

## Final Deliverables (8 documents)
1. `01-system-design.md` - Architecture, tech stack, data flow, deployment
2. `02-use-cases.md` - Complete use case catalog (client + admin, all actors)
3. `03-database-schema.md` - ERD, tables, relationships, indexes
4. `04-api-specification.md` - REST API endpoints with request/response schemas
5. `05-wireframes-client.md` - Client-facing screens (ASCII wireframes + specs)
6. `06-wireframes-admin.md` - Admin panel screens (ASCII wireframes + specs)
7. `07-integration-specs.md` - Shopee/Lazada API integration, webhook handling
8. `08-ui-design-system.md` - Design tokens, typography, color palette, component library
