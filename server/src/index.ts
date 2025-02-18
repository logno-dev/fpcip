import { Hono } from "hono";
import { cors } from "hono/cors";
import { authenticate, checkCookie, signOut } from "./auth.ts";
import {
  addEvent,
  deleteEvent,
  editEvent,
  exportData,
  getData,
  getLastCip,
} from "./actions.ts";

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
app.post("/events/add", addEvent);
app.post("/events/delete", deleteEvent);
app.post("/events/edit", editEvent);
app.get("/events", getData);
app.get("/events/last-cip", getLastCip);
app.get("/events/export", exportData);

export default {
  port: 3000,
  fetch: app.fetch,
};
