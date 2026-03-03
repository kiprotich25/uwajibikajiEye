# Uwajibikaji-Eye

> Civic Transparency Platform — Tracking misuse of public resources in Kenyan political campaigns.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet + OpenStreetMap |
| Package Manager | pnpm |

## Quick Start

### Prerequisites
- Node.js ≥ 18
- pnpm (`npm install -g pnpm`)
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### 2. Environment Setup

Copy `server/.env` and fill in your values:
```
MONGO_URI=mongodb://localhost:27017/uwajibikaji-eye

PORT=5000
```

Client `.env` (optional):
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd server
node seed.js
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
pnpm dev

# Terminal 2 — Frontend
cd client
pnpm dev
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reports` | Create a new misuse report |
| GET | `/api/reports` | List all reports |
| GET | `/api/reports/candidate/:name` | Reports by candidate |
| GET | `/api/dashboard` | Dashboard aggregated stats |
| GET | `/api/candidates` | All candidates with risk levels |
| GET | `/api/candidates/:name` | Candidate profile + timeline |






## Risk Scoring

| Reports | Risk Level |
|---|---|
| 1–2 | 🟢 LOW |
| 3–5 | 🟡 MEDIUM |
| 6+ | 🔴 HIGH |

## Project Structure

```
uwajibikaji-eye/
├── server/
│   ├── controllers/
│   │   ├── reportController.js
│   │   ├── dashboardController.js
│   │   ├── ussdController.js
│   │   └── candidateController.js
│   ├── models/
│   │   └── Report.js
│   ├── routes/
│   │   ├── reportRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── ussdRoutes.js
│   │   └── candidateRoutes.js
│   ├── services/
│   │   └── riskService.js
│   ├── index.js
│   ├── seed.js
│   └── .env
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ReportForm.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── MapView.jsx
    │   │   ├── CandidatesPage.jsx
    │   │   └── CandidatePage.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StatCard.jsx
    │   │   └── RiskBadge.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── index.css
    └── vite.config.js
```

## Deployment

### Backend → Render
- Build command: `pnpm install`
- Start command: `node index.js`
- Set `MONGO_URI`  environment variable

### Frontend → Vercel
- Framework: Vite
- Build command: `pnpm build`
- Output directory: `dist`
- Set `VITE_API_URL` to your Render backend URL

---

Built for civic transparency in Kenya 🇰🇪
