import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../user/user.model.js"

const router = express.Router();

router.post("/register",async(req,res)=>{
    const {name,email,phoneNumber,password,role}=req.body;
    if(!name || !email || !phoneNumber || !password || !role){
        return res.status(400).json({
    message:"All fields are required"
})
    }
    try{
        const existingemail = await User.findOne({email});
        if(existingemail)
        {
            return res.status(409).json({message:"User already exist"})
        }
        const existingPhone = await User.findOne({phoneNumber});
        if(existingPhone){
            return res.status(409).json({message:"User already exist"})
        }
        const hashedpassword = await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            password:hashedpassword,
            phoneNumber,
            role
        });
        res.status(201).json({message:"User reg succesfull"})
    }
    catch(err){
        console.log("err",err)
        res.status(500).json({message:err.message})
    }
});

router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"all fields are required"})
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
           return res.status(401).json({
    message:"Invalid email or password"
})
        }
       const token = jwt.sign(
    {
        id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);
        res.json({
            message:"login successful",
            token,
            user:{name:user.name,email:user.email,role:user.role}
        })
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
})


export default router