import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'

const router = express.Router()
router.post(
    "/create",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const {
                name,
                sport,
                ageCategory,
                location,
                startDate,
                endDate,
                registrationDeadline,
                maxTeams
            } = req.body;

            if(
                !name ||
                !sport ||
                !ageCategory ||
                !location ||
                !startDate ||
                !endDate ||
                !registrationDeadline ||
                !maxTeams
            ){
                return res.status(400).json({
                    message:"All fields required"
                });
            }

            const organization =
                await Organization.findOne({
                    ownerId:req.user.id
                });

            if(!organization){
                return res.status(404).json({
                    message:"Organization not found"
                });
            }

            await Tournament.create({
                organizationId:organization._id,
                name,
                sport,
                ageCategory,
                location,
                startDate,
                endDate,
                registrationDeadline,
                maxTeams
            });

            return res.status(201).json({
                message:"Tournament created"
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

            const tournaments =
                await Tournament.find({
                    status:"open"
                })
                .populate("organizationId");

            return res.status(200).json(
                tournaments
            );

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.post(
    "/register/:tournamentId",
    authMiddleware,
    roleMiddleware("team"),
    async(req,res)=>{
        try {

            const { tournamentId } =
                req.params;

            const tournament =
                await Tournament.findById(
                    tournamentId
                );

            if(!tournament){
                return res.status(404).json({
                    message:"Tournament not found"
                });
            }

            const team =
                await Team.findOne({
                    userId:req.user.id
                });

            if(!team){
                return res.status(404).json({
                    message:"Team not found"
                });
            }

            const existing =
                await TournamentRegistration.findOne({
                    tournamentId,
                    teamId:team._id
                });

            if(existing){
                return res.status(400).json({
                    message:"Already registered"
                });
            }

            await TournamentRegistration.create({
                tournamentId,
                teamId:team._id
            });

            return res.status(201).json({
                message:
                "Tournament registration submitted"
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.get(
    "/registrations/:tournamentId",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const { tournamentId } =
                req.params;

            const registrations =
                await TournamentRegistration.find({
                    tournamentId
                })
                .populate("teamId");

            return res.status(200).json(
                registrations
            );

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

router.put(
    "/approve/:registrationId",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const { registrationId } =
                req.params;

            const registration =
                await TournamentRegistration.findByIdAndUpdate(
                    registrationId,
                    {
                        status:"approved"
                    },
                    {
                        new:true
                    }
                );

            if(!registration){
                return res.status(404).json({
                    message:
                    "Registration not found"
                });
            }

            return res.status(200).json({
                message:
                "Registration approved",
                registration
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);
router.put(
    "/reject/:registrationId",
    authMiddleware,
    roleMiddleware("organization"),
    async(req,res)=>{
        try {

            const { registrationId } =
                req.params;

            const registration =
                await TournamentRegistration.findByIdAndUpdate(
                    registrationId,
                    {
                        status:"rejected"
                    },
                    {
                        new:true
                    }
                );

            if(!registration){
                return res.status(404).json({
                    message:
                    "Registration not found"
                });
            }

            return res.status(200).json({
                message:
                "Registration rejected",
                registration
            });

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);

export default router