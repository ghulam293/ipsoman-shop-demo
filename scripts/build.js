import * as esbuild from "esbuild";
import { mkdir, cp, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const buildOptions = {
  absWorkingDir: root,
  entryPoints: ["src/main.jsx"],
  bundle: true,
  outdir: "dist/static",
  entryNames: "app",
  jsx: "automatic",
  sourcemap: false,
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
};

export async function prepare() {
  await mkdir(new URL("../dist", import.meta.url), { recursive: true });
  await cp(
    new URL("../assets", import.meta.url),
    new URL("../dist/assets", import.meta.url),
    { recursive: true },
  );
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  await writeFile(
    new URL("../dist/index.html", import.meta.url),
    html.replace(
      '<script type="module" src="/src/main.jsx"></script>',
      '<link rel="stylesheet" href="/static/app.css"/><script type="module" src="/static/app.js"></script>',
    ),
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await prepare();
  await esbuild.build(buildOptions);
  console.log("React app built successfully into dist/");
}
