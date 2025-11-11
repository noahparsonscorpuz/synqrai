<img width="1280" height="584" alt="Screenshot 2025-11-10 at 7 41 02 PM" src="https://github.com/user-attachments/assets/bfac6d24-b191-4431-92eb-3bef156a1671" />

## ⚡ Tech Stack
<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" height="28" alt="React" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" height="28" alt="Vite" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" height="28" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwind-css&logoColor=white" height="28" alt="Tailwind CSS" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" height="28" alt="Supabase" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" height="28" alt="Express" /></a>
  <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn/ui-black?logo=radixui&logoColor=white" height="28" alt="shadcn/ui" /></a>
  <a href="#"><img src="https://img.shields.io/badge/AI-FFDD00?logo=python&logoColor=black" height="28" alt="AI Engine" /></a>
</p>

## 📊 Architecture
```mermaid
graph TD;
    User[🧑 User] -->|Set availability & preferences| Frontend[React + Vite + Tailwind + shadcn/ui]
    Frontend -->|Send data| Backend[Express API]
    Backend -->|Store & retrieve| Database[Supabase Database]
    Database -->|Fetch constraints & availability| Scheduler[⚡ AI Scheduling Engine]
    Scheduler -->|Optimal times| Backend
    Backend -->|Send calendar invites| Calendar[Google / Outlook / iCal]
    Calendar -->|Notify participants| User
```

### Prerequisites
- Node 18+
- pnpm or npm
- Supabase project

### Environment
Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# optional fallbacks (outdated)
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

### 🗄 Database setup
Run the SQL files found in the `/scripts` directory **in order** using the Supabase SQL editor:
- `scripts/001_create_tables.sql`
- `scripts/002_create_profile_trigger.sql`
- `scripts/003_alter_meetings_add_date_range.sql`
- `etc.`

## 🛠 Quick Start
```
pnpm install
pnpm dev
# Open http://localhost:3000 in your browser
```

### API
- `POST /api/meetings` create meeting
- `GET /api/meetings` list meetings
- `GET /api/meetings/:id` meeting details
- `GET /api/availability?meetingId=...` get current user's availability for meeting
- `POST /api/availability` upsert availability
- `POST /api/schedule` schedule meeting (creator only)

### Notes
- RLS policies protect data; ensure you are signed in to use APIs.
- Realtime updates wired via. `hooks/use-realtime.ts` and `components/realtime-dashboard.tsx`.
