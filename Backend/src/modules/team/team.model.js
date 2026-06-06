import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
    {
        organizationId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Organization",
            required:true,
            // unique:true
        },
        userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
        teamName:{
            type:String,
            required:true,
            trim:true
        },
        sport:{
            type:String,
            enum:['cricket','football'],
            required:true
        },
        ageCategory:{
            type:String,
            required:true
        },
        description:{
            type:String,
            // required:true
        },
        logo:{
            type:String,
            default:""
        },
        isActive:{
            type:Boolean,
            default:true
        }
    },
    {timestamps:true}
)

const Team = mongoose.model("Team",teamSchema)
export default Team