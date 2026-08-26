# Execution Path Map

## Template

**Trigger:** [e.g., User clicks "Pay Bill"]  
**Frontend API Call:** [e.g., `POST /api/v1/payments`]  
**Backend Validation:** [e.g., Validate amount, check balance]  
**Database Transaction:** [e.g., Update balances table, insert transaction log]  
**Resolution:** [e.g., Return 200 OK, update UI state]  

---
## Flows

### Fetching Transactions
**Trigger:** User navigates to the Transactions Dashboard. - Data: Frontend requests `GET /api/transactions?page=1&size=20`. Server responds with `PaginatedTransactions` model. Client renders items, handles navigation via links.

### Chart Filtering Flow
- Interaction: User clicks on a pie slice (e.g. "Groceries") in `CategoryChart`.
- Routing: Next.js router pushes `/?category=Groceries`.
- Rendering: Server Component `TransactionsDashboard` receives new `searchParams`, fetches `GET /api/transactions?category=Groceries`, and returns the filtered HTML to the client.

### Optimistic UI Redemption Flow
- Action: User confirms redemption of a reward.
- State: Local React state (`balance`) immediately deducts the cost (Optimistic Update).
- Request: `POST /api/redeem` fired in background.
- Success: `router.refresh()` called to resync the exact server state.
- Failure (Rollback): Local state reverts to the previous balance, and an error alert is shown.

### Redeeming Reward
**Trigger:** User clicks "Redeem" on a reward in the catalogue.  
**Frontend API Call:** `POST /api/redeem` (Payload: `{ "user_id": "...", "reward_id": "..." }`)  
**Backend Validation:** Fetches user and reward. Validates user exists, reward exists, and user has sufficient `coin_balance`.  
**Database Transaction:** Row-level lock (`FOR UPDATE`) on user. Deducts `cost_in_coins` from `coin_balance`. Commits transaction.  
**Resolution:** Returns success message and `new_balance`. If validation fails, returns `400` or `404`.
