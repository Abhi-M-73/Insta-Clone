import express from "express";
import { register, login, logout, getProfile, getSuggestedUsers, followOrUnfollow, editProfile } from "../controllers/user.controllers.js"
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";



const router = express.Router()
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(login);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followOrUnfollow/:id').post(isAuthenticated, followOrUnfollow);


export default router;