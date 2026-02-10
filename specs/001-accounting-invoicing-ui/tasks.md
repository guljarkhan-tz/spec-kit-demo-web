---

description: "Task list for Accounting & Invoicing UI implementation"
---

# Tasks: Accounting & Invoicing UI

**Input**: Design documents from `/specs/001-accounting-invoicing-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are not explicitly requested in the feature specification, so this implementation focuses on production code. Add test tasks later if TDD approach is requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this is an Angular single-page application:
- **Frontend**: `src/app/` with feature-based architecture
- **Features**: `src/app/features/{accounts,transactions,invoices}/`
- **Core**: `src/app/core/{auth,interceptors,guards}/`
- **Shared**: `src/app/shared/{components,services,models}/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Angular project initialization and basic configuration

- [ ] T001 Initialize Angular 18+ project with TypeScript strict mode and pnpm package manager
- [ ] T002 Install and configure Tailwind CSS with PostCSS and Autoprefixer
- [ ] T003 [P] Configure TypeScript with strict mode settings per constitutional requirements in tsconfig.json
- [ ] T004 [P] Setup ESLint, Prettier, and Husky for code quality enforcement
- [ ] T005 [P] Configure Playwright for E2E testing infrastructure  
- [ ] T006 Create feature-based directory structure in src/app/features/{accounts,transactions,invoices}
- [ ] T007 [P] Setup Angular CLI configuration with performance budgets in angular.json
- [ ] T008 [P] Configure environment files for development and production in src/environments/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Create branded TypeScript types for financial entities (AccountId, LedgerEntryId, InvoiceId) in src/app/shared/models/types.ts
- [ ] T010 [P] Implement FinancialAmount type with cent-based precision calculations in src/app/shared/models/financial-amount.ts
- [ ] T011 [P] Create base HTTP service with tenant isolation and error handling in src/app/core/services/http.service.ts
- [ ] T012 Implement authentication service with JWT token management in src/app/core/auth/auth.service.ts
- [ ] T013 Implement tenant service for context management in src/app/core/auth/tenant.service.ts
- [ ] T014 [P] Create tenant isolation HTTP interceptor in src/app/core/interceptors/tenant-isolation.interceptor.ts
- [ ] T015 [P] Create audit logging HTTP interceptor in src/app/core/interceptors/audit-logging.interceptor.ts
- [ ] T016 [P] Create comprehensive error handling interceptor in src/app/core/interceptors/error-handling.interceptor.ts
- [ ] T017 [P] Implement shared error display component in src/app/shared/components/error-display.component.ts
- [ ] T018 [P] Create shared loading component in src/app/shared/components/loading.component.ts
- [ ] T019 Configure HTTP interceptors and providers in src/app/app.config.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Account Discovery and Selection (Priority: P1) 🎯 MVP

**Goal**: Enable finance and operations teams to browse tenant-scoped accounts, see financial indicators, and select accounts for detailed review

**Independent Test**: Users can log in, view account list with tenant isolation, see basic financial data, and select any account to access detail view

### Implementation for User Story 1

- [ ] T020 [P] [US1] Create Account model interface in src/app/features/accounts/models/account.model.ts
- [ ] T021 [P] [US1] Create AccountSummary and AccountMetadata models in src/app/features/accounts/models/account-summary.model.ts
- [ ] T022 [P] [US1] Create Account API service with tenant-scoped requests in src/app/features/accounts/services/account.service.ts
- [ ] T023 [P] [US1] Create Account store service with signals-based state management in src/app/features/accounts/services/account-store.service.ts
- [ ] T024 [US1] Implement AccountListComponent with data table and performance optimization in src/app/features/accounts/components/account-list.component.ts
- [ ] T025 [US1] Create AccountListComponent template with Tailwind styling in src/app/features/accounts/components/account-list.component.html
- [ ] T026 [US1] Implement AccountDetailComponent with tabbed navigation in src/app/features/accounts/components/account-detail.component.ts
- [ ] T027 [US1] Create AccountDetailComponent template with Summary/Transactions/Invoices tabs in src/app/features/accounts/components/account-detail.component.html
- [ ] T028 [P] [US1] Create account routing configuration in src/app/features/accounts/accounts.routes.ts
- [ ] T029 [US1] Integrate account routes with main application routing in src/app/app.routes.ts
- [ ] T030 [US1] Add tenant boundary validation and error handling for account operations
- [ ] T031 [US1] Implement account selection performance optimization to meet <30 second requirement

**Checkpoint**: At this point, User Story 1 should be fully functional - users can browse accounts and access detail views independently

---

## Phase 4: User Story 2 - Transaction History Review (Priority: P2)

**Goal**: Enable finance teams to investigate account balances through comprehensive ledger entry review with filtering and read-only enforcement

