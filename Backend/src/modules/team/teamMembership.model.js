import mongoose from 'mongoose'

const membershipSchema = new mongoose.Schema(
    {
        athleteId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Athlete",
            required:true,
            // unique:true
        },
        teamId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Team",
            required:true,
            // unique:true
        },
        status:{
            type:String,
            enum:['active','pending','rejected','left'],
            default:"pending",
            required:true,
        },
        joinedAt:{
            type:Date,
            // required:true
        },
        leftAt:{
            type:Date,
        },
        jerseyNumber:{
            type:Number
        },
        isCaptain:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
)

const TeamMembership =mongoose.model("TeamMembership",membershipSchema)
export default TeamMembership