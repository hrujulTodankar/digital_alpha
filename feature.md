# Feature Tracker

## Template

### Phase 1: Database & Backend Setup

**Scope & Goal:**
Set up the PostgreSQL database schema, seed initial data (users, transactions, rewards), and build the foundational FastAPI backend with endpoints for fetching transactions, coins, rewards, and redeeming rewards.

**Implementation Steps:**
- [x] Document the plan in decisions.md and feature.md
- [ ] Design PostgreSQL schema (users, transactions, rewards)
- [ ] Create seed script using transactions.json
- [ ] Set up FastAPI backend architecture (routers, crud, schemas, models)
- [ ] Implement `/api/transactions`, `/api/coins`, `/api/rewards`, `/api/redeem` endpoints

**Verification Checklist:**
- [ ] Seed script runs successfully -> Database populated
- [ ] GET /api/transactions -> Returns paginated transactions
- [ ] POST /api/redeem with insufficient balance -> Returns 400 error
- [ ] POST /api/redeem with valid balance -> Deducts coins and returns success

### Phase 2: Frontend Foundation & Custom Table

**Scope & Goal:**
Initialize Next.js application and build a foundational custom UI system without component libraries. Specifically, build a highly reusable, responsive, and styled `Table` component for the 10,000-row transactions dashboard, utilizing server-side pagination.

**Implementation Steps:**
- [ ] Initialize Next.js (TypeScript, App Router)
- [ ] Setup CSS Variables and internal design system
- [ ] Build `Table` component with sticky headers and UI states
- [ ] Create Transactions Dashboard page
- [ ] Fetch paginated data from `/api/transactions`

**Verification Checklist:**
- [ ] Table renders transactions data correctly
- [ ] Table headers stick to the top on scroll
- [ ] Pagination controls fetch the next/prev pages
- [ ] Table handles mobile viewports correctly (horizontal scroll)

### Phase 3: Spend Analytics, Detail Modal, & Rewards Flow

**Scope & Goal:**
Integrate spend analytics (Recharts) with cross-filtering, build an accessible row detail modal, and implement the rewards redemption flow with optimistic UI updates.

**Implementation Steps:**
- [ ] Backend: Add analytics endpoints and filter support
- [ ] Frontend: Install Recharts and build charts
- [ ] Frontend: Add chart-to-table cross-filtering
- [ ] Frontend: Build custom `Modal` component with focus trap
- [ ] Frontend: Implement Rewards Catalogue and redemption flow

**Verification Checklist:**
- [ ] Clicking chart segment filters table correctly
- [ ] Modal closes on 'Escape' key
- [ ] Coin balance updates immediately on redemption (Optimistic UI)

---
## Features
