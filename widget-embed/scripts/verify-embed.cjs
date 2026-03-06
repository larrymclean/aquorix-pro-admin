#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const publicDir = path.join(repoRoot, "public");

// Forbid ANY file in public/ that looks like a compiled widget bundle.
const forbiddenPatterns = [
  /^aquorix-scheduler-widget\.iife\.js$/i,
  /^aquorix-scheduler-widget\.iife\.js\./i,   // e.g. .bak, .old, .anything
  /^.*\.iife\.js$/i                           // any iife bundle
];

const files = fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : [];
const bad = files.filter((f) => forbiddenPatterns.some((re) => re.test(f)));

if (bad.length) {
  console.error("GUARDRAIL VIOLATION: compiled widget bundles must NEVER be in public/");
  bad.forEach((f) => console.error(`- public/${f}`));
  console.error("Move these files to dist/ (build output) or archive them outside public/.");
  process.exit(1);
}

console.log("OK: embed guardrails passed (public/ contains no compiled bundles)");
process.exit(0);
