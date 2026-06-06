import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
{
    organizationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    sport:{
        type:String,
        enum:["cricket","football"],
        required:true
    },
    ageCategory:{
        type:String,
        required:true
    },
    location:{
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
    registrationDeadline:{
        type:Date,
        required:true
    },
    maxTeams:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["open","closed","completed"],
        default:"open"
    }
},
{timestamps:true}
);

const Tournament = mongoose.model(
    "Tournament",
    tournamentSchema
);

export default Tournament;