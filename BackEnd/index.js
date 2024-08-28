import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connectDB from "./utils/db.js"
dotenv.config({})


const app = express();

const PORT = process.env.PORT || 3000

// routes start

app.get("/", (req, res) => {
    return res.status(200).json({
        message: " I am abhishek ",
        success: true
    })
})

// routes end



// middwares start
app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({ extended: true }))
const corsOptions = {
    origin: "https://localhost:5173",
    Credentials: true
}
app.use(cors(corsOptions))

// middlewares end

app.listen(PORT, () => {
    connectDB()
    console.log(`server is running at the port of ${PORT}`)
})