import express from "express"
// import morgan from "morgan";
import cors from "cors";
import authRoutes from '../src/modules/auth/auth.routes.js'
import authMiddleware from "./middleware/auth.middleware.js";
import athleteprofileRoutes from "./modules/athlete/athleteprofile.route.js"
import organizaitonRoutes from "./modules/organization/organization.routes.js"
import teamRoutes from "./modules/team/team.routes.js"
import recruitmentRoutes from './modules/recruiter/recruitment.routes.js'

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

app.use("/api/athleteprofile",athleteprofileRoutes)
// app.use("/api/athleteprofile",)
app.use("/api/organization",organizaitonRoutes)
app.use("/api/team",teamRoutes)
app.use("/api/recruitment",recruitmentRoutes)

export default app;