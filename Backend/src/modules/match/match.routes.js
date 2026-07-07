import express from 'express'
import roleMiddleware from '../../middleware/role.middleware.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import Match from "./match.model.js";
import Tournament from "../tournament/tournament.model.js";
import Team from "../team/team.model.js";
import TeamMembership from "../team/teamMembership.model.js";
import Performance from "../performance/performance.model.js";
const router = express.Router()

router.post(
    "/create",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const {
                tournamentId,
                homeTeamId,
                awayTeamId,
                matchDate,
                venue
            } = req.body;

            if(
                !tournamentId ||
                !homeTeamId ||
                !awayTeamId ||
                !matchDate ||
                !venue
            ){
                return res.status(400).json({
                    message:"All fields required"
                });
            }

            await Match.create({
                tournamentId,
                homeTeamId,
                awayTeamId,
                matchDate,
                venue
            });

            return res.status(201).json({
                message:"Match created"
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.get(
    "/all",
    authMiddleware,
    async(req,res)=>{
        try {

            const matches =
                await Match.find()
                .populate("homeTeamId")
                .populate("awayTeamId")
                .populate("tournamentId");

            return res.status(200).json(
                matches
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

            const matches =
                await Match.find({
                    tournamentId
                })
                .populate("homeTeamId")
                .populate("awayTeamId");

            return res.status(200).json(
                matches
            );

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.put(
    "/score/:matchId",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const { matchId } =
                req.params;

            const {
                homeScore,
                awayScore
            } = req.body;

            const match =
                await Match.findByIdAndUpdate(
                    matchId,
                    {
                        homeScore,
                        awayScore
                    },
                    {
                        new:true
                    }
                );

            if(!match){
                return res.status(404).json({
                    message:"Match not found"
                });
            }

            return res.status(200).json({
                message:"Score updated",
                match
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.put(
    "/complete/:matchId",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const { matchId } =
                req.params;

            const match =
                await Match.findByIdAndUpdate(
                    matchId,
                    {
                        status:"completed"
                    },
                    {
                        new:true
                    }
                );

            if(!match){
                return res.status(404).json({
                    message:"Match not found"
                });
            }

            return res.status(200).json({
                message:"Match completed",
                match
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.get(
    "/:matchId",
    authMiddleware,
    async (req, res) => {
        try {
            const { matchId } = req.params;
            const match = await Match.findById(matchId)
                .populate("homeTeamId")
                .populate("awayTeamId")
                .populate("tournamentId");
            if (!match) {
                return res.status(404).json({ message: "Match not found" });
            }
            return res.status(200).json(match);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
);

router.get(
    "/:matchId/rosters",
    authMiddleware,
    async (req, res) => {
        try {
            const { matchId } = req.params;
            const match = await Match.findById(matchId)
                .populate("homeTeamId")
                .populate("awayTeamId")
                .populate("tournamentId");
            
            if (!match) {
                return res.status(404).json({ message: "Match not found" });
            }

            const homeMembers = await TeamMembership.find({ teamId: match.homeTeamId._id, status: 'active' }).populate('athleteId');
            const awayMembers = await TeamMembership.find({ teamId: match.awayTeamId._id, status: 'active' }).populate('athleteId');

            return res.status(200).json({
                match,
                homeRoster: homeMembers,
                awayRoster: awayMembers
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
);

router.post(
    "/:matchId/report",
    authMiddleware,
    roleMiddleware("organization"),
    async (req, res) => {
        try {
            const { matchId } = req.params;
            const { homeScore, awayScore, winner, matchStats, playerStats } = req.body;

            const match = await Match.findById(matchId).populate("tournamentId");
            if (!match) return res.status(404).json({ message: "Match not found" });
            
            if (match.hasReport) {
                return res.status(400).json({ message: "A match report has already been submitted for this match." });
            }

            // Update Match
            match.homeScore = homeScore || 0;
            match.awayScore = awayScore || 0;
            match.winner = winner || null;
            match.status = "completed";
            match.matchStats = matchStats || {};
            match.hasReport = true;
            await match.save();

            const sport = match.tournamentId.sport;
            
            // Create/Update Performance records for each player
            if (playerStats && Array.isArray(playerStats)) {
                for (const ps of playerStats) {
                    const { athleteId, teamId, stats } = ps;
                    
                    await Performance.findOneAndUpdate(
                        { athleteId, matchId: match._id },
                        {
                            athleteId,
                            matchId: match._id,
                            teamId,
                            sport,
                            stats: stats || {},
                            tournamentId: match.tournamentId._id
                        },
                        { upsert: true, new: true }
                    );
                }
            }

            return res.status(200).json({ message: "Match report submitted successfully", match });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
);

export default router