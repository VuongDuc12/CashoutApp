# VuaHoanTien — Tài liệu Thiết kế Hệ thống SaaS Cashback/Affiliate

## TL;DR

> **Quick Summary**: Tạo bộ tài liệu thiết kế đầy đủ (8 documents) bằng tiếng Việt cho nền tảng cashback/affiliate "VuaHoanTien" — bao gồm System Design, Use Cases, DB Schema, API Spec, Wireframes (client + admin), Integration Specs, và UI Design System. Kiến trúc Next.js 15 + .NET 9 + PostgreSQL. Không có implementation code.
> 
> **Deliverables**:
> - `docs/00-glossary.md` — Bảng thuật ngữ kỹ thuật Việt-Anh
> - `docs/01-system-design.md` — Kiến trúc hệ thống, tech stack, data flow, security
> - `docs/02-use-cases.md` — Tất cả use cases cho Client (≥10) + Admin (≥12)
> - `docs/03-database-schema.md` — ERD, DDL PostgreSQL, relationships, indexes
> - `docs/04-api-specification.md` — REST API endpoints (≥30), request/response schemas
> - `docs/05-wireframes-client.md` — Wireframe ASCII tất cả màn hình client (≥10 screens)
> - `docs/06-wireframes-admin.md` — Wireframe ASCII tất cả màn hình admin (≥12 screens)
> - `docs/07-integration-specs.md` — Shopee/Lazada API integration, webhook/polling, error handling
> - `docs/08-ui-design-system.md` — Design tokens, color palette, typography, component inventory
> 
> **Estimated Effort**: Large (9 documents, ~15,000-25,000 lines tổng cộng)
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 (Glossary+Design System) → Task 2 (System Design) → Task 5 (Use Cases) → Task 7 (API Spec) → Task 10 (Validation)

---

## Context

### Original Request
Tạo tài liệu thiết kế đầy đủ cho nền tảng VuaHoanTien — website kinh doanh cashback/affiliate marketing chuẩn SaaS 2026, bao gồm 2 luồng chính:
1. **Luồng Mã giảm giá (Voucher/Coupon)**: Kéo mã → hiển thị → copy + redirect affiliate link → earn commission
2. **Luồng Hoàn tiền (Cashback)**: Paste product URL → tạo deep link → mua hàng → webhook/polling → đối soát → chia tiền vào ví

### Interview Summary
**Key Discussions**:
- **Tech Stack**: Next.js 15 (App Router) + .NET 9 Web API (Clean Architecture/CQRS) + PostgreSQL
- **Architecture**: BFF pattern — Next.js API routes proxy to .NET, JWT in httpOnly cookies
- **Affiliate Networks**: Shopee (GraphQL, polling `conversionReport`) + Lazada (HasOffers, S2S postback)
- **Wallet**: Double-entry ledger, pending → available balance separation
- **Admin**: Tất cả chức năng — Voucher CRUD, User Mgmt, Order Mgmt, Analytics, Withdrawal, CMS Banner
- **Auth**: Email + Password only
- **Payment**: Bank Transfer + MoMo/ZaloPay
- **UI**: SaaS 2026 — bento grids, selective glassmorphism, spring animations, dark mode, premium banners
- **Brand**: VuaHoanTien (Vua Hoàn Tiền)
- **Model**: Single-tenant (một website cho một business)
- **Language**: Tiếng Việt cho tất cả tài liệu
- **Referral**: Phase 2 (không nằm trong scope)

**Research Findings**:
- Shopee Affiliate API: GraphQL + SHA256 HMAC, `generateShortLink`, `productOfferV2`, `conversionReport` (polling only, KHÔNG có webhook)
- Lazada Affiliate: HasOffers/TUNE platform, LAZOP SDK, S2S postback URL với `aff_sub` correlation key
- Double-entry ledger là bắt buộc cho cashback platform (ShopBack pattern)
- BFF pattern được khuyến nghị cho Next.js + .NET (không expose .NET trực tiếp)
- next-intl cho i18n (nhưng chỉ Vietnamese — không cần multi-language routing)
- VND KHÔNG có đơn vị thập phân → dùng BIGINT hoặc NUMERIC(20,0)
- CVE-2025-29927: Middleware không đủ cho auth — phải verify ở DAL level

