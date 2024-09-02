import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import messageRouter from "./routes/message.route.js";

dotenv.config({})


const app = express();

const PORT = process.env.PORT || 3000











// middwares start
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
app.use(express.json())
const corsOptions = {
    origin: "https://localhost:5173",
    Credentials: true
}
app.use(cors(corsOptions))


// middlewares end


// routes start

app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/message", messageRouter)

// routes end


app.listen(PORT, () => {
    connectDB()
    console.log(`server is running at the port of ${PORT}`)
})