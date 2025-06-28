// ─────────────────────────────────────────────────────────────
// server.js  — BACKEND COMPLETO (Express + HTTPS + Socket.IO)
// ─────────────────────────────────────────────────────────────
import express   from "express";
import morgan    from "morgan";
import cors      from "cors";
import dotenv    from "dotenv";
import http      from "http";
import https     from "https";
import fs        from "fs";
import path      from "path";

import { sequelize } from "./models/index.model.js";

// Rutas
import authRouter     from "./routes/auth.routes.js";
import userRouter     from "./routes/users.routes.js";
import ownerRouter    from "./routes/owners.routes.js";
import shopRouter     from "./routes/shops.routes.js";
import categoryRouter from "./routes/categories.routes.js";
import productRouter  from "./routes/products.routes.js";
import orderRouter    from "./routes/orders.routes.js";
import addressRouter  from "./routes/address.routes.js";

// Socket
import { initializeSocket } from "./socket.js";

dotenv.config();

/* ───────────── Config Express ───────────── */
const app = express();

/* ---------- CORS ---------- */
const whitelist = [
  process.env.FRONTEND_URL,   // ej. http://localhost:5173
  "http://localhost:19006",   // Expo web preview
  "exp://",                   // deep-links de Expo Go
];

const corsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    if (!origin || whitelist.some((url) => origin.startsWith(url))) {
      return cb(null, true);
    }
    return cb(new Error("Not allowed by CORS"));
  },
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

/* ───────────── Rutas ───────────── */
app.use("/api/auth",       authRouter);
app.use("/api/users",      userRouter);
app.use("/api/owners",     ownerRouter);
app.use("/api/shops",      shopRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products",   productRouter);
app.use("/api/orders",     orderRouter);
app.use("/api/addresses",  addressRouter);

/* ───────────── Error Handler global ───────────── */
app.use((err, _req, res, _next) => {
  console.error("→ [GLOBAL ERROR HANDLER]", err);
  res.status(500).json({ error: "Internal server error." });
});

/* ───────────── Init DB & Server ───────────── */
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("📦 DB synced");
    startServer();
  })
  .catch((error) => {
    console.error("❌ DB sync error:", error);
  });

function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const PORT         = isProduction ? 443 : process.env.PORT || 3000;

  let server;

  if (isProduction) {
    // certificados está en la raíz del proyecto (fuera de src)
    const certBase = path.resolve(process.cwd(), "certificados");
    const privateKey  = fs.readFileSync(path.join(certBase, "private.key"),  "utf8");
    const certificate = fs.readFileSync(path.join(certBase, "certificate.crt"), "utf8");
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
  } else {
    server = http.createServer(app);
  }

  /* ---------- Socket.IO sobre el mismo server ---------- */
  initializeSocket(server);

  server.listen(PORT, () =>
    console.log(`🚀 ${isProduction ? "HTTPS" : "HTTP"} server listening on ${PORT}`),
  );
}