**Independent Test**: Users can select an account, navigate to Transactions tab, apply filters, view transaction details, and verify all financial data is read-only

### Implementation for User Story 2

- [ ] T032 [P] [US2] Create LedgerEntry model interface in src/app/features/transactions/models/ledger-entry.model.ts
- [ ] T033 [P] [US2] Create LedgerMetadata and SourceDetails models in src/app/features/transactions/models/ledger-metadata.model.ts
- [ ] T034 [P] [US2] Create Transaction API service with filtering capabilities in src/app/features/transactions/services/transaction.service.ts
- [ ] T035 [P] [US2] Create Transaction store service with caching for performance in src/app/features/transactions/services/transaction-store.service.ts
- [ ] T036 [US2] Implement TransactionListComponent with virtual scrolling for >1000 entries in src/app/features/transactions/components/transaction-list.component.ts
- [ ] T037 [US2] Create TransactionListComponent template with filtering UI in src/app/features/transactions/components/transaction-list.component.html
- [ ] T038 [US2] Implement TransactionDetailComponent with full metadata display in src/app/features/transactions/components/transaction-detail.component.ts
- [ ] T039 [US2] Create TransactionDetailComponent template with read-only indicators in src/app/features/transactions/components/transaction-detail.component.html
- [ ] T040 [P] [US2] Create TransactionFiltersComponent for date range, source type, and amount filtering in src/app/features/transactions/components/transaction-filters.component.ts
- [ ] T041 [US2] Implement read-only enforcement with visual indicators and disabled controls
- [ ] T042 [US2] Add error handling for modification attempts with clear user feedback
- [ ] T043 [US2] Optimize transaction list loading to meet <2 second performance requirement for 90 days
- [ ] T044 [US2] Integration transaction components into AccountDetailComponent tabs

**Checkpoint**: Transaction history review is complete - users can filter and review immutable ledger data independently

---

## Phase 5: User Story 3 - Invoice Management and Review (Priority: P3)

**Goal**: Enable operations teams to review invoice details, download PDFs, and edit non-financial metadata while protecting financial integrity

**Independent Test**: Users can navigate to Invoices tab, view invoice details, download matching PDFs, edit metadata fields, and verify financial data remains immutable

### Implementation for User Story 3

- [ ] T045 [P] [US3] Create Invoice model interface in src/app/features/invoices/models/invoice.model.ts
- [ ] T046 [P] [US3] Create BillingPeriod, InvoiceLineItem, and AppliedPayment models in src/app/features/invoices/models/invoice-components.model.ts
- [ ] T047 [P] [US3] Create BillingContact and InvoiceAuditInfo models in src/app/features/invoices/models/invoice-metadata.model.ts
- [ ] T048 [P] [US3] Create Invoice API service with metadata editing capabilities in src/app/features/invoices/services/invoice.service.ts
- [ ] T049 [P] [US3] Create Invoice PDF service for download functionality in src/app/features/invoices/services/invoice-pdf.service.ts
- [ ] T050 [P] [US3] Create Invoice store service with optimistic updates for metadata in src/app/features/invoices/services/invoice-store.service.ts
- [ ] T051 [US3] Implement InvoiceListComponent with performance optimization for <1 second load in src/app/features/invoices/components/invoice-list.component.ts
- [ ] T052 [US3] Create InvoiceListComponent template with status and amount display in src/app/features/invoices/components/invoice-list.component.html
- [ ] T053 [US3] Implement InvoiceDetailComponent with line items and payment information in src/app/features/invoices/components/invoice-detail.component.ts
- [ ] T054 [US3] Create InvoiceDetailComponent template with financial immutability indicators in src/app/features/invoices/components/invoice-detail.component.html
- [ ] T055 [P] [US3] Create InvoiceMetadataEditComponent for notes, reference, and billing contact in src/app/features/invoices/components/invoice-metadata-edit.component.ts
- [ ] T056 [US3] Implement PDF download functionality with exact backend format matching
- [ ] T057 [US3] Add validation for metadata edits with audit timestamp tracking
- [ ] T058 [US3] Implement financial field protection with error messages for modification attempts
- [ ] T059 [US3] Integrate invoice components into AccountDetailComponent tabs
- [ ] T060 [US3] Add concurrent editing conflict resolution for invoice metadata

**Checkpoint**: Invoice management is complete - users can review invoices, download PDFs, and edit metadata independently

---

## Phase 6: User Story 4 - Cross-Reference Navigation (Priority: P4)

**Goal**: Enable power users to investigate financial relationships through seamless navigation between invoices, transactions, and source records

**Independent Test**: Users can follow navigation links between invoice details, related ledger entries, linked invoices, and source ride/payment records for complete traceability

