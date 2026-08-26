# Digital Alpha Financial App

A data-heavy financial consumer application for paying credit-card bills, earning reward coins, and analyzing spending.

## Project Overview
This application provides users with a comprehensive dashboard to view their transaction history, analyze spending habits via interactive charts, and redeem earned coins for rewards. Built with a focus on performance, the app handles a 10,000-row transaction dataset using server-side pagination and custom UI components.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Vanilla CSS (Glassmorphism design system), Recharts.
- **Backend**: Python, FastAPI, SQLAlchemy ORM.
- **Database**: PostgreSQL.

## Local Setup Instructions

You can have both the frontend and backend running locally in strictly under 5 minutes.

### 1. Database & Backend Setup
Make sure you have Python 3.10+ installed.

```bash
# Clone the repository (if applicable) and navigate to the root
cd digital-alpha

# Set up virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the automated seed script to populate PostgreSQL (10,000 transactions)
python -m backend.seed

# Start the FastAPI server
uvicorn backend.main:app --reload
```
The backend will be running at `http://127.0.0.1:8000`.

### 2. Frontend Setup
Open a new terminal window.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start the Next.js development server
npm run dev
```
The frontend will be running at `http://localhost:3000`.

---

## Live Links
- **Live Frontend URL**: [Placeholder: https://your-vercel-deployment.vercel.app]
- **Live Backend URL**: [Placeholder: https://your-render-deployment.onrender.com]

## Done / Not Done / Known Issues

### Done
- PostgreSQL Relational Schema (Users, Transactions, Rewards).
- Seed script that successfully handles bulk insertion of 10,000 rows with foreign key constraints.
- Next.js Dashboard with a strictly custom-built, responsive Table component (no UI libraries).
- Server-side Pagination for massive datasets.
- Interactive Spend Analytics charts (Recharts) with URL-based cross-filtering.
- Optimistic UI state updates for reward redemptions.

### Not Done
- Real User Authentication (OAuth / JWT).
- "Pay Credit Card Bill" endpoint and external payment gateway integration.
- Dark/Light mode toggle (currently strictly Dark/Glassmorphism).

### Known Issues
- Next.js development server may occasionally show a Hydration Mismatch warning if a browser extension (like a password manager or adblocker) modifies the DOM before React hydrates. This does not affect production builds.
