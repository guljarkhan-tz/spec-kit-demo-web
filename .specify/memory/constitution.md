<!--
Sync Impact Report - Constitution v1.0.0 (2026-02-09)
- Version change: Initial creation → 1.0.0
- Modified principles: N/A (initial creation)
- Added sections: 5 core principles, Technology Standards, Quality Gates
- Removed sections: N/A
- Templates requiring updates: ✅ Updated all templates for consistency
- Follow-up TODOs: None - all placeholders filled
-->

# Accounting & Invoicing UI Constitution

## Core Principles

### I. Financial Data Integrity (NON-NEGOTIABLE)
All financial data operations MUST maintain audit-ready accuracy and traceability. Ledger entries are immutable once posted; invoice amounts cannot be modified in UI; all financial calculations defer to authoritative backend service. Every transaction must preserve double-entry accounting principles and provide complete audit trails from ride → ledger → invoice → balance.

**Rationale**: Financial compliance and audit requirements for healthcare billing demand absolute data integrity and traceability.

### II. Production-Grade Implementation
All code MUST be production-ready from first implementation. No placeholders, TODOs, or "will implement later" patterns allowed. Implement proper error handling, logging, performance optimization, accessibility compliance, and security measures immediately. Use TypeScript strict mode, comprehensive error boundaries, and structured logging with correlation IDs.

**Rationale**: Healthcare financial systems require enterprise-grade reliability and cannot tolerate development shortcuts that compromise production stability.

### III. Feature-Based Architecture  
Organize code by business domain/feature, not technical type. Each feature owns its components, services, models, routing, and tests within self-contained boundaries. Shared code allowed only for genuine cross-feature reuse. Use Angular standalone components where possible and maintain clear feature boundaries to enable independent development and testing.

**Rationale**: Domain-driven architecture enables maintainable, testable code that aligns with business requirements and supports parallel development.

### IV. Test-First Development (NON-NEGOTIABLE)
Write tests before implementation: Test specification → User approval → Tests fail → Implement until passing. Use Red-Green-Refactor cycle strictly. All financial calculations, API integrations, and UI workflows require comprehensive test coverage including unit tests, integration tests, and E2E tests with Playwright.

**Rationale**: Financial software demands bulletproof reliability; test-first development prevents regression bugs and ensures specification compliance.

### V. Security & Audit Readiness
Implement tenant isolation, secure authentication, input validation, and audit logging from day one. All user actions must be logged with user context and timestamps. Sensitive financial data requires encryption at rest and in transit. UI must enforce read-only constraints for immutable financial data and provide clear visual indicators for audit-sensitive operations.

**Rationale**: Healthcare and financial regulations (HIPAA, SOX) require comprehensive security measures and audit capabilities built into the system architecture.

## Technology Standards

**Frontend Stack**: Angular 18+ with TypeScript strict mode, Tailwind CSS for styling, Angular Testing Utilities with Playwright for E2E testing. Use Angular CLI for code generation and build optimization. Maintain performance budgets and accessibility compliance (WCAG 2.1 AA).

**Backend Integration**: .NET-based dual-entry accounting service with PostgreSQL. Frontend consumes REST APIs with proper error handling, retry logic, and timeout configurations. Implement proper loading states and optimistic UI patterns where appropriate.

**Development Tools**: ESLint + Prettier for code formatting, Husky for git hooks, pnpm for package management. All CI/CD pipelines must run linting, type checking, unit tests, and E2E tests before deployment.

## Quality Gates

**Code Review Requirements**: All PRs require constitution compliance verification, test coverage validation, and security review for financial data handling. No direct pushes to main branch allowed.

**Testing Gates**: Minimum 80% code coverage for business logic, all user stories must have corresponding E2E tests, integration tests required for API interactions and financial calculations.

**Performance Standards**: Page load times <2 seconds for ledger views, <1 second for invoice lists, graceful degradation for large datasets with pagination and virtual scrolling where needed.

**Accessibility Requirements**: WCAG 2.1 AA compliance mandatory, screen reader compatibility for all financial data presentations, keyboard navigation support throughout application.

## Governance

Constitution supersedes all other development practices. Amendments require documentation of impact, approval from project stakeholders, and migration plan for existing code. All PRs must verify compliance with constitutional principles before merge approval.

Complexity and architectural decisions must be justified against constitutional principles. Deviations require explicit documentation and approval. Use Angular and .NET core principles documents for runtime development guidance while maintaining constitutional compliance.

**Version**: 1.0.0 | **Ratified**: 2026-02-09 | **Last Amended**: 2026-02-09
