import cloudinary from "../cloudinary.js";
import sharp from "sharp";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/post.model.js"
import { populate } from "dotenv";
import { json } from "express";

export const post = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!image) {
            return res.json({ message: "Image Required" })
        }

        //for image optimization we use sharp package
        const optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: "inside" }).toFormat('jpeg', { quality: 80 }).toBuffer();

        const fileUri = `data:image/jpeg;base64, ${optimizedImageBuffer.toString('base64')}`
        const cloudResponse = cloudinary.uploader.upload(fileUri);
        const post = await post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id)
            await user.save();
        }

        await user.populate({ path: 'author', select: "-password" });
        return res.status(201).json({
            message: "New post added",
            post,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}



export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ reateAt: -1 })
            .populate({
                path: 'author',
                select: 'username, profilePicture'
            }).populate({
                path: 'comments',
                sort: { createAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username, profilePicture'
                }

            })
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}


export const addNewComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentId = req.id;
        const { text } = req.body;
        const post = await Post.findById(postId);

        if (!text) {
            return res.status(404).json({
                message: "Text is required",
                success: false
            })
        }

        const comment = await Comment.create({
            text,
            author: commentId,
            post: postId
        }).populate({
            path: 'author',
            select: 'username, profilePicture'
        })

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: "Comments added",
            comment,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}


export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const post = await Post.find({ author: authorId }).sort({ createAt: -1 })
            .populate({
                path: 'author',
                select: 'username, profilePicture'
            }).populate({
                path: 'comments',
                sort: { createAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username, profilePicture'
                }

            })
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const likePost = async (req, res) => {
    try {
        const likerId = req.id;
        const postId = req.params.id;
        const post = await Post.find(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }

        //like logic here
        await post.updateOne({ addToSet: { likes: likerId } })
        await post.save()

        return res.status(200).json({
            message: "Post liked",
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}



export const disLikePost = async (req, res) => {
    try {
        const likerId = req.id;
        const postId = req.params.id;
        const post = await Post.find(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }

        //Dislike logic here
        await post.updateOne({ $pull: { likes: likerId } })
        await post.save()

        return res.status(200).json({
            message: "Post disliked",
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}



export const getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('author', 'username', 'profilePicture')
        if (!comments) {
            return res.status(404).json({
                message: "NO comment found in this post",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            comments
        })
    } catch (error) {
        console.log(error);

    }
}



export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }

        // check if the logged-in user is the owner of the post
        if (post.author.toString() !== authorId) {
            return res.status(404).json({
                message: "Unauthorized",
                success: false
            })
        }

        //delete post
        await Post.findByIdAndDelete(postId);

        //here we will delete post id from post
        const user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        //delete associated comment from post
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            message: "Post Deleted",
            success: true 
        })


    } catch (error) {
        console.log(error);

    }
}



export const bookmarkPost = async(req, res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await User.findById(postId);
        if (!post) {
            return res.status(404).json({
                message:"Page not found",
                success: false
            })
        }
        const user =await User.findById(postId);
        if (user.bookmarks.includes(post._id)) {

            //here we remove post from bookmark
            await user.updateOne({$pull:{bookmarks:post._id}})
            await user.save();
            return res.status(200).json({
                type: "unsaved",
                message: "Post remove from bookmark";
                success: true
            })
            
        } else {
            //here add post bookmark
            await user.updateOne({$addToSet:{bookmarks:post._id}})
            await user.save();
            return res.status(200).json({
                type: "saved",
                message: "Post bookmark added";
                success: true
            })

        }
    } catch (error) {
        console.log(error);
        
    }
}