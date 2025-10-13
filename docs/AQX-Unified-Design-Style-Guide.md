# AQUORIX Unified Design Style Guide

**Version:** 1.1  
**Date:** July 14, 2025  
**Prepared By:** AQUORIX Design & Frontend Engineering

---

## 🎡 Design Philosophy
The AQUORIX.PRO platform is purpose-built for dive professionals. It should feel clean, modern, confident, and oceanic without being cold or overly techy. Visual clarity and calming tones echo the crystal blues and silvery grays of tropical waters, while form and function support fast, frictionless operational use.

**Key principles:**
- Light over dark: Prioritize white, pearl, and slate over deep blues to avoid visual heaviness
- Clean geometry: Use flat, precise UI with subtle depth (shadows, spacing)
- Oceanic inspiration: Reflect themes of precision, clarity, and marine professionalism

---

## 🧰 Core Layout Principles
- **Grid System:** 12-column responsive layout (CSS Grid or Tailwind)
- **Container Widths:**
  - Mobile: 100%, max-width 640px
  - Desktop: Max 1280px, centered
- **Spacing:**
  - Section spacing: 24px minimum
  - Gutter width: 32px desktop
- **Cards/Panels:**
  - Border-radius: 8px
  - Background: White (#FFF)
  - Shadow: 0 1px 4px rgba(0,0,0,0.05) or subtle border
  - Internal padding: 24px min

---

## 🎨 Color Palette
| Color Name        | Hex      | Usage                                 |
|------------------|----------|---------------------------------------|
| Pearl White      | #F5F6F5  | Primary background                    |
| Light Cobalt Blue| #248dc1  | Hover states, links, soft accents     |
| Cobalt Blue      | #0A6C9B  | Buttons, CTAs, strong interaction cues|
| Slate Gray       | #4A5C6A  | Base text, dividers                   |
| Neon Cyan        | #00D4FF  | Focus rings, highlight moments        |
| Deep Aqua        | #1B4D6F  | Headers, subtle backdrops (sparingly) |
| Soft Black       | #1E1E1E  | Base nav, logo text, dark text contrast|

> Avoid gradients, dark navy blues, or any hues darker than #1B4D6F.

---

## 🌐 Typography
- **Font Family:** Inter, sans-serif (fallback: system-ui, Helvetica, Arial)
- **Weights:** 400 (Regular), 600 (Semi-Bold), 700 (Bold)

| Element               | Size  | Weight |
|-----------------------|-------|--------|
| Page Headline (H1)    | 36px  | 700    |
| Section Headline (H2) | 24px  | 600    |
| Body Text             | 16px  | 400    |
| Caption/Small         | 14px  | 400    |
| CTA/Nav               | 15–18px| 600   |

---

## 🗺️ Navigation
- Sticky top nav bar: White, with subtle shadow
- Left: Logo | Right: Tiered nav links
- Hover: Underline or light cobalt fill
- Mobile: Hamburger toggle + slide drawer

---

## 🧠 Component Styles
- **Buttons**
  - Primary: Cobalt Blue #0A6C9B, white text
  - Hover: Light Cobalt Blue #248dc1
  - Radius: 6px
  - Padding: 0.75rem 1.25rem
  - Font Weight: 600
- **Cards**
  - White background
  - Rounded: 8px
  - Padding: 24px
  - Shadow: 0 1px 4px rgba(0,0,0,0.05)
- **Forms**
  - Input background: #f9fbfc
  - Border: 1px solid #CCC
  - Radius: 6px
  - Font size: 14–16px
  - Focus outline: 1px Neon Cyan (#00D4FF)
- **Alerts**
  - Info: Light Cobalt background, white text
  - Error: Slate Gray background or border, white text
  - Icons: Use Lucide or Heroicons (line only)

---

## 📄 CSS Snippet (Core Template)
```css
body {
  font-family: 'Inter', sans-serif;
  background-color: #F5F6F5;
  color: #1E1E1E;
  line-height: 1.6;
}
nav {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 1rem 2rem;
}
a {
  color: #0A6C9B;
  text-decoration: none;
}
a:hover {
  color: #248dc1;
  text-decoration: underline;
}
button.primary {
  background-color: #0A6C9B;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 600;
}
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
}
```

---

## 🔐 Login/Signup Forms (Wireframe Reference)
- Centered card (max-width 400px) with white background
- Title centered
- Fields: Email + Password (rounded inputs)
- Action: Primary login or signup button
- Hover state: Light cobalt
- Footer: TOS agreement text

---

## 📅 Usage Targets
- AQUORIX.PRO login/signup flows
- Tier dashboard components
- Internal system alerts and admin panels

> All implementations must pass UX accessibility review before beta or production release.

---

**Maintained by:** AQUORIX Design System Team  
**Status:** Locked v1.1 for MVP rollout
