import express from "express"
import { adminLogin, adminLogout, allChats, allMessages, allUsers, getAdminData, getDashboardStats } from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";
import { rateLimiter } from "../middlewares/security.js";

const app = express.Router();

// Stricter throttle on the admin key check.
const adminLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

app.post("/verify" , adminLimiter, adminLoginValidator() , validateHandler, adminLogin)
app.get("/logout" , adminLogout)

app.use(adminOnly)

app.get("/" , getAdminData)
app.get("/users" , allUsers )
app.get("/chats" ,allChats )
app.get("/messages" , allMessages)
app.get("/stats" , getDashboardStats )
export default app
