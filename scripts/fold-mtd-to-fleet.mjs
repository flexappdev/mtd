#!/usr/bin/env node
// fold-mtd-to-fleet.mjs — documented dry-run wrapper around the cockpit's
// generic `~/APPS/appai/scripts/mongo-fold.mjs` for the mtd → FLEET fold.
//
// This script is INTENTIONALLY read-only. It prints the exact set of
// `mongo-fold.mjs` invocations that migrate the 9 legacy `mtd.mtd_*`
// collections into the shared FLEET DB with the `{app:'mtd', kind}`
// discriminator shape.
//
// It does NOT execute anything against Mongo — copy/paste the commands to
// the cockpit shell and run them there (or add --confirm to each one and
// let this script pipe them through, but that's deliberately manual).
//
// Post-fold soak: 7 days of clean FLEET-only reads, then the user drops
// the legacy `mtd` DB manually in Atlas UI. The cluster user only has
// `readWrite` so `dropDatabase` fails from CLI — see:
//   ~/.claude/projects/-home-matsiems-APPS-appai/memory/feedback_mongo_atlas_500_cap.md
//
// Usage:
//   node scripts/fold-mtd-to-fleet.mjs           # prints the plan
//   node scripts/fold-mtd-to-fleet.mjs --raw     # prints just the shell commands (no comments)

const RAW = process.argv.includes("--raw");

const COCKPIT_FOLD = "~/APPS/appai/scripts/mongo-fold.mjs";

/** Each row = one `mongo-fold.mjs` invocation.
 *
 *  Format: `node <cockpit-fold> <src-db>.<src-col> <dest-col> --app mtd --kind <k>` */
const PLAN = [
  {
    note: "Destinations — mixed per-doc kind (city|sight|region). Fold as-is; each doc's own `kind` field is preserved by mongo-fold.",
    src: "mtd.mtd_destinations",
    dest: "items",
    // No --kind flag: the source docs carry per-doc `kind` values
    // (city/sight/region) that we want to preserve untouched.
    kind: null,
  },
  {
    note: "Regions — {kind:'region'}. Consider adding place_slug backfill later (see fleet-place-dedup.mjs).",
    src: "mtd.mtd_regions",
    dest: "items",
    kind: "region",
  },
  {
    note: "Cities — {kind:'city'} + place_slug for taxonomy join.",
    src: "mtd.mtd_cities",
    dest: "items",
    kind: "city",
  },
  {
    note: "Sights — {kind:'sight'} + place_slug for taxonomy join.",
    src: "mtd.mtd_sights",
    dest: "items",
    kind: "sight",
  },
  {
    note: "Hotels — {kind:'hotel'}.",
    src: "mtd.mtd_hotels",
    dest: "items",
    kind: "hotel",
  },
  {
    note: "Restaurants — {kind:'restaurant'}.",
    src: "mtd.mtd_restaurants",
    dest: "items",
    kind: "restaurant",
  },
  {
    note: "Curated lists — FLEET.lists {app:'mtd'} (no per-collection kind; the collection is already kind-discriminating).",
    src: "mtd.mtd_lists",
    dest: "lists",
    kind: null,
  },
  {
    note: "Editorial pages — FLEET.pages {app:'mtd'}.",
    src: "mtd.mtd_pages",
    dest: "pages",
    kind: null,
  },
  {
    note: "Image/video prompts — FLEET.media_jobs {app:'mtd', kind:'prompt'}.",
    src: "mtd.mtd_prompts",
    dest: "media_jobs",
    kind: "prompt",
  },
];

function fmt(step) {
  const parts = [
    "node",
    COCKPIT_FOLD,
    step.src,
    step.dest,
    "--app",
    "mtd",
  ];
  if (step.kind) {
    parts.push("--kind", step.kind);
  }
  return parts.join(" ");
}

if (RAW) {
  // Just the commands (one per line) — pipe to bash if you're feeling brave.
  for (const step of PLAN) {
    console.log(`${fmt(step)}       # dry-run; append --confirm to write`);
  }
  process.exit(0);
}

console.log("=".repeat(72));
console.log("mtd → FLEET fold plan (9 collections)");
console.log("=".repeat(72));
console.log("");
console.log("This is a DRY DOCUMENTATION script. It does not touch Mongo.");
console.log("");
console.log("Run the commands below in order. Each defaults to --dry (safe).");
console.log("Append --confirm to actually write to FLEET.");
console.log("");
console.log(`Cockpit fold engine: ${COCKPIT_FOLD}`);
console.log("");
console.log("-".repeat(72));

for (let i = 0; i < PLAN.length; i++) {
  const step = PLAN[i];
  console.log(`\n[${i + 1}/${PLAN.length}] ${step.src} → FLEET.${step.dest}${step.kind ? ` {kind:'${step.kind}'}` : ""}`);
  console.log(`  ${step.note}`);
  console.log(`  $ ${fmt(step)}                    # dry-run`);
  console.log(`  $ ${fmt(step)} --confirm          # write`);
}

console.log("\n" + "-".repeat(72));
console.log("");
console.log("Idempotency: mongo-fold.mjs upserts on {_fold_source, _legacy_id}");
console.log("— safe to re-run. See ~/APPS/appai/scripts/mongo-fold.mjs.");
console.log("");
console.log("After all 9 folds complete + FLEET reads verified in prod:");
console.log("  1. Soak 7 days with FLEET as sole read path.");
console.log("  2. Run mongo-drift.mjs to confirm no writes to legacy `mtd` DB.");
console.log("  3. User drops the `mtd` DB manually in Atlas UI");
console.log("     (readWrite only — CLI dropDatabase fails).");
console.log("");
console.log("NOT folded (intentionally kept out of FLEET):");
console.log("  - mtd.s3_index — dev-tool sidecar, not app data.");
console.log("");
