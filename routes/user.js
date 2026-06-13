import express from "express"
import {acceptFriendRequest, getMyFriends, getMyNotifications, login, logout, newUser, searchUser, sendFriendRequest} from "../controllers/user.js"
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyProfile } from "../controllers/user.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from "../lib/validators.js";
import { rateLimiter } from "../middlewares/security.js";

const app = express.Router();

// Throttle credential endpoints to blunt brute-force attempts.
const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });

app.post("/login" , authLimiter, loginValidator() , validateHandler,  login)
app.post("/newuser" , authLimiter, singleAvatar, registerValidator() , validateHandler, newUser)

// now user need to be logged in to access routes

app.use(isAuthenticated)

app.get("/me" , getMyProfile)
app.get("/logout" , logout)
app.get("/search" , searchUser)

app.put("/sendrequest" , sendRequestValidator() , validateHandler , sendFriendRequest)

app.put( "/acceptrequest", acceptRequestValidator() , validateHandler, acceptFriendRequest );

app.get("/notifications", getMyNotifications);

app.get("/friends", getMyFriends);
export default app