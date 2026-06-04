import express from "express"
// import morgan from "morgan";
import cors from "cors";
import authRoutes from '../src/modules/auth/auth.routes.js'
import authMiddleware from "./modules/auth/auth.middleware.js";

const app =express();


app.use(cors());
app.use(express.json());
// app.use(morgan("dev"));

app.get("/",(req,res)=>{
    res.send("app working")
});
app.use("/api/auth",authRoutes)

app.get("/api/auth/protected", authMiddleware, (req,res)=>{
    res.json({
        message:"Protected Route",
        user:req.user
    });
});
export default app;