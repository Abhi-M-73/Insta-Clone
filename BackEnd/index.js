import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express()

// routes start

app.get("/", (req, res)=>{
    return res.status(200).json({
        message : " I am abhishek ",
        success : true
    })
})

// routes end



// middwares start
app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({extended:true}))
const corsOptions = {
    origin : "https://localhost:5173",
    Credentials : true
}
app.use(cors(corsOptions))

// middlewares end

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is running at the port of ${PORT}`)
})