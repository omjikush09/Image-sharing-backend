import express from "express";
const router = express.Router();

import { isSignIn } from "../controllers/auth.js";
import { isAuthenticated } from './../controllers/auth.js';
import { addComment } from './../controllers/comment.js';
import { getUserById } from './../controllers/user.js';

router.param("userId",getUserById)

router.post("/addcomment/:userId",isSignIn,isAuthenticated,addComment)



export default router;