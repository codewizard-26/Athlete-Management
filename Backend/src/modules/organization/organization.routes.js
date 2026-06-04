import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import roleMiddleware from '../../middleware/role.middleware.js'
import Organization from './organization.model.js'

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
    // await Organization.findByIdAndUpdate(
    //     ownerId,
    //     {
    //         isVerified:true
    //     }
        
    // )
    res.status(201).json({
    message:"Organization profile created successfully"
})
} catch (err) {
    res.status(500).json({message:err.message})
}
})

export default router