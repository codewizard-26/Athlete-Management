import jwt from "jsonwebtoken";

const authMiddleware =(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization
        // console.log("user: ",req.user)
        if(!authHeader){
            return res.status(401).json({message:"No token provided"})
        }
        const token =authHeader.split(" ")[1];
         const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log("decoded",decoded)
        req.user=decoded;
        next();
    } catch(err){
        return res.status(401).json({message:"invalid token"})
    }
}
export default authMiddleware;