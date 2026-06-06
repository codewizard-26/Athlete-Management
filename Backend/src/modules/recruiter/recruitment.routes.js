// import router from "../organization/organization.routes.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import roleMiddleware from "../../middleware/role.middleware.js";
import Organization from '../organization/organization.model.js';
import Team from '../team/team.model.js'
import RecruitmentDrive from "./recruitmentDrive.model.js";
import Athlete from "../athlete/athlete.model.js";
import RecruitmentApplication from "./recruitmentApplication.model.js";
import express from 'express'

const router = express.Router()

router.post(
    "/create",
    authMiddleware,
    roleMiddleware("team"),
    async (req,res)=>{
        try {

            const {
                title,
                description,
                sport,
                ageCategory,
                applicationDeadline,
                location,
                vacancies
            } = req.body;

            if(
                !title ||
                !description ||
                !sport ||
                !ageCategory ||
                !applicationDeadline ||
                !location
            ){
                return res.status(400).json({
                    message:"All fields required"
                });
            }

            const team = await Team.findOne({
                userId: req.user.id
            });

            if(!team){
                return res.status(404).json({
                    message:"Team not found"
                });
            }

            await RecruitmentDrive.create({
                teamId: team._id,
                title,
                description,
                sport,
                ageCategory,
                applicationDeadline,
                location,
                vacancies
            });

            return res.status(201).json({
                message:"Recruitment drive created"
            });

        } catch(err){
            return res.status(500).json({
                message: err.message
            });
        }
    }
);

router.get(
    "/my-drives",
    authMiddleware,
    roleMiddleware("team"),
    async (req,res)=>{
        try {

            const team = await Team.findOne({
                userId:req.user.id
            });

            const drives =
                await RecruitmentDrive.find({
                    teamId:team._id
                });

            return res.status(200).json(drives);

        } catch(err){
            return res.status(500).json({
                message:err.message
            });
        }
    }
);


router.post("/apply/:driveId",authMiddleware,roleMiddleware("athlete"),async (req,res)=>{
        try {
            const {driveId}= req.params;
            const userId=req.user.id
            console.log(req.user);
            const athlete= await Athlete.findOne({userId})
            if(!athlete){
                return res.status(404).json({
    message:"Athlete profile not found"
});}
        const recruitmentDrive = await RecruitmentDrive.findById(driveId);
        if(!recruitmentDrive){
            return res.status(404).json({
    message:"Drive not found"
});
        }
        const existing = await RecruitmentApplication.findOne({
    athleteId: athlete._id,
    recruitmentDriveId:driveId
}); 
if(existing){
    return res.status(400).json({
    message:"Already applied",
    
});
}
await RecruitmentApplication.create({
    athleteId:athlete._id,
    recruitmentDriveId:driveId
})   
 return res.status(201).json({
    message:"Application request sent successfully"
});
    
        } catch (err) {
            return res.status(500).json({
            message: err.message
        });
    }
})

router.get(
    "/applications/:driveId",
    authMiddleware,
    roleMiddleware("organization"),
    async (req, res) => {
        try {

            const { driveId } = req.params;

            const applications =
                await RecruitmentApplication.find({
                    recruitmentDriveId: driveId
                })
                .populate("athleteId");

            return res.status(200).json(applications);

        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    }
);
router.put(
    "/accept/:applicationId",
    authMiddleware,
    roleMiddleware("team"),
    async(req,res)=>{
        try {

            const { applicationId } = req.params;

            const application =
                await RecruitmentApplication.findByIdAndUpdate(
                    applicationId,
                    {
                        status:"accepted"
                    },
                    {
                        new:true
                    }
                );

            if(!application){
                return res.status(404).json({
                    message:"Application not found"
                });
            }

            return res.status(200).json({
                message:"Application accepted",
                application
            });

        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    }
);

router.put(
    "/reject/:applicationId",
    authMiddleware,
    roleMiddleware("team"),
    async(req,res)=>{
        try {

            const { applicationId } = req.params;

            const application =
                await RecruitmentApplication.findByIdAndUpdate(
                    applicationId,
                    {
                        status:"rejected"
                    },
                    {
                        new:true
                    }
                );

            if(!application){
                return res.status(404).json({
                    message:"Application not found"
                });
            }

            return res.status(200).json({
                message:"Application rejected",
                application
            });

        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    }
);

export default router