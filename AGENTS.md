# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js (Pages Router) chat application** (Chat-Siris-v2). The frontend is the only service in this repo; the backend API is external at `https://chat-siris-v2-server.vercel.app`.

### Running the dev server

```bash
npm run dev       # starts on http://localhost:3000
npm run build     # production build (also validates types)
```

### Key gotchas

- **No ESLint config or lint script** exists. Use `npm run build` as the primary validation step (it runs type-checking and compilation).
- **No automated tests** exist in this repo.
- **Authentication requires Google OAuth credentials.** The app uses NextAuth.js with a Google provider. Without valid `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`, the Google sign-in flow won't complete. The login page will still render.
- **Backend is external.** All API calls go to `https://chat-siris-v2-server.vercel.app` (hardcoded in `utils/ApiRoutes.js`). The Socket.IO server URL is set via `NEXT_PUBLIC_SERVER_BASE` env var.
- **Required `.env.local` variables:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`, `NEXT_PUBLIC_SERVER_BASE`, `NEXT_PUBLIC_IMAGEKIT_ID`, `NEXT_PUBLIC_IMAGEKIT_PRIVATE`, `NEXT_PUBLIC_IMAGEKIT_ENDPOINT`.
- **Node.js compatibility:** The lockfile is from an older npm version. `npm install` will show deprecation warnings but works fine on Node 22.x. The `next-auth` package warns about unsupported engine but functions correctly.
