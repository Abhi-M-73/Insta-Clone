import cloudinary from "../cloudinary.js";
import sharp from "sharp";
import User from "../models/user.model.js";
import Post from "../models/post.model.js"
import { populate } from "dotenv";

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

        const fileUri  = `data:image/jpeg;base64, ${optimizedImageBuffer.toString('base64')}`
        const cloudResponse = cloudinary.uploader.upload(fileUri);
        const post = await post.create({
            caption,
            image :  cloudResponse.secure_url,
            author: authorId
        })

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id)
            await user.save();
        }

        await user.populate({path: 'author', select: "-password"});
        return res.status(201).json({
            message: "New post added",
            post,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}



export const getAllPost = async(req, res)=>{
    try {
        const posts = await Post.find().sort({createAt: -1})
       .populate({
        path: 'author',
        select : 'username, profilePicture'
       }).populate({
        path: 'comments',
        sort:{createAt: -1},
        populate:{
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


export const getUserPost = async(req, res)=>{
    try {
       const authorId = req.id;
       const post = await Post.find({author:authorId}).sort({createAt: -1})
       .populate({
        path: 'author',
        select : 'username, profilePicture'
       }).populate({
        path: 'comments',
        sort:{createAt: -1},
        populate:{
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

export const likePost = async(req, res)=>{
    try {
        const likerId = req.id;
        const postId = req.params.id;
        const post =await Post.find(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }

        //like logic here
        await post.updateOne({addToSet: {likes: likerId}})
        await post.save()

        return res.status(200).json({
            message: "Post liked",
            success: true
        })

    } catch (error) {
        console.log(error);
        
    }
}



export const disLikePost = async(req, res)=>{
    try {
        const likerId = req.id;
        const postId = req.params.id;
        const post =await Post.find(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }

        //Dislike logic here
        await post.updateOne({$pull: {likes: likerId}})
        await post.save()

        return res.status(200).json({
            message: "Post disliked",
            success: true
        })

    } catch (error) {
        console.log(error);
        
    }
}