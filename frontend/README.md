# Frontend Starter (React + Vite + TypeScript)

Included concepts:
- Auth context with persistent login & session expiry handling (`AuthContext.tsx`).
- Preferences context for locale/currency bootstrap.
- Central axios instance with interceptors (`utils/api.ts`).
- Basic API call helper distinguishing auth vs general calls.

## Environment

Create `.env` or use Vite env variables:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Usage

Wrap app root:
```
<AuthProvider><PreferencesProvider><App/></PreferencesProvider></AuthProvider>
```

Call login:
```
const { login } = useAuth();
await login(username, password);
```

API helper auto-adds `Authorization` header and redirects on 401/403.

## Customization
- Add route guarding with React Router `Navigate` if `!isLoggedIn`.
- Integrate feature gating by checking `user.subscription.planType` from user object.
- Extend `apiCall` to include retry / backoff or instrumentation.
