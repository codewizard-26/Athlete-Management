import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import roleMiddleware from '../../middleware/role.middleware.js'
import Organization from './organization.model.js'
import User from '../user/user.model.js'
import { deleteImageFromCloudinary } from '../../utils/cloudinaryUpload.js';

const router = express.Router()

router.post("/profile",authMiddleware,roleMiddleware("organization"),async (req,res)=>{
    const {organizationName,description,logo,city,state,country,website}=req.body
if(!organizationName||!description||!city||!state||!country){
     return res.status(400).json({message:"All feilds required"})
}
try {
    const ownerId=req.user.id
    const existing = await Organization.findOne({ownerId})
    if(existing){
        return res.status(400).json({message:"Organization profile exist"})
    }
    await Organization.create({
        ownerId,organizationName,description,logo,city,state,country,website
    })
    await User.findByIdAndUpdate(
        ownerId,
        {
            isProfileCompleted:true
        }
    )
    res.status(201).json({
    message:"Organization profile created successfully"
})
} catch (err) {
    res.status(500).json({message:err.message})
}
})

router.get("/me",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
    try {
        const ownerId=req.user.id
        const organization= await Organization.findOne({ownerId})
        if(!organization)
        {
            return res.status(404).json({message:"Organization profile not found"});
        }
        return res.status(200).json(organization)
    } catch(err){
    return res.status(500).json({message:err.message})
}
})

router.put("/update",authMiddleware,roleMiddleware("organization"),async (req,res)=>{
    try {
        const ownerId = req.user.id;
        
        // Fetch existing organization to check for old logo
        const existingOrg = await Organization.findOne({ ownerId });
        if (!existingOrg) {
            return res.status(404).json({
                message: "organization profile not found"
            });
        }
        
        // If a new logo is provided and it's different from the old one, delete the old one
        if (req.body.logo && req.body.logo.public_id && existingOrg.logo && existingOrg.logo.public_id) {
            if (req.body.logo.public_id !== existingOrg.logo.public_id) {
                await deleteImageFromCloudinary(existingOrg.logo.public_id);
            }
        }
        
        const organization = await Organization.findOneAndUpdate(
            { ownerId },
            req.body,
            { new: true }
        );
        
        return res.status(200).json({message:"Profile updated",organization})
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
})

export default router