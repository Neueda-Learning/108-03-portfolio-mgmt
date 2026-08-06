# Portfolio Management System

A full-stack portfolio tracking platform to manage holdings, monitor diversification, and surface recommendation insights for each user.

---

## Overview

This project provides:

- **Interactive Dashboard** for portfolio summary, top holdings, market status, allocation, and recommendations
- **Holdings Management** with add/edit/delete workflows
- **Insights Engine Integration** via backend recommendation endpoints
- **User-scoped data** so each selected user sees independent portfolio/holding state

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts
- Axios

### Backend
- REST API (Spring Boot style routes)
- User/portfolio/holdings/insights resources

---

## Repository Structure

```text
108-03-portfolio-mgmt/
├─ backend/        # API services and domain logic
├─ frontend/       # React UI (Dashboard, Holdings, Components, Services)
└─ README.md       # Project documentation
```

---

## Core Features

- Dashboard summary metrics (invested value, market value, P/L, returns)
- Top holdings table (from portfolio API; no dummy fallback)
- Asset allocation donut chart
- Portfolio recommendation card with:
  - Asset ticker
  - Risk cluster
  - Volatility (%)
  - Annual return (%)
  - Recommendation text
- Allocation threshold alerts for overexposure
- Holdings page powered by holdings APIs:
  - List by user
  - Edit by holdingId
  - Delete by holdingId
- Asset enrichment on holdings using `assetId -> /api/assets/{assetId}`

---

## API Endpoints Used

### Dashboard
- `GET /api/portfolio/{userId}`  
- `GET /api/insights/{userId}`

### Holdings
- `GET /api/holdings/user/{userId}`
- `POST /api/holdings`
- `PUT /api/holdings/{holdingId}`
- `DELETE /api/holdings/{holdingId}`

### Asset metadata
- `GET /api/assets/{assetId}`

---

## Getting Started

## 1) Start Backend

From project root:

```bash
cd c:\Users\Administrator\108-03-portfolio-mgmt\backend
# Example (adjust to backend project):
# mvn spring-boot:run
```

## 2) Start Frontend

```bash
cd c:\Users\Administrator\108-03-portfolio-mgmt\frontend
npm install
npm run dev
```

Frontend default URL:
- `http://localhost:5173`

---

## Frontend Scripts

Run inside `frontend/`:

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
```

---

## Data Flow Notes

- **Dashboard** remains dependent on `/api/portfolio/{userId}` for summary/top holdings/allocation.
- **Holdings page** uses `/api/holdings/user/{userId}` for row-level operations with actual `holdingId`.
- If holdings response has only `assetId`, UI resolves readable `asset` and `type` using `/api/assets/{assetId}`.

---

## UX Behaviors Implemented

- Recommendation table includes loading + empty states
- Risk cluster badges:
  - Balanced → green
  - Moderate → yellow
  - Volatile → red
  - Unknown → gray
- Market status simulation updates every 5 seconds with bounded fluctuation
- Allocation alerts show one or multiple warnings when thresholds are exceeded

---

## Troubleshooting

- **`does not provide an export named ...`**  
  Verify named imports match service exports.
- **Holdings API 404**  
  Confirm backend route path and base URL (`/api/holdings/user/{userId}` vs alternatives).
- **Edits not reflecting**  
  Check `PUT /api/holdings/{holdingId}` request payload and backend response code in Network tab.
- **Blank dashboard widgets**  
  Validate selected user ID and corresponding backend data availability.

---

## Recommended Future Improvements

- Add authentication/authorization
- Add pagination/sorting for holdings
- Add optimistic UI updates for edit/delete


---

## License

Internal project / educational use.
