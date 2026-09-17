/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type */
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

if (!process.env.NITRO_PRESET) {
  process.env.NITRO_PRESET = "vercel";
}

function wishesApiPlugin() {
  const dataFile = path.resolve(process.cwd(), "data", "wishes.json");
  const readWishes = () => {
    try {
      if (fs.existsSync(dataFile)) {
        return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
      }
    } catch {
      // ignore
    }
    return [];
  };
  const writeWishes = (wishes: unknown) => {
    try {
      fs.writeFileSync(dataFile, JSON.stringify(wishes, null, 2), "utf-8");
    } catch {
      // ignore
    }
  };

  return {
    name: "wishes-api-plugin",
    configureServer(server: { middlewares: { use: Function } }) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (!req.url?.startsWith("/api/wishes")) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          return res.end();
        }

        if (req.method === "GET") {
          const wishes = readWishes();
          res.statusCode = 200;
          return res.end(JSON.stringify(wishes));
        }

        if (req.method === "POST") {
          const processData = (raw: any) => {
            try {
              const str = typeof raw === "string" ? raw : String(raw || "");
              const data = typeof raw === "object" && raw !== null ? raw : JSON.parse(str);
              const wishes = readWishes();
              const newWish = {
                id: `wish-${Date.now()}`,
                name: (data && data.name) || "A Friend",
                message: (data && data.message) || "",
                iconId: (data && data.iconId) || "cake",
                date: "Just now",
              };
              const updated = [newWish, ...wishes];
              writeWishes(updated);
              res.statusCode = 201;
              return res.end(JSON.stringify(newWish));
            } catch (e: any) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: "Invalid JSON", details: e?.message }));
            }
          };

          if (req.body) {
            return processData(req.body);
          }

          const chunks: any[] = [];
          req.on("data", (chunk: any) => {
            chunks.push(chunk);
          });
          req.on("end", () => {
            const rawStr = Buffer.concat(chunks).toString("utf-8");
            processData(rawStr);
          });
          return;
        }

        if (req.method === "DELETE") {
          const id = url.searchParams.get("id");
          let wishes = readWishes();
          if (id) {
            wishes = wishes.filter((w: any) => w.id !== id);
          }
          writeWishes(wishes);
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        }

        next();
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [wishesApiPlugin()],
  },
});
