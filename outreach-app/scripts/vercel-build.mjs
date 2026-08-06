import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "npx.cmd" : "npx";

function run(args) {
  const result = spawnSync(command, ["--no-install", ...args], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(["prisma", "generate"]);

if (process.env.DATABASE_URL) {
  console.log("DATABASE_URL found: synchronizing the empty application schema.");
  run(["prisma", "db", "push"]);
} else {
  console.log("DATABASE_URL is not configured yet: skipping database schema sync.");
}

run(["next", "build"]);
