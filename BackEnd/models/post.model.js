import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    caption:{ type: String, dafault: ""},
    image:{ type: String , reqired: true},
    author:[{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    like:[{type: mongoose.Schema.Types.ObjectId, ref: "User",  }],
    comments:[{type: mongoose.Schema.Types.ObjectId, ref: "Comment",}]
})

export default Post  = mongoose.Model('Post', postSchema);