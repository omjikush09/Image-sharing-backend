import express from "express"
const router = express.Router();
import { isAuthenticated, isSignIn } from "../controllers/auth.js";
import { getImage, getImageById, likeImage, uploadImage } from "../controllers/image.js";
import {getUserById } from "../controllers/user.js";
import { unLikeImage } from './../controllers/image.js';


router.param("userId",getUserById);
router.param("imageId",getImageById);

router.post("/image/imageupload/:userId",isSignIn,isAuthenticated,uploadImage)
router.get("/image/:imageId/:userId",isSignIn,isAuthenticated,getImage)

//like and unlike
router.post("/likepost/:userId",isSignIn,isAuthenticated,likeImage)
router.post("/unlikepost/:userId",isSignIn,isAuthenticated,unLikeImage)



export default router;