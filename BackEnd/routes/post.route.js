import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js";
import { getAllPost, getUserPost, likePost, disLikePost, addNewComment, getCommentOfPost, deletePost,bookmarkPost, addNewPost } from "../controllers/post.controllers.js"

const postrouter = express.Router();

postrouter.route("/addpost").post(isAuthenticated, upload.single('image'), addNewPost);
postrouter.route("/all").get(isAuthenticated, getAllPost);
postrouter.route("/userpost/all").get(isAuthenticated, getUserPost);
postrouter.route("/:id/like").get(isAuthenticated, likePost);
postrouter.route("/:id/dislike").get(isAuthenticated, disLikePost);
postrouter.route("/:id/comment").post(isAuthenticated, addNewComment);
postrouter.route("/:id/comment/all").post(isAuthenticated, getCommentOfPost);
postrouter.route("/delete/:id/").post(isAuthenticated, deletePost);
postrouter.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);


export default postrouter;

