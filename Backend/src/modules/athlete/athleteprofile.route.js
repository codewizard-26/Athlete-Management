import express from "express";
// import mongoose from "mongoose";
import authMiddleware from "../../middleware/auth.middleware.js"
import Athlete from "./athlete.model.js";
import User from "../user/user.model.js";

const router = express.Router()

router.post("/profile",authMiddleware,async(req,res)=>{
    const {sport,primaryRole,secondaryRole,gender,dob,height,weight,city,state,country,bio}=req.body
    if(!sport||!primaryRole||!secondaryRole||!gender||!dob||!height||!weight||!city||!state||!country||!bio)
    {
        return res.status(400).json({message:"All feilds required"})
    }
       try{ const userId=req.user.id
    const existing = await Athlete.findOne({userId:userId})
    if(existing)
    {
        return res.status(400).json({message:"user profile exists"})
    }
     await  Athlete.create({
        userId,sport,primaryRole,secondaryRole,gender,dob,height,weight,city,state,country,bio
    })
    

   await User.findByIdAndUpdate(
    userId,
    {
        isProfileCompleted:true
    }
    
)
res.status(201).json({
    message:"Athlete profile created successfully"
})
}
catch(err){
    res.status(500).json({message:err.message})
}
})

router.get("/me",authMiddleware,async(req,res)=>{
   
   try{ const userId=req.user.id
    const athlete= await Athlete.findOne({
        userId:userId
    })
    if(!athlete){
        return res.status(404).json({
    message:"Athlete profile not found"
});
    }
    return res.status(200).json(athlete)
}
catch(err){
    return res.status(500).json({message:err.message})
}
})

router.put("/update",authMiddleware,async (req,res)=>{
    try {
        const userId = req.user.id;
        const athlete = await Athlete.findOneAndUpdate(
    { userId },
    req.body,
    { new: true }
);
if (!athlete) {
    return res.status(404).json({
        message: "Athlete profile not found"
    });
}
return res.status(200).json({message:"Profile updated",athlete})
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
})

export default router