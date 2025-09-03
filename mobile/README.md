# Mobile Starter (Expo / React Native)

Minimal scaffold referencing:
- Auth & Preferences contexts (mirror web logic, secure token storage via `expo-secure-store`).
- Basic navigation stack & tab layout (add as needed).

## Quick Start

```
npm install
npm run start
```

## Suggested Additions
- Token persistence using SecureStore (avoid AsyncStorage for secrets).
- Central API module sharing types with backend (consider generating OpenAPI TypeScript then mapping to RN).
- Feature gating UI for subscription upgrades.
