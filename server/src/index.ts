import { Hono } from "hono";
import { cors } from "hono/cors";
import { authenticate, checkCookie, signOut } from "./auth.ts";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
    allowMethods: ["POST", "GET"],
    allowHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
    credentials: true,
  }),
);

app.post("/auth/", authenticate);
app.get("/auth/cookie", checkCookie);
app.get("/auth/signout", signOut);

export default {
  port: 3000,
  fetch: app.fetch,
};
