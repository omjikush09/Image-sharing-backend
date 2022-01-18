import express from "express"
import { isAuthenticated, isSignIn } from "../controllers/auth.js";
import { addFollowing, checkUserName, getPost, getUser, getUserById, getUserByusername } from "../controllers/user.js";
const router = express.Router();




router.param("userId",getUserById);
router.param("username",getUserByusername)



router.get("/user/:userId",isSignIn,isAuthenticated,getUser)
// router.get("/",getUserById,isSignIn,isAuthenticated,getUser)
router.get("/checkusername",checkUserName)
router.get("/user/username/:username",getUser)
router.get("/getpost/:userId",isSignIn,isAuthenticated,getPost)
router.put("/addfollowing/:userId",isSignIn,isAuthenticated,addFollowing)



export default router;

