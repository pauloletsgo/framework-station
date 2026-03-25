import { spawn } from "child_process";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = 4999;

const routes = [
  "/",
  "/matriz-swot-framework-template",
  "/matriz-de-ansoff-framework-template",
  "/matriz-bcg-framework-template",
  "/5-forcas-de-porter-framework-template",
  "/usp-unique-selling-proposition-framework-template",
  "/golden-circle-framework-template",
  "/business-model-canvas-framework-template",
  "/tier-creator-framework-template",
];

async function prerender() {
  console.log("🚀 Starting pre-render...\n");

  // Start vite preview server
  const server = spawn("npx", ["vite", "preview", "--port", String(PORT)], {
    cwd: ROOT,
    stdio: "pipe",
  });

  // Wait for server to be ready
  await new Promise((resolve) => {
    server.stdout.on("data", (data) => {
      if (data.toString().includes("Local")) resolve();
    });
    setTimeout(resolve, 4000);
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  for (const route of routes) {
    const page = await context.newPage();
    const url = `http://localhost:${PORT}${route}`;

    console.log(`  📄 Pre-rendering: ${route}`);

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

      // Wait for React to render
      await page.waitForSelector("#root > div", { timeout: 5000 }).catch(() => {});

      const html = await page.content();

      // Determine output path
      const routePath = route === "/" ? "" : route;
      const dir = path.join(DIST, routePath);
      const filePath = path.join(dir, "index.html");

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(filePath, html, "utf-8");
      console.log(`  ✅ Saved: ${path.relative(DIST, filePath)}`);
    } catch (err) {
      console.error(`  ❌ Error on ${route}:`, err.message);
    }

    await page.close();
  }

  await browser.close();
  server.kill();

  console.log("\n✨ Pre-rendering complete!");
}

prerender().catch((err) => {
  console.error("Pre-render failed:", err);
  process.exit(1);
});
