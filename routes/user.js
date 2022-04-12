import express from "express"
import { isAuthenticated, isSignIn } from "../controllers/auth.js";
import { addFollowing, addProfileImage, addUsername, checkUserName, getPost, getUser, getUserById, getUserByusername, getUsernameList } from "../controllers/user.js";
const router = express.Router();




router.param("userId",getUserById);
router.param("username",getUserByusername)



router.get("/user/:userId",isSignIn,isAuthenticated,getUser)
// router.get("/",getUserById,isSignIn,isAuthenticated,getUser)
router.post("/checkusername",checkUserName)
router.get("/user/username/:username",getUser)
router.get("/getpost/:userId",isSignIn,isAuthenticated,getPost)
router.put("/addfollowing/:userId",isSignIn,isAuthenticated,addFollowing)
router.post("/getUsernameList/:userId",isSignIn,isAuthenticated,getUsernameList)
// router.post("/addprofileimage/:userId",isSignIn,isAuthenticated,addProfileImage)
router.post("/addusername/:userId",isSignIn,isAuthenticated,addUsername)
router.get("/getUsernameList",getUsernameList)


export default router;


