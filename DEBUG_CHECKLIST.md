# AQUORIX Pro Admin Dashboard — Tactical Debug Playbook

## Status: Code changes not rendering after edit, restart, and refresh
**Stack:** CRA + React Router v6 + Supabase + Auth wrapper

---

## ✅ Root Causes We Suspect (Based on Symptoms)
| Possibility | Description |
|-------------|------------|
| 1. Cached static assets or service worker | CRA (even in dev mode) may cache aggressively or improperly retain service worker state |
| 2. React hydration mismatch or remount | App tree appears momentarily, then is replaced by a different tree (auth router switch?) |
| 3. Stale build artifacts | build/, node_modules/.cache, or Vite/CRA internals may be serving outdated code |
| 4. Duplicate routing or RequireAuth logic | Routing or <RequireAuth> may remount or redirect before your visible changes appear |
| 5. Linked or symlinked modules | Local packages, monorepos, or symlinks may cause hot reload failure or override edits silently |

---

## 🔍 Step-by-Step Debug Checklist

### 1. Kill All Caches
```bash
# From project root
rm -rf node_modules/.cache build .next .vite dist coverage
rm -rf public/service-worker.js public/manifest.json
npm cache clean --force
npm start
```
- In Chrome: DevTools → Network → Disable Cache (checked) → Cmd+Shift+R
- In Safari: Enable Developer Tools → Empty Caches → reload

### 2. Nuke the Service Worker (if enabled)
- Check `index.tsx` or `src/serviceWorker.ts` for `serviceWorker.register();` (should be `unregister()`)
- In Chrome DevTools → Application → Service Workers → click “Unregister”

### 3. Check App Routing and <RequireAuth> Logic
- Add `console.log('App.tsx rendered');` in App.tsx
- Add `console.log('RequireAuth mounted: user=', user, 'redirecting=', !user);` in RequireAuth.tsx
- Add a visible debug banner outside all routing layers:
  ```jsx
  <div style={{ background: 'red', color: 'white' }}>DEBUG: Main App Loaded</div>
  ```
- If this renders briefly and disappears, auth/router is remounting a different tree.

### 4. Confirm You’re in the Right Folder
```bash
pwd
ls -alh ./src/components/TopNav.tsx
grep -r 'TopNav' .
```
- Check for duplicate folders, symlinks, or alternate versions.

### 5. Confirm What is Being Served
- DevTools → Sources → Find TopNav.tsx, App.js, etc.
- If they don’t match your edits, browser is serving stale builds or you’re editing the wrong path.
- Run `npm run build` then inspect `/build/static/js/main.*.js` for your debug string.

### 6. Force Rebuild and Reset Dev Server
```bash
npm run build
rm -rf build
npm start
```
- Test in Incognito mode with cache disabled.

---

## 📌 Additional Tactics
- **Temporary:** Inject Inline Alert in HTML
  - In `public/index.html`, add:
    ```html
    <div style="background:red;color:white;">PUBLIC INDEX DEBUG BANNER</div>
    ```
  - If that doesn’t show up — you’re not even serving from this folder.

---

## 💡 Known Issues with CRA + Supabase
| Issue | Resolution |
|-------|------------|
| CRA + SW enabled by default | Unregister and delete SW |
| Auth remounting React tree | Log routing logic carefully |
| CRA not hot-reloading TS changes | Restart server, check file watchers |
| Supabase redirect interfering with route tree | Wrap <RequireAuth> carefully to prevent page jank |

---

**Task | Owner | Status**
- Clear cache, build, SW | Windsor | 🔁
- Confirm RequireAuth flow | Larry | 🔁
- Add console + inline debug | Windsor | 🔁
- Check CRA env paths | Windsor | 🔁
- Reboot Windsurf IDE | Larry | 🔁

---

**Use this checklist to track your debugging progress and share with collaborators or AI assistants.**
