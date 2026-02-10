# Quickstart Guide: Accounting & Invoicing UI

**Feature**: Accounting & Invoicing UI  
**Branch**: `001-accounting-invoicing-ui`  
**Last Updated**: 2026-02-09

## Overview

This guide helps developers quickly set up and start developing the Angular-based Accounting & Invoicing UI. The application provides tenant-scoped access to financial data with read-only ledger entries and limited invoice metadata editing.

## Prerequisites

### Required Software
- **Node.js**: 20.x LTS (use `.nvmrc` if provided)
- **Package Manager**: pnpm (preferred) or npm
- **Angular CLI**: Latest stable version
- **Git**: For version control
- **VS Code**: Recommended IDE with Angular extensions

### Verify Installation
```bash
node --version     # Should show v20.x.x
npm --version      # Should show 10.x.x or higher
pnpm --version     # Should show 8.x.x or higher (if using pnpm)
```

## Quick Setup

### 1. Initialize Angular Project
```bash
# Navigate to project root
cd /path/to/spec-kit-demo-UI

# Create Angular application
npx @angular/cli@latest new accounting-invoicing-ui \
  --routing=true \
  --style=scss \
  --strict=true \
  --package-manager=pnpm \
  --skip-git=true

# Move into the app directory
cd accounting-invoicing-ui
```

### 2. Install Dependencies
```bash
# Core dependencies
pnpm install @angular/cdk @angular/common @angular/core @angular/forms @angular/router

# Development dependencies
pnpm install -D @types/node typescript

# Tailwind CSS
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Testing dependencies
pnpm install -D @playwright/test

# Linting and formatting
pnpm install -D eslint prettier eslint-config-prettier @typescript-eslint/eslint-plugin

# Git hooks
pnpm install -D husky lint-staged
```

### 3. Configure TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "dom"],
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "useDefineForClassFields": false,
    "experimentalDecorators": true,
    "baseUrl": "./",
    "paths": {
      "@features/*": ["src/app/features/*"],
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

### 4. Configure Tailwind CSS (tailwind.config.js)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
```

### 5. Update Angular CLI Configuration (angular.json)
Add performance budgets and build optimizations:
```json
{
  "projects": {
    "accounting-invoicing-ui": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2MB",
                  "maximumError": "3MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "10KB",
                  "maximumError": "20KB"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## Development Workflow

### 1. Start Development Server
```bash
# Start with hot reload
ng serve

# With specific port and host (if needed)
ng serve --port 4200 --host 0.0.0.0
```

Application will be available at `http://localhost:4200`

### 2. Project Structure Setup
Create the feature-based directory structure:
```bash
mkdir -p src/app/features/{accounts,transactions,invoices}
mkdir -p src/app/features/accounts/{components,services,models}
mkdir -p src/app/features/transactions/{components,services,models}
mkdir -p src/app/features/invoices/{components,services,models}
mkdir -p src/app/core/{auth,interceptors,guards}
mkdir -p src/app/shared/{components,services,models,pipes}
```

### 3. Environment Configuration
Create environment files:

**src/environments/environment.ts**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  wsUrl: 'ws://localhost:3000/ws',
  enableAuditLogging: true,
  cacheTimeout: 300000, // 5 minutes
};
```

**src/environments/environment.prod.ts**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.accounting.production.com/v1',
  wsUrl: 'wss://api.accounting.production.com/ws',
  enableAuditLogging: true,
  cacheTimeout: 300000, // 5 minutes
};
```

## Key Components Development

### 1. Create Core Authentication Service
```bash
ng generate service core/auth/auth --skip-tests
ng generate service core/auth/tenant --skip-tests
```

### 2. Create HTTP Interceptors
```bash
ng generate interceptor core/interceptors/tenant-isolation --skip-tests
ng generate interceptor core/interceptors/audit-logging --skip-tests
ng generate interceptor core/interceptors/error-handling --skip-tests
```

### 3. Create Feature Services
```bash
# Account services
ng generate service features/accounts/services/account --skip-tests
ng generate service features/accounts/services/account-store --skip-tests

# Transaction services
ng generate service features/transactions/services/transaction --skip-tests
ng generate service features/transactions/services/ledger --skip-tests

# Invoice services
ng generate service features/invoices/services/invoice --skip-tests
ng generate service features/invoices/services/invoice-pdf --skip-tests
```

### 4. Create Feature Components
```bash
# Account components
ng generate component features/accounts/components/account-list --skip-tests
ng generate component features/accounts/components/account-detail --skip-tests

# Transaction components
ng generate component features/transactions/components/transaction-list --skip-tests
ng generate component features/transactions/components/transaction-detail --skip-tests

# Invoice components
ng generate component features/invoices/components/invoice-list --skip-tests
ng generate component features/invoices/components/invoice-detail --skip-tests
```

## Testing Setup

### 1. Unit Testing
```bash
# Run unit tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run tests in watch mode
ng test --watch
```

### 2. E2E Testing with Playwright
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test

# Run tests in headed mode (show browser)
npx playwright test --headed

# Run tests on specific browser
npx playwright test --project=chromium
```

### 3. Configure Playwright (playwright.config.ts)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Code Quality Setup

### 1. ESLint Configuration (.eslintrc.json)
```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "@typescript-eslint/recommended-requiring-type-checking"
      ],
      "parserOptions": {
        "project": ["tsconfig.json"]
      },
      "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/prefer-readonly": "error"
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {}
    }
  ]
}
```

### 2. Prettier Configuration (.prettierrc.json)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 3. Git Hooks with Husky
```bash
# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

