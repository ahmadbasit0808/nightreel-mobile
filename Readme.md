# Nightreel Mobile (Expo + React Native + Expo Router)

Nightreel is a mobile app for tracking movies you watch, building a watchlist, and writing reviews.

## Tech Stack

- **Expo** (managed workflow)
- **React Native**
- **expo-router** (file-based routing)
- **Axios** (API client)
- **AsyncStorage** (persist user, theme, and session cookie)
- **expo-updates** (OTA updates in production)

## App Structure (Routes)

This app uses route groups under `app/`:

- **Tabs** (hidden header):
  - `app/(tabs)/index.js` → Home / landing
  - `app/(tabs)/profile.js` → Profile area with tabs (Watchlist / Watched / Reviews)
- **Auth**:
  - `app/(auth)/login.js`
  - `app/(auth)/signup.js`
- **Movies**:
  - `app/movies/[id].js` → Movie detail, watched/watchlist actions, and review form

Root layout:

- `app/_layout.js` wraps screens with `ThemeProvider` and `AuthProvider`.

## Features

### Authentication

- `lib/AuthContext.js` manages `user`, `login`, `signup`, and `logout`.
- User is persisted in `AsyncStorage` under `"user"`.
- After login/signup, the app navigates to:
  - `/(tabs)/profile`

### API + Session Cookies

- `lib/api.js` configures an Axios instance:
  - Base URL: `${EXPO_PUBLIC_API_URL}/api` (fallback: `http://localhost:5000`)
- Cookie handling:
  - Request interceptor loads `session_cookie` from `AsyncStorage` and sends it via `Cookie` header.
  - Response interceptor reads `set-cookie`, stores the first `session_cookie` part into `AsyncStorage`, and reuses it for subsequent calls.

### Movies, Watchlist, Watched

Movie detail (`app/movies/[id].js`) provides actions:

- Mark as **Watched** / Unmark Watched
- Add to **Watchlist** / Remove from Watchlist

### Reviews

- Review form is available on the movie detail screen when the user is signed in.
- Reviews are fetched as part of the profile screen.

### Theming

- `lib/ThemeContext.js` provides `ThemeProvider` with `dark` and `light` palettes.
- Theme mode is persisted in `AsyncStorage` under `"theme"`.

### OTA Updates

- `lib/useOTAUpdate.js` checks for OTA updates when **not in development** (`__DEV__` guard).
- Used inside `app/_layout.js`.

## Environment Variables

Set the API endpoint via:

- `EXPO_PUBLIC_API_URL`
  - Example (EAS / `eas.json`): `https://nightreel-backend-production.up.railway.app`

> Note: This is a React Native / Expo env var. Keep it prefixed with `EXPO_PUBLIC_`.

## Setup & Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file (if you use `.env`):
   - Copy `.env.example` → `.env`
   - Ensure `EXPO_PUBLIC_API_URL` points to your backend.

3. Start the Expo dev server:

   ```bash
   npx expo start
   ```

4. Run on a device/emulator using the Expo QR workflow.

## Build & Release (EAS)

This project is configured for EAS builds in `eas.json`.

- Preview build uses `channel: preview`
- Production build uses `channel: production`
- Both set `EXPO_PUBLIC_API_URL` to the production backend URL

Common EAS commands:

```bash
npx eas build --profile preview
npx eas build --profile production
```

## Key Files

- `app/_layout.js` – app root stack + providers + OTA hook
- `lib/api.js` – Axios client + cookie persistence
- `lib/AuthContext.js` – authentication state and actions
- `lib/ThemeContext.js` – theme state and palette
- `app/movies/[id].js` – movie details, watch actions, review submission
- `app/(tabs)/profile.js` – watchlist/watched/reviews UI

## Notes / Gotchas

- This app expects the backend to support the referenced REST endpoints (e.g. `/api/auth/login`, `/api/movies`, `/api/reviews`, etc.) and to set session cookies via `Set-Cookie`.
- Ensure your backend is reachable from the device/simulator.
- If you run locally, the default fallback is `http://localhost:5000`, which may require emulator/device networking adjustments.
