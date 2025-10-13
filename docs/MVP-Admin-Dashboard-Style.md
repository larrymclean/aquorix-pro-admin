# MVP Admin Dashboard Style

> **Single Source of Truth for AQUORIX MVP Admin Dashboard Form Styling**

---

## Overview
This document consolidates the core CSS rules that define the modern, simple, and accessible look and feel for all AQUORIX MVP Admin Dashboard forms. Use these styles as the canonical reference for all future form and onboarding UI work.

---

## CSS Style Guide

```css
/* AQUORIX Form Style Guide - Single Source of Truth */

/* Container */
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
}

/* Labels */
.form-container label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #222;
  font-weight: 500;
}

/* Inputs */
.form-container input,
.form-container select {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  border: 1px solid #dbe4ea;
  border-radius: 6px;
  font-size: 1rem;
  background: #f9fbfc;
  transition: border-color 0.2s;
}

.form-container input:focus,
.form-container select:focus {
  border-color: #2bb3f4;
  outline: none;
}

/* Buttons */
.form-container button {
  width: 100%;
  padding: 0.85rem 0;
  background: #2bb3f4;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.form-container button:hover,
.form-container button:focus {
  background: #1a8cc7;
}

/* Misc */
.form-container .secondary-action {
  display: block;
  margin-top: 1rem;
  text-align: center;
  color: #888;
  font-size: 0.95rem;
  text-decoration: none;
}
```

---

## Usage Notes
- Apply the `.form-container` class to all main form wrappers.
- Use semantic HTML for accessibility (labels, inputs, buttons).
- Adjust color tokens as needed to match the active AQUORIX theme (Dive Locker / Bamboo Safari).
- For further extensions, keep all spacing, alignment, and font rules consistent with these examples.

---

## Change Log
- 2025-07-14 (Cascade AI): Initial consolidation of MVP Admin Dashboard form CSS for single source of truth.
