import { backfillSurftripInventory } from "./surftrip-sync.shared.mjs";

function parseDocumentIds(argv) {
  return argv
    .filter((arg) => arg.startsWith("--id="))
    .flatMap((arg) => arg.slice("--id=".length).split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

async function run() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const documentIds = parseDocumentIds(argv);

  const results = await backfillSurftripInventory({
    dryRun,
    documentIds: documentIds.length ? documentIds : undefined,
  });

  console.log(
    `${dryRun ? "[dry-run] " : ""}Processed ${results.length} surftrip${results.length === 1 ? "" : "s"}.`,
  );

  results.forEach((result) => {
    console.log(JSON.stringify(result));
  });
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
