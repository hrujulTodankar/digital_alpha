# Architectural Decisions Log

## Template

**Date:** [YYYY-MM-DD]  
**Context:** [Brief description of the context or problem]  
**Decision:** [What decision was made]  
**Rationale:** [Why this decision was made]  
**Trade-offs:** [What are the consequences of this decision]  

---
## Decisions

**Date:** 2026-08-26  
**Context:** Project initialization and technology stack selection.  
**Decision:** Use Next.js (React/TS), Python (FastAPI/Flask), PostgreSQL (v16+). Custom CSS for main transactions table without using component libraries.  
**Rationale:** Mandated by project requirements for a data-heavy financial consumer application.  
**Trade-offs:** Custom table implementation will take more development time but provides full control over performance and styling.

**Date:** 2026-08-26  
**Context:** Phase 1 Backend and Database setup.  
**Decision:** 
1. Use **FastAPI** as the Python backend framework.
2. Use **PostgreSQL** for the relational database schema, leveraging SQLAlchemy for ORM.
3. Schema includes `users`, `transactions`, and `rewards` tables with proper foreign key relationships (no dumped JSON columns).
**Rationale:** FastAPI offers excellent performance and automatic validation/documentation. PostgreSQL satisfies the strict requirement for a robust relational database.  
**Trade-offs:** Requires strict type definitions (Pydantic models) but ensures high data integrity.

**Date:** 2026-08-26  
**Context:** Phase 2 Custom Table for 10,000 Transactions.  
**Decision:** Implement **Server-Side Pagination** instead of Client-Side Virtualization.  
**Rationale:** Next.js Server Components excel at fetching small chunks of data natively. Sending 10,000 rows (megabytes of JSON) to the client at once just to virtualize them is extremely inefficient for bandwidth and initial load times. Pagination keeps the DOM lightweight and provides a faster Time To Interactive (TTI).  
**Trade-offs:** Users cannot infinitely scroll through all 10,000 rows without explicitly clicking to the next page.

**Date:** 2026-08-26  
**Context:** Phase 3 Analytics & Filtering State Management.  
**Decision:** Use **URL Search Params** (Server Components) instead of React Context / useState for cross-filtering.  
**Rationale:** Next.js App Router thrives when state is kept in the URL. By pushing `/?category=X` when a chart is clicked, the Next.js server automatically re-fetches data, caches it correctly, and users can share URLs. Avoids "prop drilling" entirely.  
**Trade-offs:** Every filter change triggers a server request, meaning we rely on fast backend queries.

**Date:** 2026-08-26  
**Context:** Phase 3 Rewards Redemption.  
**Decision:** Implement **Optimistic UI Updates**.  
**Rationale:** Financial applications need to feel instant. Subtracting coins locally before the HTTP request resolves ensures maximum perceived performance. We added a `try/catch` rollback to prevent data inconsistency if the network fails.