**package.json** lint-staged configuration:
```json
{
  "lint-staged": {
    "*.{ts,html}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Development Commands

### Common Commands
```bash
# Development
npm start               # Start development server
npm run build          # Build for production
npm run build:dev      # Build for development
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
npm run test           # Run unit tests
npm run e2e            # Run E2E tests

# Code generation
ng generate component <name>    # Generate component
ng generate service <name>      # Generate service
ng generate guard <name>        # Generate guard
ng generate interceptor <name>  # Generate interceptor
```

### Build Commands
```bash
# Development build
ng build

# Production build with optimization
ng build --configuration=production

# Build with bundle analysis
ng build --stats-json
npx webpack-bundle-analyzer dist/accounting-invoicing-ui/stats.json
```

## Mock Backend (Development)

For local development without backend dependency, create a mock API server:

### 1. Install JSON Server
```bash
pnpm install -D json-server
```

### 2. Create Mock Data (db.json)
```json
{
  "accounts": [
    {
      "id": "acc-1",
      "tenantId": "tenant-1",
      "name": "City General Hospital",
      "type": "ORGANIZATION",
      "currentBalance": { "value": 2500.75, "cents": 250075, "formatted": "$2,500.75", "currency": "USD" },
      "status": "ACTIVE",
      "lastInvoiceDate": "2026-01-31"
    }
  ],
  "ledgerEntries": [
    {
      "id": "le-1",
      "accountId": "acc-1",
      "tenantId": "tenant-1",
      "postingDate": "2026-02-09T14:30:00Z",
      "sourceType": "RIDE",
      "debitAmount": { "value": 125.50, "cents": 12550, "formatted": "$125.50", "currency": "USD" },
      "creditAmount": { "value": 0, "cents": 0, "formatted": "$0.00", "currency": "USD" },
      "runningBalance": { "value": 2500.75, "cents": 250075, "formatted": "$2,500.75", "currency": "USD" },
      "readonly": true
    }
  ],
  "invoices": [
    {
      "id": "inv-1",
      "number": "INV-2026-001",
      "accountId": "acc-1",
      "tenantId": "tenant-1",
      "totalAmount": { "value": 500.00, "cents": 50000, "formatted": "$500.00", "currency": "USD" },
      "status": "ISSUED"
    }
  ]
}
```

### 3. Start Mock Server
```bash
# Add to package.json scripts
"mock-api": "json-server --watch db.json --port 3000"

# Start mock server
npm run mock-api
```

## Performance Monitoring

### 1. Performance Testing
Create performance test scenarios:
```javascript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Requirements', () => {
  test('Account list loads within 30 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/accounts');
    await page.waitForSelector('[data-testid="account-list"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(30000); // 30 second requirement
  });

  test('Transaction list loads within 2 seconds', async ({ page }) => {
    await page.goto('/accounts/acc-1/transactions');
    
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="transaction-list"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000); // 2 second requirement
  });

  test('Invoice list loads within 1 second', async ({ page }) => {
    await page.goto('/accounts/acc-1/invoices');
    
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="invoice-list"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(1000); // 1 second requirement
  });
});
```

### 2. Bundle Analysis
```bash
# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/accounting-invoicing-ui/stats.json
```

## Troubleshooting

### Common Issues

**TypeScript Strict Mode Errors**:
- Enable strict mode gradually by addressing type safety issues
- Use branded types for financial data safety
- Ensure all APIs return properly typed responses

**Performance Issues**:
- Use OnPush change detection strategy
- Implement virtual scrolling for large datasets
- Enable proper HTTP caching with appropriate TTL

**Tailwind CSS Not Working**:
- Verify `tailwind.config.js` content paths
- Check that styles are imported in `styles.scss`
- Restart development server after config changes

**Testing Issues**:
- Ensure test data matches production data structures
- Use proper TypeScript types in test files
- Configure Playwright with correct base URL

### Debug Commands
```bash
# Angular CLI debug info
ng version

# Check TypeScript config
npx tsc --showConfig

# Lint specific files
npx eslint src/app/**/*.ts

# Test specific component
ng test --include='**/account-list.component.spec.ts'
```

## Next Steps

1. **Review Documentation**: 
   - Check [data-model.md](./data-model.md) for entity definitions
   - Review [contracts/](./contracts/) for API specifications
   - Read [research.md](./research.md) for architectural decisions

2. **Implement User Stories**:
   - Start with P1: Account Discovery and Selection
   - Proceed to P2: Transaction History Review
   - Continue with P3: Invoice Management
   - Finish with P4: Cross-Reference Navigation

3. **Follow Constitutional Requirements**:
   - Implement production-grade code from day one
   - Ensure financial data integrity with read-only constraints
   - Add comprehensive test coverage
   - Maintain tenant isolation at all levels

4. **Performance Optimization**:
   - Monitor build performance budgets
   - Test against performance requirements regularly
   - Implement caching strategies per research findings

For additional help, refer to the feature specification in [spec.md](./spec.md) or the implementation plan in [plan.md](./plan.md).