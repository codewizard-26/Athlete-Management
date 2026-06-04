import express from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import Organization from "../organization/organization.model.js"
import Team from "./team.model.js"

const router = express.Router()
router.post("/create",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
    const {teamName,sport,ageCategory,description,logo}=req.body
    if(!teamName||!sport||!ageCategory){
        return res.status(400).json({message:"All feilds required"})
    }
    try {
        const ownerId=req.user.id;
        const organization=await Organization.findOne({
            ownerId
        })
        if(!organization)
        {
            return res.status(404).json({message:"Organization profile not found"});
        }
        const existingTeam = await Team.findOne({
            organizationId:organization._id,
            teamName
        })
        if(existingTeam){
            return res.status(400).json({message:"Team already exist"})
        }
        await Team.create({
    organizationId:organization._id,
    teamName,
    sport,
    ageCategory,
    description,
    logo
});
res.status(201).json({
    message:"Team created successfully"
});
    } catch (err) {
    res.status(500).json({message:err.message})
}
})

export default router