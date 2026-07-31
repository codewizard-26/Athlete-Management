import express from "express"
// import morgan from "morgan";
import cors from "cors";
import authRoutes from '../src/modules/auth/auth.routes.js'
import authMiddleware from "./middleware/auth.middleware.js";
import athleteprofileRoutes from "./modules/athlete/athleteprofile.route.js"
import organizaitonRoutes from "./modules/organization/organization.routes.js"
import teamRoutes from "./modules/team/team.routes.js"
import recruitmentRoutes from './modules/recruiter/recruitment.routes.js'
import bookmarkRoutes from './modules/recruiter/bookmark.routes.js'
import tournamentRoutes from './modules/tournament/tournament.routes.js'
import matchRoutes from './modules/match/match.routes.js'
import performanceRoutes from './modules/performance/performance.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import uploadRoutes from './modules/upload/upload.routes.js'



const app =express();


app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
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
app.use("/api/bookmark",bookmarkRoutes)
app.use("/api/tournament",tournamentRoutes)
app.use("/api/match",matchRoutes)
app.use("/api/performance",performanceRoutes)
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/upload", uploadRoutes)

export default app;