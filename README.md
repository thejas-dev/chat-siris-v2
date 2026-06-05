# Chat-Siris v2 (frontend)

Next.js client for Chat-Siris v2. REST traffic goes through the **API gateway**; Socket.IO connects to **realtime-service**. Media uploads use **server-signed** ImageKit tokens (`upload-init` / `upload-complete`) — there is **no** ImageKit private key in the browser bundle.

Live demo: [chat-siris-v2.vercel.app](https://chat-siris-v2.vercel.app)

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js** | 18+ (20 recommended) |
| **chat-siris-gateway** | Port `8080` — JWT, REST proxy |
| **chat-siris-realtime-service** | Port `3333` — Socket.IO |
| **chat-siris-media-service** | Port `3005` — upload signing (via gateway) |
| **auth / user / group / message services** | Required for full app flows |
| **Redis** | Used by gateway and backend services |
| **Google OAuth** | NextAuth — `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |

See [chat-siris-realtime-service/README.md](../chat-siris-realtime-service/README.md) for the full local backend stack.

---

## Quick start

```bash
cd chat-siris-v2
cp .env.example .env
# Fill GOOGLE_* , JWT_SECRET , NEXT_PUBLIC_IMAGEKIT_ENDPOINT

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GATEWAY_BASE` | Yes | Gateway REST base, e.g. `http://localhost:8080` |
| `NEXT_PUBLIC_REALTIME_BASE` | Yes | Socket.IO base, e.g. `http://localhost:3333` |
| `NEXT_PUBLIC_IMAGEKIT_ENDPOINT` | Yes | ImageKit URL endpoint for client uploads (public key comes from `upload-init`) |
| `NEXTAUTH_URL` | Yes | App URL for NextAuth, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth |
| `JWT_SECRET` | Yes | NextAuth session secret |

**Do not set** `NEXT_PUBLIC_IMAGEKIT_PRIVATE` — the private key lives only on **media-service** (`IMAGEKIT_PRIVATE_KEY`).

Legacy `NEXT_PUBLIC_SERVER_BASE` is no longer used after Phase 10 cutover.

### Example `.env` (local)

```env
NEXT_PUBLIC_GATEWAY_BASE=http://localhost:8080
NEXT_PUBLIC_REALTIME_BASE=http://localhost:3333
NEXT_PUBLIC_IMAGEKIT_ENDPOINT=https://ik.imagekit.io/your-id/Chat-Siris-1/

NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-nextauth-secret
```

Gateway must have `MEDIA_SERVICE_ENABLED=true` and `MEDIA_SERVICE_URL` pointing at media-service.

---

## Media upload flow (no client private key)

All channel media and profile images use the same path:

1. `POST /api/auth/media/upload-init` (gateway → media-service) with `{ fileName, mimeType, folder, sizeBytes }`.
2. Browser uploads to `https://upload.imagekit.io/api/v1/files/upload` via `fetch` + `FormData` (not the Node ImageKit SDK).
3. `POST /api/auth/media/upload-complete` with `{ uploadId, url }`.
4. Use the CDN `url` in `sendMessage`, `updateAvatar`, or `deleteBackground` profile calls.

Implementation: `utils/mediaUpload.js` (used by `components/Messages.js` and `pages/index.js`).

**Folders:** `Images`, `Audios`, `Videos`, `Pdfs`, `Zips`, `Codes`.

**Example upload-init request** (after login, Bearer token attached automatically):

```bash
curl -X POST http://localhost:8080/api/auth/media/upload-init \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "photo.png",
    "mimeType": "image/png",
    "folder": "Images",
    "sizeBytes": 102400
  }'
```

**Example response:**

```json
{
  "uploadId": "uuid",
  "signature": "...",
  "token": "...",
  "expire": 1710000000,
  "folder": "Images",
  "publicKey": "public_..."
}
```

---

## Auth & API usage

| Flow | Endpoint | Notes |
|------|----------|--------|
| Login | `POST /api/auth/login` | Body `{ email }` → `accessToken` stored in sessionStorage |
| Register | `POST /api/auth/register` | Body `{ username, email, avatarImage, isAvatarImageSet }` |
| Google | `POST /api/auth/oauth/google` | Body `{ idToken }` after NextAuth |
| Refresh | `POST /api/auth/token/refresh` | Cookie + optional body; retries 401s via `axiosClient` |
| Messages | `POST /api/auth/getMessages` | `{ group, limit?, before? }` — cursor pagination |
| Send message | `POST /api/auth/sendMessage` | `{ group, message, byUserName, byUserImage }` |
| Socket | `NEXT_PUBLIC_REALTIME_BASE` | `auth: { token: accessToken }` — see realtime-service README |

Routes are defined in `utils/ApiRoutes.js`. Authenticated calls use `utils/axiosClient.js`.

---

## Built with

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO client](https://socket.io/)
- [Recoil](https://recoiljs.org/)
- [NextAuth](https://next-auth.js.org/) (Google)

---

## Features

- Text, image, video, audio, PDF, zip, and code file sharing in channels
- Cursor-paginated message history (50 messages per page)
- Real-time delivery via Socket.IO (`msg-recieve`)
- Profile avatar and chat background uploads via signed ImageKit flow
- Channel admin controls, admin-only chat, message delete

---

## Contact

- App: [chat-siris-v2.vercel.app](https://chat-siris-v2.vercel.app)
- GitHub: [thejas-dev/chat-siris-v2](https://github.com/thejas-dev/chat-siris-v2)