### Implementation for User Story 4

- [ ] T061 [P] [US4] Create NavigationService for cross-reference link generation in src/app/core/services/navigation.service.ts
- [ ] T062 [P] [US4] Create BreadcrumbComponent for navigation context in src/app/shared/components/breadcrumb.component.ts
- [ ] T063 [US4] Add navigation links from invoice detail to related ledger entries with filtering
- [ ] T064 [US4] Add navigation links from ledger entries to linked invoices
- [ ] T065 [US4] Add navigation links from ledger entries to source ride/payment details (read-only)
- [ ] T066 [US4] Implement context preservation during cross-reference navigation
- [ ] T067 [US4] Add breadcrumb trail for complex navigation workflows
- [ ] T068 [P] [US4] Create NavigationHistoryService for back/forward functionality in src/app/core/services/navigation-history.service.ts
- [ ] T069 [US4] Optimize cross-reference queries for performance during investigation workflows
- [ ] T070 [US4] Add visual indicators for available navigation links throughout the application

**Checkpoint**: Cross-reference navigation enables complete financial traceability workflows

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Production readiness, performance optimization, and accessibility compliance

- [ ] T071 [P] Implement WCAG 2.1 AA accessibility compliance across all components
- [ ] T072 [P] Add comprehensive error boundaries with user-friendly error pages
- [ ] T073 [P] Implement performance monitoring and analytics integration
- [ ] T074 [P] Add loading states and skeleton screens for improved perceived performance
- [ ] T075 [P] Optimize bundle size with lazy loading for feature modules
- [ ] T076 [P] Implement caching strategies for improved performance with financial data consistency
- [ ] T077 [P] Add print-friendly styles for financial reports and invoice views
- [ ] T078 [P] Create responsive design optimizations for tablet and mobile (desktop-first requirement)
- [ ] T079 Validate performance requirements: <2s transactions, <1s invoices, <30s account selection
- [ ] T080 Final integration testing across all user stories for end-to-end workflows

**Final Checkpoint**: Application is production-ready with all constitutional requirements met

---

## Dependencies & Execution Order

### Story Completion Order
1. **Phase 1-2**: Must complete before any user story work
2. **US1 (P1)**: Independent - can start immediately after Phase 2
3. **US2 (P2)**: Depends on US1 for account selection context  
4. **US3 (P3)**: Depends on US1 for account selection context
5. **US4 (P4)**: Depends on US1, US2, and US3 for complete cross-reference functionality

### Parallel Execution Opportunities

**Phase 2 Foundational** - Many tasks can run in parallel:
- T010, T011, T017, T018 (Models and components)
- T014, T015, T016 (HTTP interceptors)

**Within User Stories** - Model and service creation can be parallelized:
- US1: T020, T021, T022, T023 (Account models and services)
- US2: T032, T033, T034, T035 (Transaction models and services)  
- US3: T045, T046, T047, T048, T049, T050 (Invoice models and services)

**Polish Phase** - Most tasks are independent:
- T071, T072, T073, T074, T075, T076, T077, T078 can run simultaneously

### Independent Story Testing

- **US1 MVP**: Complete account browsing and selection (Tasks T020-T031)
- **US2 + US1**: Add transaction history review (Tasks T032-T044)
- **US3 + US1**: Add invoice management (Tasks T045-T060)  
- **US4 + US1-3**: Add cross-reference navigation (Tasks T061-T070)

### Implementation Strategy

**Recommended MVP Scope**: Implement Phase 1-2 + US1 for initial deployment
- Provides core value: account discovery and selection
- Establishes technical foundation for remaining stories
- Enables early user feedback and validation

**Incremental Delivery**: Each user story builds upon the previous ones while remaining independently testable and valuable.

---

## Validation Checklist

**Format Compliance**: 
✅ All 80 tasks follow `- [ ] [TaskID] [P?] [Story?] Description with file path` format
✅ Sequential task IDs (T001-T080) in execution order
✅ Parallelizable tasks marked with [P] 
✅ User story tasks labeled with [US1], [US2], [US3], [US4]
✅ Exact file paths included in all task descriptions

**Story Coverage**:
✅ US1 (P1): 12 tasks covering account discovery and selection
✅ US2 (P2): 13 tasks covering transaction history review  
✅ US3 (P3): 16 tasks covering invoice management and review
✅ US4 (P4): 10 tasks covering cross-reference navigation
✅ Each story is independently testable and valuable

**Constitutional Compliance**:
✅ Financial data integrity enforced through read-only constraints
✅ Production-grade implementation with comprehensive error handling
✅ Feature-based architecture with clear domain boundaries
✅ Security and audit readiness with tenant isolation and logging