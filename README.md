# CruxMetrics

CruxMetrics is a web performance analytics tool that uses Google Chrome UX Report (CrUX) data to help customers identify slow pages and provide actionable insights. This repository contains both a **React frontend** and a **Node.js/Express backend** with dummy data handling and future-ready CrUX API integrations.

---

## 📁 Project Structure

- `/frontend` - React application built with Vite.
- `/backend` - Express server handling API endpoints, dummy data, and future CrUX/BigQuery integration.
- `/IMPLEMENTATION_PLAN.md` - Detailed design & implementation roadmap.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Frontend uses React 18 with MUI; ensure your environment supports React 18.
- (Optional) Google Cloud credentials for CrUX BigQuery access

### Setup

1. **Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env           # configure your API keys
   npm run dev                    # start backend (will listen on port 5000)
   ```

2. **Frontend**

   ```bash
   cd ../frontend
   npm install
   # if backend is exposed on a different host/port (e.g. codespace
   # preview URL) set the API base URL via an environment variable
   # before starting:
   #
   #   export VITE_API_BASE_URL="https://1234-5000.preview.app.github.dev"
   #
   npm run dev                    # start frontend (default port 5173)
   ```

3. Open `http://localhost:5173` in your browser and start entering URL(s) to fetch CrUX metrics.

---

## 📦 Features (implemented)

- Search by one or more URLs
- Choose data source: CrUX API or CrUX BigQuery
- Table view powered by Material UI DataGrid
- Client-side pagination, sorting, and filtering
- Frontend caching for recently fetched URLs
- Dummy data structures to simulate API responses
- Context-based state management (MetricsContext & CacheContext)
- Robust error handling with ErrorBoundary

---

## 🛠️ Backend Details

- **Controllers:** Request validation, logic, response formatting
- **Services:** `cruxService.js` & `bigQueryService.js` (with dummy data generation)
- **Utilities:** Validators, constants, logging, error handling
- **Routes**
  - `POST /api/crux-api`
  - `POST /api/crux-bigquery`
  - `GET /api/health` (health check)

Environmental variables are defined in `.env.example` under `/backend`.

---

## 🎨 Frontend Details

- **Contexts**: MetricsContext, CacheContext
- **Hooks**: `useCruxAPI`, `useFilters`, `useSort`, `usePagination`
- **Components**:
  - `SearchComponent` - URL input & source selector
  - `TableComponent` - MUI DataGrid wrapper
  - `PaginationComponent` - navigation controls
  - `LoadingSpinner`, `ErrorBoundary`, `EmptyState`

Styles are built with Material UI and simple CSS.

---

## 📌 Next Steps

1. Replace dummy data with real CrUX API calls once API key is available.
2. Integrate BigQuery with proper credentials.
3. Add tests (unit & E2E).
4. Enhance filtering UI and caching strategy.
5. Deploy using Docker or cloud platform.

Refer to `IMPLEMENTATION_PLAN.md` for a full roadmap.

---

## 📜 License

MIT © CruxMetrics
