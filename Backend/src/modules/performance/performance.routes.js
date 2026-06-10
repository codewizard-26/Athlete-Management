import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import roleMiddleware from "../../middleware/role.middleware.js";

import Performance from "./performance.model.js";
import Athlete from "../athlete/athlete.model.js";
// import Match from "../match/match.model.js";

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const {
                athleteId,
                matchId,
                teamId,
                tournamentId,
                sport,
                stats
            } = req.body;

            if(
                !athleteId ||
                !matchId ||
                !teamId ||
                !tournamentId ||
                !sport
            ){
                return res.status(400).json({
                    message:"All fields required"
                });
            }

            const existing =
                await Performance.findOne({
                    athleteId,
                    matchId
                });

            if(existing){
                return res.status(400).json({
                    message:
                    "Performance already exists"
                });
            }
const athlete = await Athlete.findById(athleteId);

if(!athlete){
    return res.status(404).json({
        message:"Athlete not found"
    });
}
const match = await Match.findById(matchId);

if(!match){
    return res.status(404).json({
        message:"Match not found"
    });
}
            const performance =
                await Performance.create({
                    athleteId,
                    matchId,
                    teamId,
                    tournamentId,
                    sport,
                    stats
                });

            return res.status(201).json({
                message:"Performance added",
                performance
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.put(
    "/:performanceId",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const { performanceId } =
                req.params;

            const performance =
                await Performance.findByIdAndUpdate(
                    performanceId,
                    req.body,
                    {
                        new:true
                    }
                );

            if(!performance){
                return res.status(404).json({
                    message:
                    "Performance not found"
                });
            }

            return res.status(200).json({
                message:
                "Performance updated",
                performance
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.get(
    "/athlete/:athleteId",
    authMiddleware,
    async(req,res)=>{
        try {

            const { athleteId } =
                req.params;

            const performances =
                await Performance.find({
                    athleteId
                })
                .populate("matchId")
                .populate("teamId");

            return res.status(200).json(
                performances
            );

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);
router.delete(
    "/:performanceId",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const { performanceId } =
                req.params;

            const performance =
                await Performance.findByIdAndDelete(
                    performanceId
                );

            if(!performance){
                return res.status(404).json({
                    message:
                    "Performance not found"
                });
            }

            return res.status(200).json({
                message:
                "Performance deleted"
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.get(
    "/team/:teamId",
    authMiddleware,
    async(req,res)=>{
        try {

            const { teamId } =
                req.params;

            const performances =
                await Performance.find({
                    teamId
                })
                .populate("athleteId");

            return res.status(200).json(
                performances
            );

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.get(
    "/tournament/:tournamentId",
    authMiddleware,
    async(req,res)=>{
        try {

            const { tournamentId } =
                req.params;

            const performances =
                await Performance.find({
                    tournamentId
                })
                .populate("athleteId")
                .populate("teamId");

            return res.status(200).json(
                performances
            );

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.get(
    "/my-performance-summary",
    authMiddleware,
    roleMiddleware("athlete"),
    async(req,res)=>{
        try {

            const athlete = await Athlete.findOne({
                userId:req.user.id
            });

            if(!athlete){
                return res.status(404).json({
                    message:"Athlete not found"
                });
            }
            Performance.aggregate([
{
    $match:{
        athleteId:athlete._id
    }
},
{
    $group:{
        _id:null,
        totalMatches:{
            $sum:1
        }
    }
}
])
            const performances =
                await Performance.find({
                    athleteId:athlete._id
                });

            const summary = {};

performances.forEach((p) => {
    Object.entries(p.stats).forEach(([key, value]) => {
        if (typeof value === "number") {
            summary[key] = (summary[key] || 0) + value;
        }
    });
});

return res.status(200).json({
    totalMatches: performances.length,
    stats: summary
});

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.get(
    "/my-performance",
    authMiddleware,
    roleMiddleware("athlete"),
    async(req,res)=>{
        try{

            const athlete = await Athlete.findOne({
                userId:req.user.id
            });

            if(!athlete){
                return res.status(404).json({
                    message:"Athlete not found"
                });
            }

            const performances =
                await Performance.find({
                    athleteId:athlete._id
                })
                .populate("matchId")
                .populate("teamId");

            return res.status(200).json(
                performances
            );

        }catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

export default router;