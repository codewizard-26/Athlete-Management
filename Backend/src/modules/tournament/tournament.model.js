import mongoose from 'mongoose'

const tournamentSchema = new mongoose.Schema(
    {
        organizationId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Organization',
            required:true
        },
        title:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
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
        startDate:{
            type:Date,
            required:true
        },
        endDate:{
            type:Date,
            required:true
        },
        venues:[
    {
        type:String,
        trim:true
    }
],
        registrationDeadline:{
            type:Date,
            required:true
        },
        status:{
            type:String,
            enum:['upcoming','ongoing','suspended','completed'],
            default:'upcoming'
        }
    },
    {timestamps:true}
)

const Tournament = mongoose.model("Tournament",tournamentSchema)
export default Tournament