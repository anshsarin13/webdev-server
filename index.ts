import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import type { SessionOptions } from "express-session";
import Lab5 from "./Lab5";
import db from "./Kambaz/Database";
import UserRoutes from "./Kambaz/Users/routes";
import CourseRoutes from "./Kambaz/Courses/routes";
import ModuleRoutes from "./Kambaz/Modules/routes";
import AssignmentRoutes from "./Kambaz/Assignments/routes";

const app = express();

// Which browser origins may call this server with cookies.
const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isAllowedOrigin = (origin: string) =>
  allowedOrigins.includes(origin) ||
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // No Origin header: curl, server-to-server, same-site navigation.
      if (!origin || isAllowedOrigin(origin)) callback(null, true);
      else callback(null, false);
    },
  }),
);

// Secure cross-site cookies only when deployed (Render sets RENDER=true).
// Locally (http://localhost) the plain cookie is used, with or without a .env file.
const isProduction =
  process.env.SERVER_ENV === "production" ||
  process.env.NODE_ENV === "production" ||
  Boolean(process.env.RENDER) ||
  Boolean(process.env.VERCEL);
const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET ?? "kambaz-dev-secret",
  resave: false,
  saveUninitialized: false,
};
if (isProduction) {
  // Behind Render's proxy, with the UI on another site (Vercel): the cookie
  // must be Secure and SameSite=None to be sent on cross-site requests.
  app.set("trust proxy", 1);
  sessionOptions.proxy = true;
  sessionOptions.cookie = { sameSite: "none", secure: true };
}
app.use(session(sessionOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kambaz Node server is running. Try /lab5/welcome or /api/courses");
});

Lab5(app);
UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);

// On Vercel the platform calls the exported app; everywhere else we listen.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
