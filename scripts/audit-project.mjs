
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const root = path.join(cwd, "src");
const errors = [];
const warnings = [];
const modules = [];

function list(dir) {
  if (!existsSync(dir)) return;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      list(full);
    } else if (/\.(?:js|jsx|css)$/.test(entry.name)) {
      modules.push(full);
    }
  }
}

function rel(p) {
  return path.relative(cwd, p).replaceAll("\\", "/");
}

function findExact(candidate) {
  const names = [
    candidate,
    `${candidate}.jsx`,
    `${candidate}.js`,
    `${candidate}.css`,
    path.join(candidate, "index.jsx"),
    path.join(candidate, "index.js"),
  ];

  for (const full of names) {
    if (!existsSync(full) || !statSync(full).isFile()) continue;

    const bits = path.relative(cwd, full).split(path.sep);
    let check = cwd;

    for (const bit of bits) {
      if (!readdirSync(check).includes(bit)) {
        return { full, casing: false };
      }
      check = path.join(check, bit);
    }

    return { full, casing: true };
  }

  return null;
}

list(root);

if (!modules.length) {
  errors.push(
    "src/ is missing or contains no JS/JSX/CSS files. Run from project root."
  );
}

if (!existsSync(path.join(root, "data/config.js"))) {
  errors.push(
    "Missing src/data/config.js (the Batch 1 catalog is required)."
  );
}

const iconImports = new Set();

for (const file of modules.filter((p) => /\.(js|jsx)$/.test(p))) {
  const source = readFileSync(file, "utf8");

  const re =
    /\bimport\s+(?:([\s\S]*?)\s+from\s+)?["']([^"']+)["']/g;

  for (const match of source.matchAll(re)) {
    const spec = match[2];

    if (spec.startsWith(".")) {
      const candidate = path.resolve(path.dirname(file), spec);
      const found = findExact(candidate);

      if (!found) {
        errors.push(`${rel(file)} → missing import: ${spec}`);
      } else if (!found.casing) {
        errors.push(
          `${rel(file)} → import path has wrong capitalization: ${spec}`
        );
      }

      continue;
    }

    if (spec === "lucide-react" && match[1]) {
      const selected =
        match[1].match(/\{([^}]+)\}/)?.[1] || "";

      for (const name of selected
        .split(",")
        .map((v) => v.trim().split(/\s+as\s+/)[0])
        .filter(Boolean)) {
        iconImports.add(name);
      }
    }
  }

  if (
    /\bInstagram\s*[,}]/.test(source) &&
    /from\s*["']lucide-react["']/.test(source)
  ) {
    warnings.push(
      `${rel(file)} → Check Instagram import (previous compatibility issue).`
    );
  }
}

try {
  const lucide = await import("lucide-react");

  for (const name of iconImports) {
    if (!(name in lucide)) {
      errors.push(
        `lucide-react does not export ${name}. Replace with a supported icon.`
      );
    }
  }
} catch {
  warnings.push(
    "lucide-react could not be checked. Run npm install first."
  );
}

const requiredRoutes = [
  "/",
  "/menu",
  "/cart",
  "/orders",
  "/reserve",
  "/story",
  "/locations",
  "/faq",
  "/availability",
  "/membership",
  "/gallery",
  "/coffee-beans",
  "/gift-cards",
  "/events",
  "/contact",
  "/staff",
  "/staff/tables",
  "/staff/pos",
  "/staff/orders",
  "/staff/reservations",
  "/staff/inventory",
  "/staff/reports",
  "/staff/transactions",
  "/staff/menu-management",
  "/staff/customers",
  "/staff/activity",
  "/staff/settings",
];

const appPath = path.join(root, "App.jsx");

if (existsSync(appPath)) {
  const app = readFileSync(appPath, "utf8");

  for (const route of requiredRoutes) {
    const short = route.startsWith("/staff/")
      ? route.slice("/staff/".length)
      : route;

    const match =
      route === "/"
        ? /<Route\s+path=["']\/["']/.test(app)
        : new RegExp(
            `<Route\\s+path=["']${short.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}["']`
          ).test(app);

    if (!match && route !== "/staff") {
      warnings.push(
        `Expected route not found in App.jsx: ${route}`
      );
    }
  }
} else {
  errors.push("src/App.jsx is missing.");
}

if (
  !existsSync(path.join(cwd, "netlify.toml")) &&
  !existsSync(path.join(cwd, "public/_redirects"))
) {
  warnings.push(
    "No Netlify SPA fallback; direct refresh may return 404."
  );
}

if (
  !existsSync(path.join(root, "styles/final-polish.css"))
) {
  warnings.push(
    "Batch 12 responsive stylesheet not installed."
  );
}

console.log(
  `YOUR CAFÉ AUDIT — ${modules.length} source files scanned`
);

for (const item of errors) {
  console.error("ERROR:", item);
}

for (const item of warnings) {
  console.warn("NOTE:", item);
}

console.log(
  `Result: ${errors.length} error(s), ${warnings.length} note(s).`
);

process.exitCode = errors.length ? 1 : 0;
