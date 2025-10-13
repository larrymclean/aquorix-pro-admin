# AQUORIX Pro Admin Onboarding – Wireframe Mockups (Markdown)

**Purpose:** Visualize the onboarding flow, major UI components, and layout conventions for rapid team alignment and developer handoff. Each step is annotated for clarity and accessibility.

---

## Wireframe Conventions
- `[ ]` = Input field (label inside brackets)
- `( )` = Radio button
- `[Dropdown]` = Select menu
- `[Button]` = Action button
- `---` = Section divider
- `*` = Annotation or callout

---

## Step 1: Identity
```
+-----------------------------------------------------+
| Step 1 of 4: Who Are You?      (?) [Tooltip Icon]   |
+-----------------------------------------------------+
| [ Full Name ]                                      |
| [ Email (readonly) ]                               |
| [ Phone (optional) ]                               |
|                                                    |
|                [ Next → ]                          |
+-----------------------------------------------------+
|  ErrorBanner (if validation fails)                 |
```
*Tooltip: "Enter your full legal name. Email is pre-filled from your account."
*Back button hidden on first step.

---

## Step 2: Role & Tier
```
+-----------------------------------------------------+
| Step 2 of 4: Pick Your Role     (?) [Tooltip Icon]  |
+-----------------------------------------------------+
| [Dropdown: Role]                                   |
| [Dropdown: Tier]                                   |
|                                                    |
| Theme Selector:                                    |
|  [Thumbnail] Dive Locker  [Select]                 |
|  [Thumbnail] Bamboo Safari [Select]                |
|  ...                                               |
|                                                    |
| [ ← Back ]   [ Next → ]                            |
+-----------------------------------------------------+
|  ErrorBanner (if validation fails)                 |
```
*Tooltip: "Choose your professional role and tier. Theme selection is optional."
*Theme selector: static thumbnails + description. User’s manual choice respected unless role/tier changes.

---

## Step 3: Profile Info
```
+-----------------------------------------------------+
| Step 3 of 4: Organization Details  (?) [Tooltip]    |
+-----------------------------------------------------+
| [ Organization Name ]                              |
| [ Website (optional) ]                             |
| [ Location (Country, City) ]                       |
| [ Primary Dive Region (optional) ]                 |
|                                                    |
| [ ← Back ]   [ Next → ]                            |
+-----------------------------------------------------+
|  ErrorBanner (if validation fails)                 |
```
*Fields adjust based on role/tier.

---

## Step 4: Confirmation
```
+-----------------------------------------------------+
| Step 4 of 4: Review & Confirm   (?) [Tooltip Icon]  |
+-----------------------------------------------------+
| [ Summary of entered info ]                        |
|                                                    |
| [ ] I agree to the Terms & Conditions [View]       |
|                                                    |
| [ ← Back ]   [ Complete Setup → ]                  |
+-----------------------------------------------------+
|  ErrorBanner (if validation fails)                 |
```
*Terms & Conditions: Clicking [View] opens a modal with scrollable T&C text.
*Show loader after submit, then redirect.

---

## Welcome Interstitial (Post-Onboarding)
```
+-----------------------------------------------------+
| Welcome, [Name]!                                   |
+-----------------------------------------------------+
| You’re ready to dive in.                           |
|                                                    |
| [ Go to Dashboard ]                                |
+-----------------------------------------------------+
```
*Optionally, add "Take a tour" in V2.

---

## Component Legend
- **StepHeader.tsx**: Step number, label, tooltip
- **ThemeSelector.tsx**: Thumbnails, select button, static preview
- **ErrorBanner.tsx**: Inline error and guidance
- **T&C Modal**: Scrollable legal copy, accessible close button
- **Navigation**: Back/Next/Complete Setup, keyboard accessible

---

**Next:**
- Review and circulate for feedback.
- Begin outlining base styles and theme tokens.
