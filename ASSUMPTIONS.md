# Product Assumptions

During the development of this financial application, the following top assumptions were made to guide the implementation:

1. **Transaction Data Polarity**: We assumed that all transaction amounts provided in the raw JSON feed are absolute values representing expenses. The UI renders these as deductions (using a specific color class) unless otherwise specified.
2. **User Authentication & Context**: We assumed that user authentication (e.g., JWTs, session cookies) will be handled by a separate identity provider later. For Phase 1-3, all backend requests bypass auth and use a hardcoded `DEMO_USER_ID` to fetch transactions and redeem rewards.
3. **Category Integrity**: We assumed that the categories provided in the data feed are largely fixed. If a transaction arrives with a missing or null category, the UI and Analytics endpoints will group it under a generic "Other" or blank category without breaking the charts.
