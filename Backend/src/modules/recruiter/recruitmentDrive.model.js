import mongoose from 'mongoose'

const recruitmentDriveSchema = new mongoose.Schema(
    {
        teamId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Team',
            required:true
        },
        title:{
            type:String,
            required:true,
            trim:true
        },
        description:{
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
        applicationDeadline:{
            type:Date,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:['open','closed','completed','cancelled'],
            default:'open',
            required:true
        },
        vacancies:{
            type:Number
        }
    },
    {timestamps:true})

const RecruitmentDrive = mongoose.model("RecruitmentDrive",recruitmentDriveSchema)
export default RecruitmentDrive