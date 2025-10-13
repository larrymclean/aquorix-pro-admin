# AQUORIX Onboarding – Base Styles & Theme Tokens Outline

**Purpose:**
Provide a scalable, maintainable foundation for onboarding UI styles using AQUORIX’s theme system, CSS Modules, and design tokens. This outline supports rapid development, theme consistency, and future white-labeling.

---

## 1. Theme Token File Structure

Create a shared TypeScript file for theme tokens:

`src/theme/theme.tokens.ts`

```ts
// AQUORIX Theme Tokens (example)
export const colors = {
  primary: '#0077B6', // Marina Blue Grid
  secondary: '#00B4D8',
  accent: '#FFD166', // Gold (Bamboo Safari)
  background: '#F8F9FA', // Pearl White
  text: '#222',
  error: '#D7263D',
  // ...add more as needed
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '64px',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  round: '50%',
};

export const font = {
  family: 'Inter, Arial, sans-serif',
  sizeBase: '16px',
  sizeHeading: '2rem',
  weightRegular: 400,
  weightBold: 700,
};
```

---

## 2. CSS Module Organization

- **Directory:** `src/styles/onboarding/`
- **Files:**
  - `OnboardingWizard.module.css`
  - `StepHeader.module.css`
  - `ThemeSelector.module.css`
  - `ErrorBanner.module.css`
  - ...etc.
- **Conventions:**
  - Use BEM or camelCase for class names.
  - Reference theme tokens via CSS variables or import from `theme.tokens.ts` (if using CSS-in-JS or vanilla-extract).

---

## 3. Theme Class Application

- Apply `.aqx-pro-dashboard-theme` or `.aqx-affiliate-dashboard-theme` to the root wrapper in `Onboarding.tsx` based on tier or user selection.
- Each theme class sets CSS variables for color, background, and accent tokens:

```css
/* Example: src/styles/themes.css */
.aqx-pro-dashboard-theme {
  --color-primary: #0077B6;
  --color-background: #F8F9FA;
  --color-accent: #FFD166;
  --color-error: #D7263D;
}
.aqx-affiliate-dashboard-theme {
  --color-primary: #3F704D;
  --color-background: #F5F3E7;
  --color-accent: #E6C067;
  --color-error: #B00020;
}
```
- Reference these variables in CSS Modules for buttons, fields, etc.

---

## 4. Example Usage in CSS Module

```css
/* StepHeader.module.css */
.header {
  color: var(--color-primary);
  background: var(--color-background);
  padding: 16px 0;
  font-family: var(--font-family, Inter, Arial, sans-serif);
}
```

---

## 5. Accessibility & Responsive Guidelines
- Minimum color contrast: 4.5:1 for text/background
- Use `rem`/`em` for scalable spacing and font sizes
- All interactive elements must have focus states (outline, color)
- Layouts should be mobile-friendly (min-width: 375px)

---

## 6. Next Steps
- Implement `theme.tokens.ts` and CSS modules as above
- Apply theme classes in onboarding root wrapper
- Use tokens for all new onboarding components
- Review with design for consistency before launch
