import express from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import Organization from "../organization/organization.model.js"
import Team from "./team.model.js"
import Athlete from "../athlete/athlete.model.js"
import TeamMembership from "./teamMembership.model.js"

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


router.get("/myTeams",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
    try {
        const ownerId = req.user.id
        const organization = await Organization.findOne({
            ownerId
        })
        if(!organization){
    return res.status(404).json({
        message:"Organization profile not found"
    });
}
        const teams = await Team.find({
            organizationId: organization._id
        });
       
        return res.status(200).json(teams)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
})
router.get("/pending-members",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
    try {
        // console.log("1")
        const ownerId = req.user.id;
    // console.log("2")
    const organization = await Organization.findOne({
        ownerId
    });
    // console.log("3")
            if(!organization){
                return res.status(400).json({message:"organization does not exist"})
            }
            const teams = await Team.find({
        organizationId: organization._id
    });
    // console.log("4")
    if(!teams){
        return res.status(400).json({message:"Team does not exist"})
    }
    const teamIds = teams.map(team => team._id);
    // console.log("5")
    const pendingRequests = await TeamMembership.find({
        teamId: { $in: teamIds },
        status: "pending"
    }).populate("athleteId").populate("teamId")
    return res.status(200).json(pendingRequests);
    } catch (err) {
            return res.status(500).json({
            message: err.message
        });
    }
    
})

router.get("/my-memberships",authMiddleware,roleMiddleware("athlete"),async(req,res)=>{
    try {
        const userId= req.user.id
        const athlete = await Athlete.findOne({userId})
        if(!athlete){
            return res.status(404).json({message:"Athlete doesnt exist"})
        }
        const memberships = await TeamMembership.find({
        athleteId: athlete._id
    })
    .populate("teamId");
    if(!memberships){
        return res.status(404).json({message:"memberships doesnt exists"})
    }
    return res.status(200).json(memberships);
    } catch (err) {
            return res.status(500).json({
            message: err.message
        });
    }
})

router.put("/approve/:membershipId",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
    try {
        const {membershipId}= req.params;
        const membership =
    await TeamMembership.findByIdAndUpdate(
        membershipId,
        {
            status: "active",
            joinedAt: new Date()
        },
        { new: true }
    );
    if(!membership){
        return res.status(404).json({message:"Membership doesnt exist"})
    }
    return res.status(200).json({
    message:"Athlete approved",
    membership
});
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
})

router.put("/reject/:membershipId",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
    try {
        const {membershipId}= req.params
        const membership = await TeamMembership.findByIdAndUpdate(
            membershipId,
            {
                status:"rejected",
                leftAt:new Date()
            }
        )
        if(!membership){
        return res.status(404).json({message:"Membership doesnt exist"})
    }
    return res.status(200).json({
    message:"Athlete rejected",
    membership
});
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
})

router.get("/:teamId", authMiddleware, async (req, res) => {
    try {

        const { teamId } = req.params;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        return res.status(200).json(team);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});


router.put("/:teamId",authMiddleware,async(req,res)=>{
    try {
        const {teamId}=req.params;
        const team = await Team.findByIdAndUpdate(
            teamId,
            req.body,
            {new:true}  
        )
        if(!team){
    return res.status(404).json({
        message:"Team not found"
    });
}
return res.status(200).json({
    message:"Team updated successfully",
    team
});
    } catch (err) {
            return res.status(500).json({
            message: err.message
        });
    }
})

router.post("/join/:teamId",authMiddleware,roleMiddleware("athlete"),async (req,res)=>{
        try {
            const {teamId}= req.params;
            const userId=req.user.id
            const athlete= await Athlete.findOne({userId})
            if(!athlete){
                return res.status(404).json({
    message:"Athlete profile not found"
});}
        const team = await Team.findById(teamId);
        if(!team){
            return res.status(404).json({
    message:"Team not found"
});
        }
        const existing = await TeamMembership.findOne({
    athleteId: athlete._id,
    teamId
}); 
if(existing){
    return res.status(400).json({
    message:"Already applied or member of this team"
});
}
await TeamMembership.create({
    athleteId:athlete._id,
    teamId
})   
 return res.status(201).json({
    message:"Join request sent successfully"
});
    
        } catch (err) {
            return res.status(500).json({
            message: err.message
        });
    }
})



export default router