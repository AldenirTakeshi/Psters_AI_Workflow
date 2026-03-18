import { logTelemetry, readStdin, safeParseJson, sanitizeCommand } from "./shared.mjs";

async function main() {
  const payload = safeParseJson(await readStdin());
  const command = sanitizeCommand(payload.command || "");

  const isGenerate = command.includes("typeorm:generate");
  if (isGenerate) {
    console.error(
      "[psters-ai-workflow hook] TypeORM atomic chain reminder: generate -> drift-check -> run locally immediately."
    );
  }
  logTelemetry("afterShellExecution.typeorm-generate", {
    isGenerate
  });

  process.stdout.write("{}");
}

main().catch(() => {
  process.stdout.write("{}");
});
