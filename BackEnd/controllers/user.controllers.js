import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../Cloudinary.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || email || password) {
            return res.status(401).json({
                message: "Somthing is missing, Please check",
                success: false
            })
        }
        if (User) {
            const user = await User.findOne({ email });
            return res.status(401).json({
                message: "The email id is already exits",
                success: false
            })
        }

        // hashing the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hashedPassword
        })

    } catch (error) {
        console.log(error)
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || password) {
            return res.status(401).json({
                message: "Somthing is missing, Please check",
                success: false
            })
        }
        let User = user.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: usre.profilePicture,
            followers: user.followers,
            following: usre.following,
            post: user.post
        }

        //for generating token
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
    }
}


export const logOut = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params._id;
        let user = await User.findById(userId);
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const editProfile = async (req, res) => {
    try {
        const userId = rq.id         // taking id from isAuthenticated
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        if (bio) {
            user.bio = bio;
        }
        if (gender) {
            user.gender = gender;
        }
        if (profilePicture) {
            user.profilePicture = cloudResponse.secure_uri;
        }

        await user.save();
        return res.status(404).json({
            message: "Profile updated successfully",
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}

export const getSuggestedUser = async (req, res) => {
    try {
        const SuggestedUser = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!SuggestedUser) {
            return res.status(400).json({
                message: "Currently do not have any user",

            })

        }
        return res.status(200).json({
            success: true,
            users: SuggestedUser
        })
    } catch (error) {
        console.log(error);

    }
}


