import express from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import roleMiddleware from '../../middleware/role.middleware'

const router = express.Router()

router.get("/team",authMiddleware,async(req,res)=>{
    try {
        const team = await Team.findOne({
    userId:req.user.id
});

const members =
await TeamMembership.countDocuments({
    teamId:team._id,
    status:"active"
});

const pendingRequests =
await TeamMembership.countDocuments({
    teamId:team._id,
    status:"pending"
});

return res.status(200).json({
    members,
    pendingRequests
});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
})

router.get("/athlete",authMiddleware,async(req,res)=>{
    try {
       const athlete =
await Athlete.findOne({
    userId:req.user.id
});

const matches =
await Performance.countDocuments({
    athleteId:athlete._id
});

const teams =
await TeamMembership.countDocuments({
    athleteId:athlete._id,
    status:"active"
});

return res.status(200).json({
    matches,
    teams
});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
})


export default router