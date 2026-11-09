import * as esbuild from "esbuild";
import { prepare, buildOptions } from "./build.js";
import { app } from "../server/app.js";

await prepare();
const context = await esbuild.context({
  ...buildOptions,
  minify: false,
  sourcemap: true,
  define: { "process.env.NODE_ENV": '"development"' },
});
await context.rebuild();
await context.watch();
const port = Number(process.env.PORT) || 3001;
const server = app.listen(port, () =>
  console.log(
    `IPS Oman React dashboard: http://localhost:${port}\nReact source rebuilds automatically. Refresh the browser after edits.`,
  ),
);
async function shutdown() {
  server.close();
  await context.dispose();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
