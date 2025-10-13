# Theme Selector – Component Design Specification

**Version:** 1.0  
**Status:** Draft for Development  
**Prepared for:** Windsurf Engineering Team  
**Date:** 2025-07-14  
**Prepared by:** AQUORIX UI/UX & Product Teams

---

## 1. Purpose
The Theme Selector is a reusable React component rendered during Step 2 of the AQUORIX onboarding wizard. It enables users (primarily Pro users, Tiers 1–4) to visually preview and optionally select an alternate dashboard theme instead of the default assigned by tier.

This component directly contributes to personalization, onboarding delight, and proper application of `.aqx-pro-dashboard-theme` variants (e.g., Dive Locker, Stainless Steel, Brass, etc.).

---

## 2. Functional Overview
| Feature                | Description                                                      |
|------------------------|------------------------------------------------------------------|
| Default Theme Highlighting | Automatically highlights default theme assigned by tier          |
| Optional Theme Selection   | User may optionally override the default dashboard theme         |
| Theme Previews             | Visual thumbnails or cards showing example dashboards in each theme |
| Confirmation               | Stores selected theme in Supabase `user_profile.theme_slug`      |
| Accessibility              | Fully keyboard-navigable with screen reader support (ARIA labels) |
| Responsiveness             | Works across desktop and mobile screen widths                    |
| Read-only mode (future)    | Can be rendered non-interactive for theme previews after onboarding |

---

## 3. UI Layout & Interactions
**Component Structure (Visual Layout):**
```jsx
<ThemeSelector>
  <ThemeOptionCard theme="dive-locker" selected />
  <ThemeOptionCard theme="brass" />
  <ThemeOptionCard theme="stainless-steel" />
  <ThemeOptionCard theme="scuba-pro" />
  ...
</ThemeSelector>
```

**ThemeOptionCard Layout:**
- Thumbnail image (320x180 recommended)
- Theme name (e.g., “Stainless Steel”)
- Short description (max 80 characters)
- “Select” button or checkbox (active state for selected)
- Hover/focus effects (outline, highlight, or glow)
- WCAG AA-compliant contrast and focus ring

---

## 4. Component API Design
**Props: ThemeSelector.tsx**
| Prop           | Type     | Description                                            |
|----------------|----------|--------------------------------------------------------|
| defaultTheme   | string   | Slug of the default theme from tier assignment         |
| selectedTheme  | string   | Currently selected theme                               |
| onSelectTheme  | (slug) => void | Callback triggered when user selects a theme      |
| readOnly       | boolean  | If true, disables selection UI (optional)              |

**Props: ThemeOptionCard.tsx**
| Prop      | Type         | Description                                   |
|-----------|--------------|-----------------------------------------------|
| theme     | ThemeMetadata| Object with slug, name, description, image path|
| selected  | boolean      | Whether this card is currently selected        |
| onSelect  | () => void   | Triggers when card is selected                 |
| disabled  | boolean      | Disable interaction if true                   |

---

## 5. Data Model (Supabase Integration)
- **Table:** `user_profile`
- **Field:** `theme_slug` (TEXT, nullable)
- Value must match a registered theme slug (e.g., `dive-locker`, `brass`)
- If null, tier default theme will apply in dashboard
- Mutation occurs in Step 2 of onboarding wizard:
```ts
supabase.from('user_profile').update({ theme_slug: 'brass' }).eq('user_id', session.user.id)
```

---

## 6. Theme Registry
Themes will be sourced from a static list or dynamic theme config file.
```ts
const THEMES = [
  {
    slug: 'dive-locker',
    name: 'Dive Locker',
    description: 'Confident, aquatic theme grounded in deep ocean tones.',
    image: '/themes/dive-locker.png',
  },
  {
    slug: 'brass',
    name: 'Brass',
    description: 'Classic vintage dive helmet aesthetic.',
    image: '/themes/brass.png',
  },
  // ...
];
```

---

## 7. Styling and Classes
- Applies classes from `.aqx-theme-selector`, `.theme-option-card`, and BEM naming for modifiers
- Active cards include `.selected` class for highlighting
- Theme previews may use CSS modules or Tailwind variants

---

## 8. Accessibility Requirements
- Each card must include:
  - ARIA labels (e.g., aria-label="Select Dive Locker theme")
  - Keyboard focus (`tabIndex=0`)
  - Selection possible via keyboard (Enter/Space)
  - High contrast outline/focus ring on hover/focus

---

## 9. Error Handling
- If Supabase update fails, display inline error via `<ErrorBanner />`
- Allow retrying theme selection or proceed with fallback to default theme

---

## 10. Development Tasks
- Build ThemeSelector parent component
- Build ThemeOptionCard subcomponent
- Integrate with Step 2 of OnboardingWizard
- Connect to Supabase update mutation
- Implement error handling and loading states
- Ensure full accessibility (Lighthouse audit)

---

## 11. Future Enhancements (Post-V1)
- Support theme preview overlay or interactive demo modal
- Allow switching themes post-onboarding via dashboard settings
- Persist theme in localStorage for quicker preview

---

**Document Status:**
- ✅ Ready for Windsurf UI wireframing and initial component scaffolding.
- 🔄 Awaiting review from AQUORIX Product/Design before development.
