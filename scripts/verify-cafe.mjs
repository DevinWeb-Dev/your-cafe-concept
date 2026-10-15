import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

let errors = 0;
let passed = 0;

function check(
  label,
  condition,
  detail = ""
) {
  if (condition) {
    passed++;

    console.log(`  ✔ ${label}`);
  } else {
    errors++;

    console.error(
      `  ✖ ${label}${
        detail ? ` — ${detail}` : ""
      }`
    );
  }
}

function read(relative) {
  const full = path.join(
    root,
    relative
  );

  return fs.existsSync(full)
    ? fs.readFileSync(full, "utf8")
    : "";
}

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, {
      withFileTypes: true,
    })
    .flatMap((entry) => {
      const absolute = path.join(
        dir,
        entry.name
      );

      return entry.isDirectory()
        ? walk(absolute)
        : [absolute];
    });
}

console.log(
  "\nYOUR CAFÉ. / BATCH 6 INTEGRATION AUDIT\n"
);

// Required files from Batches 1–6

const required = [
  "src/App.jsx",
  "src/main.jsx",
  "src/context/CafeContext.jsx",
  "src/engine/cafeEngine.js",

  "src/components/PublicLayout.jsx",
  "src/components/StaffLayout.jsx",
  "src/components/ClientDemoGateway.jsx",
  "src/components/CoffeeSeatingPlan.jsx",

  "src/styles/coffee-journal.css",
  "src/styles/coffee-ordering.css",
  "src/styles/coffee-experience.css",
  "src/styles/coffee-staff-studio.css",
  "src/styles/coffee-final-edition.css",
  "src/styles/coffee-qa.css",
];

for (const file of required) {
  check(
    `File exists: ${file}`,
    Boolean(read(file))
  );
}

const app = read("src/App.jsx");

const main = read("src/main.jsx");

const vite = read("vite.config.js");

const gateway = read(
  "src/components/ClientDemoGateway.jsx"
);

// Validate routing configuration.

check(
  "HashRouter retained for GitHub Pages",
  /\bHashRouter\b/.test(main)
);

check(
  "GitHub Pages subpath configured",
  /\/your-cafe-concept\//.test(vite)
);

check(
  "Public layout route still configured",
  /<Route\s+element=\{<PublicLayout\s*\/>\}/.test(
    app
  )
);

check(
  "Staff dashboard route still configured",
  /path="\/staff"/.test(app)
);

check(
  "Floating Staff Demo links directly to dashboard",
  /to="\/staff"/.test(gateway)
);

check(
  "No department-picker overlay in final gateway",
  !/cj5-demo-panel|setOpen\(/.test(
    gateway
  )
);

// Validate customer and staff routes.

const publicRoutes = [
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
];

const staffRoutes = [
  "tables",
  "orders",
  "reservations",
  "pos",
  "inventory",
  "reports",
  "transactions",
  "menu-management",
  "customers",
  "activity",
  "settings",
];

for (const route of publicRoutes) {
  check(
    `Public route: ${route}`,
    app.includes(
      `path="${route}"`
    )
  );
}

for (const route of staffRoutes) {
  check(
    `Staff route: /staff/${route}`,
    app.includes(
      `path="${route}"`
    )
  );
}

// Scan relative local imports across source files.

const sourceFiles = walk(
  path.join(root, "src")
).filter((file) =>
  /\.(js|jsx|css)$/.test(file)
);

let importCount = 0;
let badImports = 0;

for (const file of sourceFiles) {
  const source = fs.readFileSync(
    file,
    "utf8"
  );

  const imports = [
    ...source.matchAll(
      /\bfrom\s*['"](\.{1,2}\/[^'"]+)['"]/g
    ),

    ...source.matchAll(
      /\bimport\s*['"](\.{1,2}\/[^'"]+)['"]/g
    ),

    ...source.matchAll(
      /\bimport\s*\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g
    ),
  ];

  for (const match of imports) {
    importCount++;

    const target = path.resolve(
      path.dirname(file),
      match[1].split("?")[0]
    );

    const candidates = [
      target,

      ...[
        ".js",
        ".jsx",
        ".css",
        ".json",
        ".svg",
      ].map((ext) => target + ext),
    ];

    const exists = candidates.some(
      (candidate) =>
        fs.existsSync(candidate) &&
        fs.statSync(
          candidate
        ).isFile()
    );

    if (!exists) {
      badImports++;

      check(
        `Import target: ${path.relative(
          root,
          file
        )}`,
        false,
        match[1]
      );
    }
  }
}

check(
  `Local import paths (${importCount} checked)`,
  badImports === 0
);

console.log(
  `\nRESULT: ${passed} passed, ${errors} failed.\n`
);

if (errors) {
  console.error(
    "Fix the failed checks before publishing."
  );

  process.exitCode = 1;
} else {
  console.log(
    "Structure and route audit passed. Continue with npm run build."
  );
}