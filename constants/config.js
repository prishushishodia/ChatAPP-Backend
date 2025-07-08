import dotenv from "dotenv";
dotenv.config();

const CONNECTED_TOKEN = "connected_token";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export {
  CONNECTED_TOKEN,
  corsOptions,
};
