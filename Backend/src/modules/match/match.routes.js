import express from 'express'

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

export default router