### Metis Review
**Identified Gaps** (addressed):
- VND precision sai (NUMERIC(20,2) → phải dùng BIGINT) → Fixed trong DB Schema task
- Thiếu Vietnamese glossary → Thêm Task 1 tạo glossary trước tất cả
- Thiếu reconciliation mismatch workflow → Thêm vào Use Cases
- Thiếu edge cases (15 business + 5 technical) → Phân bổ vào các docs tương ứng
- Thiếu rate limiting/abuse prevention → Thêm vào System Design + API Spec
- Admin role hierarchy chưa rõ → Default single admin role, document extensibility
- Deep link fallback chưa rõ → Document mobile web fallback trong Use Cases
- Thiếu acceptance criteria cụ thể → Thêm grep/wc-based verification cho mỗi doc

---

## Work Objectives

### Core Objective
Tạo bộ tài liệu thiết kế hoàn chỉnh bằng tiếng Việt cho VuaHoanTien, đủ chi tiết để một development team có thể implement mà không cần hỏi thêm.

### Concrete Deliverables
- 9 markdown documents trong thư mục `docs/`
- Mỗi document có Table of Contents, version header, và tham chiếu glossary
- Tổng cộng ≥18 use cases, ≥30 API endpoints, ≥22 wireframe screens, ≥12 DB tables

### Definition of Done
- [ ] Tất cả 9 files tồn tại trong `docs/`
- [ ] Mỗi file > 100 dòng (non-trivial content)
- [ ] Mỗi file chứa ký tự tiếng Việt
- [ ] Mỗi file chứa "VuaHoanTien" hoặc "Vua Hoàn Tiền"
- [ ] Không có `import {` hoặc `using System` trong bất kỳ file nào (no implementation code)
- [ ] Cross-document entity names nhất quán

### Must Have
- Bảng thuật ngữ Việt-Anh thống nhất xuyên suốt 9 documents
- C4 Context + Container diagrams (text-based) trong System Design
- Tất cả use cases có: Preconditions, Main Flow, Alternate Flows, Postconditions
- SQL DDL chuẩn PostgreSQL (executable)
- API endpoints có: Method, Path, Request Body, Response Body, Error Codes, Auth Required
- ASCII wireframes cho MỌI màn hình (không dùng placeholder "see Figma")
- Design tokens với hex color values cụ thể
- Edge cases được xử lý: sản phẩm không hỗ trợ affiliate, partial refund, deep link fallback
- Double-entry ledger schema cho wallet
- Reconciliation mismatch workflow cho admin

### Must NOT Have (Guardrails)
- ❌ KHÔNG có implementation code (TypeScript, C#, Python) — chỉ pseudocode cho complex algorithms
- ❌ KHÔNG có referral system — Phase 2, ZERO referral tables/use cases/wireframes
- ❌ KHÔNG có i18n infrastructure — Vietnamese only, không locale switching/translation keys
- ❌ KHÔNG có SEO strategy, blog, landing page variations, marketing pages
- ❌ KHÔNG có push notifications, SMS notifications — chỉ SignalR in-app + email cho critical events
- ❌ KHÔNG có custom report builder, data export, BI integration trong analytics
- ❌ KHÔNG có abstract payment provider interface — chỉ 3 concrete implementations (MoMo, ZaloPay, Bank)
- ❌ KHÔNG có "extensible architecture" language không có concrete current requirement
- ❌ KHÔNG có speculative "future phases" references quá 1 lần mỗi document
- ❌ KHÔNG có generic SaaS boilerplate ("scalable, microservices-ready, enterprise-grade")
- ❌ KHÔNG có document nào vượt quá 3000 dòng
- ❌ KHÔNG có pixel values, CSS code, animation keyframes trong wireframes
- ❌ KHÔNG có multi-currency — VND only (BIGINT, không decimal)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (greenfield, docs-only project)
- **Automated tests**: NONE (no code to test)
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios:
- **Document structure**: `grep` for required sections (TOC, version header, glossary reference)
- **Content completeness**: `grep -c` for minimum entity counts (use cases, endpoints, screens, tables)
- **Language verification**: `grep -P` for Vietnamese characters
- **Brand consistency**: `grep` for "VuaHoanTien"
- **No-code verification**: `grep -rl "import {"` and `grep -rl "using System"` must return 0
- **Cross-doc consistency**: Entity names in DB schema match API spec match wireframes

Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation):
├── Task 1: Vietnamese Glossary + UI Design System [writing]
├── Task 2: System Architecture Design [deep]
└── Task 3: Shopee/Lazada Integration Specifications [deep]

