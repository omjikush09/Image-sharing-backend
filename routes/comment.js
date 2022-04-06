import express from "express";
const router = express.Router();

import { isSignIn } from "../controllers/auth.js";
import { isAuthenticated } from './../controllers/auth.js';
import { addComment, getComment } from './../controllers/comment.js';
import { getUserById } from './../controllers/user.js';

router.param("userId",getUserById)

router.post("/addcomment/:userId",isSignIn,isAuthenticated,addComment)
router.post("/getcomments/:userId",isSignIn,isAuthenticated,getComment)


export default router;