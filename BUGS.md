# AQUORIX Pro Admin Dashboard — Bug Log

---

## 2025-07-07 — Hamburger Menu Not Rendering in TopNav

**Title:** Hamburger menu button not rendering in TopNav on mobile or desktop

**Description:**
The hamburger menu button, intended to provide mobile navigation access, does not appear in the top navigation bar (`TopNav`). Debug styles and markup confirm that the `.topnav` and `.nav-left` containers render, but the `<button class="hamburger">` is missing from the DOM, despite being present in the source code. This prevents mobile users from accessing the sidebar navigation.

**Steps to Reproduce:**
1. Start the AQUORIX Pro Admin Dashboard on any environment.
2. Open the dashboard in a desktop or mobile browser.
3. Inspect the `.topnav` element in the DOM.
4. Observe that the hamburger button is not present in the DOM, regardless of screen size or debug CSS.

**Expected Result:**
A hamburger menu button with a red border should appear to the left of the AQUORIX Pro title on mobile (and during debug, on all screens).

**Actual Result:**
No hamburger button is rendered; only the nav title is visible.

**Notes for Future Debugging:**
- Confirm that the correct `TopNav.tsx` file is being rendered.
- Check for build cache or file duplication issues.
- Validate that the DOM matches the latest source code.

---

## 2025-07-07 — Search Icon (SVG) and Debug Text Not Rendering in TopNav

**Title:** Search icon (SVG) and debug text not rendering in TopNav

**Description:**
Attempts to replace the "Search" text in the top navigation with an inline SVG magnifying glass icon (and debug text) do not appear in the running UI. The code changes are present in `src/components/TopNav.tsx`, but the rendered output still shows the old "Search" text or nothing at all. This suggests a possible build, caching, or file mismatch issue similar to the hamburger menu bug.

**Steps to Reproduce:**
1. Edit `src/components/TopNav.tsx` to add an inline SVG and debug text in the search nav item.
2. Restart the development server.
3. Open the dashboard in a browser (Chrome/Safari).
4. Observe that the SVG icon and debug text do not appear, but the profile icon (SVG) does render.

**Expected Result:**
The magnifying glass SVG and debug text should appear in the nav next to the profile icon.

**Actual Result:**
Neither the SVG nor the debug text is visible; the "Search" text may still appear or the area is blank.

**Notes for Future Debugging:**
- Confirm the correct `TopNav.tsx` file is being rendered.
- Check for build cache or duplicate file issues.
- Inspect the DOM for the SVG and debug text elements.
- Compare behavior with the profile icon SVG, which renders correctly.

---

_Add more bugs below as they are discovered. Use this log for actionable, version-controlled bug tracking during MVP development._
