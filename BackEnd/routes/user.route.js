import express from "express";
import { register, login, logout, getProfile, getSuggestedUsers, followOrUnfollow, editProfile } from "../controllers/user.controllers.js"
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";






const userrouter = express.Router()
userrouter.route('/register').post(register);
userrouter.route('/login').post(login);
userrouter.route('/logout').get(logout);
userrouter.route('/:id/profile').get(isAuthenticated, getProfile);
userrouter.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
userrouter.route('/suggested').get(isAuthenticated, getSuggestedUsers);
userrouter.route('/followOrUnfollow/:id').post(isAuthenticated, followOrUnfollow);


export default userrouter;