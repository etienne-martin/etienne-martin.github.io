import { createReadStream, watch } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDirectory = path.join(rootDirectory, "dist");
const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "127.0.0.1";
const watchers = [];

const contentTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".m4a", "audio/mp4"],
  [".md", "text/markdown; charset=utf-8"],
  [".mp3", "audio/mpeg"],
  [".ogg", "audio/ogg"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".wav", "audio/wav"],
  [".webp", "image/webp"],
]);

let rebuildTimer;
let buildInProgress = false;
let rebuildQueued = false;

async function rebuild() {
  if (buildInProgress) {
    rebuildQueued = true;
    return;
  }

  buildInProgress = true;

  try {
    await build({ silent: true });
    console.log(`[${new Date().toLocaleTimeString()}] Rebuilt content/`);
  } catch (error) {
    console.error(error);
  } finally {
    buildInProgress = false;

    if (rebuildQueued) {
      rebuildQueued = false;
      await rebuild();
    }
  }
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(rebuild, 75);
}

async function serveFile(request, response) {
  const requestUrl = new URL(request.url || "/", "http://localhost");
  let pathname;

  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request\n");
    return;
  }

  const relativePath =
    pathname === "/" ? "index.html" : pathname.slice(1);
  let filePath = path.resolve(outputDirectory, relativePath);

  if (
    filePath !== outputDirectory &&
    !filePath.startsWith(`${outputDirectory}${path.sep}`)
  ) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    let fileStats = await stat(filePath);

    if (fileStats.isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(308, {
          Location: `${pathname}/${requestUrl.search}`,
        });
        response.end();
        return;
      }

      filePath = path.join(filePath, "index.html");
      fileStats = await stat(filePath);
    }

    if (!fileStats.isFile()) {
      throw new Error("Not a file");
    }

    const extension = path.extname(filePath);
    const contentType =
      contentTypes.get(extension) || "application/octet-stream";

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentType,
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found\n");
  }
}

await build({ silent: true });

for (const target of [
  path.join(rootDirectory, "content"),
  path.join(rootDirectory, "public"),
  path.join(rootDirectory, "site.config.json"),
  path.join(rootDirectory, "src"),
]) {
  watchers.push(watch(target, { recursive: true }, scheduleRebuild));
}

const server = createServer((request, response) => {
  serveFile(request, response).catch((error) => {
    console.error(error);
    response.writeHead(500).end("Internal server error");
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error(error);
  }

  watchers.forEach((fileWatcher) => fileWatcher.close());
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`Local preview: http://${host}:${port}`);
});

function shutdown() {
  clearTimeout(rebuildTimer);
  watchers.forEach((fileWatcher) => fileWatcher.close());
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
