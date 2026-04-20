import { spawn } from "node:child_process";
import net from "node:net";

const isWindows = process.platform === "win32";
const nodeCommand = process.execPath;
const appPort = Number(process.env.PORT || 5174);
const mockPort = Number(process.env.MOCK_PORT || 4178);
const children = [];
const windowsShell = process.env.comspec || "cmd.exe";

function getPackageManagerCommand() {
  const execPath = String(process.env.npm_execpath || "").toLowerCase();

  if (execPath.includes("pnpm")) {
    return isWindows ? "pnpm.cmd" : "pnpm";
  }

  if (execPath.includes("yarn")) {
    return isWindows ? "yarn.cmd" : "yarn";
  }

  return isWindows ? "npm.cmd" : "npm";
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: "127.0.0.1" });

    socket.on("connect", () => {
      socket.end();
      resolve(true);
    });

    socket.on("error", () => {
      resolve(false);
    });
  });
}

function quoteWindowsArg(value) {
  if (!value) {
    return '""';
  }

  if (!/[\s"&()^<>|]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
}

function run(command, args, name) {
  const useWindowsShell = isWindows && /\.(cmd|bat)$/i.test(command);
  const child = useWindowsShell
    ? spawn(windowsShell, ["/d", "/s", "/c", [command, ...args].map(quoteWindowsArg).join(" ")], {
        cwd: process.cwd(),
        stdio: "inherit",
        shell: false,
        env: process.env,
        windowsVerbatimArguments: true
      })
    : spawn(command, args, {
        cwd: process.cwd(),
        stdio: "inherit",
        shell: false,
        env: process.env
      });

  child.on("exit", (code) => {
    if (typeof code === "number" && code !== 0) {
      process.exitCode = code;
    }
    shutdown();
  });

  children.push(child);
  console.log(`[${name}] started`);
}

function shutdown() {
  while (children.length > 0) {
    const child = children.pop();
    if (!child || child.killed) {
      continue;
    }
    child.kill("SIGTERM");
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);

async function main() {
  const packageManager = getPackageManagerCommand();
  const mockRunning = await isPortInUse(mockPort);
  const appRunning = await isPortInUse(appPort);

  if (mockRunning) {
    console.log(`[mock] reuse existing server on http://127.0.0.1:${mockPort}`);
  } else {
    run(nodeCommand, ["server/index.mjs"], "mock");
  }

  if (appRunning) {
    console.log(`[app] port ${appPort} already in use`);
    return;
  }

  run(packageManager, ["run", "dev:app"], "app");
}

void main();
