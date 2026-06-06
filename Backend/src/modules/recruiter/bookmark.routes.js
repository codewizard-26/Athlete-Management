import express from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import Organization from "../organization/organization.model.js"
import Athlete from "../athlete/athlete.model.js"
import RecruiterBookmark from "./recruiterBookmark.model.js"
import roleMiddleware from "../../middleware/role.middleware.js"

const router = express.Router()

router.post("/:athleteId",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
    try {
        const ownerId = req.user.id
        const organization = await Organization.findOne({ownerId})
        if(!organization){
            return res.status(404).json({message :"Organization not found"})
        }
        const recruiterId = organization._id
        
        const {athleteId}= req.params
        const athlete = await Athlete.findById(athleteId)
        if(!athlete){
            return res.status(400).json({message:"Athlete not found"})
        }
        const existingBookmark= await RecruiterBookmark.findOne({
            athleteId,
            recruiterId
        })
        if(existingBookmark){
            return res.status(400).json({message:"bookmark exist"
            })
        }
        await RecruiterBookmark.create({
            athleteId,
            recruiterId
        })
        return res.status(200).json({message:"bookmark created"})
    } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
})

router.get("/all",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
     try {
        const ownerId = req.user.id
           const organization = await Organization.findOne({ownerId})
           if(!organization){
               return res.status(404).json({message :"Organization not found"})
           }
           const recruiterId = organization._id
           const bookmarks = await RecruiterBookmark.find({
       recruiterId
   }).populate("athleteId");
   
   if(bookmarks.length===0){
    return res.status(400).json({message:"bookmarks not found"})
   }
    return res.status(200).json({bookmarks})
     }catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
})

router.delete("/:bookmarkId",authMiddleware,roleMiddleware("organization"),async(req,res)=>{
    const {bookmarkId} = req.params
    const bookmark = await RecruiterBookmark.findById(bookmarkId);

if(!bookmark){
    return res.status(404).json({
        message:"Bookmark not found"
    });
}
    await RecruiterBookmark.findByIdAndDelete(bookmarkId);
    return res.status(200).json({
    message:"Bookmark removed"
});
})

export default router