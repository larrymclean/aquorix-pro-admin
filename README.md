# AQUORIX Pro Admin – Dashboard Prototype

Project: AQUORIX Pro Admin Dashboard (React)  
Version: v0.1.0-dashboard-proto (recovered)  
Environment: Node + React + React Router  
Status: Recovery in progress (25 Nov 2025)

This repository contains the recovered AQUORIX Pro Admin dashboard shell, including:

- Admin layout (sidebar + top nav + content)
- Pro Dashboard placeholder page (wired to Supabase-backed backend)
- Partner/Affiliate dashboard placeholder (Tier 5)
- Theme provider + tier-based theme selection

It is the canonical reference for the next iteration of the AQUORIX Pro Dashboard, which will later integrate the Booking/Scheduler v3 module.

---

## 📁 Directory Structure (Key Files)

```text
aquorix-pro-admin/
  src/
    layouts/
      AQXAdminLayout.tsx        # Main admin layout shell (sidebar + top nav + content)
    pages/
      DashboardPlaceholder.tsx  # Pro dashboard entry screen (tier + onboarding status)
      PartnerDashboardPlaceholder.tsx  # Partner/affiliate (Tier 5) dashboard placeholder
    components/
      SidebarNavigation.tsx     # Admin sidebar navigation
      TopNav.tsx                # Top navigation bar
      AdminContent.tsx          # Routes/content area for main admin pages
      ThemeProvider.tsx         # Theme context for admin UI
      UserContext.tsx           # User/tier context (used by layout)
    theme.config.ts             # Theme definitions & getThemeByTier(tier)
    styles/
      AQXAdmin.css              # Core admin layout styling (sidebar + content)
      TopNav.css                # Top nav styling

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
