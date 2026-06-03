import mongoose from 'mongoose'

const recruitmentApplicationSchema = new mongoose.Schema(
    {
        athleteId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Athlete',
            required:true,
            // unique:true
        },
        recruitmentDriveId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'RecruitmentDrive',
            required:true,
            // unique:true
        },
        status:{
            type:String,
            enum:['accepted','pending','rejected','withdrawn'],
            default:'pending'
        },
        appliedAt:{
            type:Date,
            // required:true,
            default:Date.now
        },
        remarks:{
            type:String,
            // required:true,
            trim:true
        }
    },
    {timestamps:true}
)

const RecruitmentApplication = mongoose.model("RecruitmentApplication",recruitmentApplicationSchema)
export default RecruitmentApplication