Wave 2 (After Wave 1 — core design, parallel):
├── Task 4: Database Schema Design (depends: 2, 3) [deep]
├── Task 5: Complete Use Case Document (depends: 2, 3) [writing]

Wave 3 (After Wave 2 — interface layer, MAX PARALLEL):
├── Task 6: Client Wireframes (depends: 1, 5) [visual-engineering]
├── Task 7: API Specification (depends: 4, 5) [writing]
└── Task 8: Admin Wireframes (depends: 1, 5) [visual-engineering]

Wave 4 (After Wave 3 — validation):
└── Task 9: Cross-Document Consistency Validation (depends: ALL) [unspecified-high]

Wave FINAL (After ALL — review):
├── Task F1: Plan Compliance Audit [oracle]
├── Task F2: Document Quality Review [unspecified-high]
├── Task F3: Cross-Document QA Verification [unspecified-high]
└── Task F4: Scope Fidelity Check [deep]

Critical Path: Task 1 → Task 5 → Task 7 → Task 9 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 3 (Waves 1 & 3)
```

### Task Dependency Graph

| Task | Depends On | Blocks | Reason |
|------|-----------|--------|--------|
| Task 1: Glossary + Design System | None | 6, 8 | Design tokens referenced by wireframes |
| Task 2: System Architecture | None | 4, 5 | Architecture context needed for schema + use cases |
| Task 3: Integration Specs | None | 4, 5 | API behavior needed for schema + use case flows |
| Task 4: DB Schema | 2, 3 | 7 | Entity definitions needed for API spec |
| Task 5: Use Cases | 2, 3 | 6, 7, 8 | Use cases define screens + API requirements |
| Task 6: Client Wireframes | 1, 5 | 9 | Design tokens + use cases needed |
| Task 7: API Specification | 4, 5 | 9 | Schema + use cases define endpoints |
| Task 8: Admin Wireframes | 1, 5 | 9 | Design tokens + use cases needed |
| Task 9: Cross-Doc Validation | 1-8 | F1-F4 | All docs must exist for validation |

### Dependency Matrix

| Task | Deps | Blocks | Wave |
|------|------|--------|------|
| 1 | — | 6, 8 | 1 |
| 2 | — | 4, 5 | 1 |
| 3 | — | 4, 5 | 1 |
| 4 | 2, 3 | 7 | 2 |
| 5 | 2, 3 | 6, 7, 8 | 2 |
| 6 | 1, 5 | 9 | 3 |
| 7 | 4, 5 | 9 | 3 |
| 8 | 1, 5 | 9 | 3 |
| 9 | 1-8 | F1-F4 | 4 |

### Agent Dispatch Summary

- **Wave 1**: **3** — T1 → `writing`, T2 → `deep`, T3 → `deep`
- **Wave 2**: **2** — T4 → `deep`, T5 → `writing`
- **Wave 3**: **3** — T6 → `visual-engineering`, T7 → `writing`, T8 → `visual-engineering`
- **Wave 4**: **1** — T9 → `unspecified-high`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

---

## Final Verification Wave (after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify document exists and contains required content (read file, grep for sections). For each "Must NOT Have": search all docs for forbidden patterns (implementation code, referral system, multi-currency). Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Document Quality Review** — `unspecified-high`
  Read ALL 9 documents. Check for: completeness (every section non-empty), Vietnamese language quality, technical accuracy (SQL syntax, API conventions), consistency of terminology (must match glossary). Check AI slop: generic boilerplate, speculative future features, excessive "enterprise-grade" language.
  Output: `Docs [N/N quality] | Vietnamese [N/N] | Technical [N/N accurate] | Slop [N found] | VERDICT`

- [ ] F3. **Cross-Document QA Verification** — `unspecified-high`
  Run automated verification: entity names in DB schema match API spec match wireframes. Glossary terms used consistently. All use case IDs referenced in wireframes exist. All API endpoints referenced in use cases exist. All DB tables referenced in API spec exist. Vietnamese character presence in all docs.
  Output: `Entity Consistency [N/N] | UC-API Match [N/N] | DB-API Match [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each document: verify content matches task specification exactly. Check for scope creep: referral system mentions, i18n infrastructure, SEO strategy, push notifications, abstract patterns, multi-currency, excessive future-proofing. Check "Must NOT Have" compliance across all docs. Count lines per doc (must be < 3000).
  Output: `Docs [N/N compliant] | Scope Creep [CLEAN/N issues] | Line Count [ALL < 3000] | VERDICT`

---

## Commit Strategy

- **Wave 1**: `docs: add glossary, system design, and integration specs` — `docs/00-glossary.md`, `docs/01-system-design.md`, `docs/07-integration-specs.md`, `docs/08-ui-design-system.md`
- **Wave 2**: `docs: add use cases and database schema` — `docs/02-use-cases.md`, `docs/03-database-schema.md`
- **Wave 3**: `docs: add API spec and wireframes` — `docs/04-api-specification.md`, `docs/05-wireframes-client.md`, `docs/06-wireframes-admin.md`
- **Wave 4**: `docs: validate cross-document consistency` — any fix-up files

---

## Success Criteria

### Verification Commands
```bash
# All 9 docs exist
ls docs/0{0,1,2,3,4,5,6,7,8}-*.md | wc -l  # Expected: 9

# All docs non-trivial (>100 lines each)
for f in docs/0*.md; do lines=$(wc -l < "$f"); [ $lines -gt 100 ] && echo "OK: $f ($lines lines)" || echo "FAIL: $f ($lines lines)"; done

# Vietnamese content in all docs
grep -rlP "[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]" docs/*.md | wc -l  # Expected: 9

# Brand name in all docs
grep -rl "VuaHoanTien\|Vua Hoàn Tiền" docs/*.md | wc -l  # Expected: 9

# No implementation code
grep -rl "import {" docs/*.md | wc -l  # Expected: 0
grep -rl "using System" docs/*.md | wc -l  # Expected: 0
grep -rl "from '" docs/*.md | wc -l  # Expected: 0

# No referral system
grep -rli "referral\|giới thiệu bạn bè\|refer.*friend" docs/*.md | wc -l  # Expected: 0 (or max 1 mention noting Phase 2)

# Line count < 3000 per doc
for f in docs/0*.md; do lines=$(wc -l < "$f"); [ $lines -lt 3000 ] && echo "OK: $f ($lines)" || echo "FAIL: $f ($lines > 3000)"; done
```

### Final Checklist
- [ ] All 9 "Must Have" documents present
- [ ] All "Must NOT Have" patterns absent
- [ ] Cross-document entity consistency verified
- [ ] Vietnamese language in all documents
- [ ] Brand "VuaHoanTien" in all documents
- [ ] No implementation code in any document
- [ ] All documents < 3000 lines
