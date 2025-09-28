## synqr.ai

AI-powered smart scheduling. Frontend by v0, backend integrated with Supabase (auth, RLS, realtime).

### Prerequisites
- Node 18+
- pnpm or npm
- Supabase project

### Environment
Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# optional fallbacks
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

### Database setup
Run these SQL files in Supabase SQL editor (in order):
- `scripts/001_create_tables.sql`
- `scripts/002_create_profile_trigger.sql`

### Development
```
pnpm install
pnpm dev
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
- Realtime updates wired via `hooks/use-realtime.ts` and `components/realtime-dashboard.tsx`.


