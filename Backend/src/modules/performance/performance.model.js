import mongoose from 'mongoose'

const performanceSchema =new mongoose.Schema({
    athleteId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Athlete',
        required:true
    },
    matchId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Match',
        required:true
    },
    teamId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Team',
            required:true
    },
    sport:{
    type:String,
    enum:['cricket','football'],
    required:true
},
    stats:{
    type:mongoose.Schema.Types.Mixed,
    default:{}
},
tournamentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Tournament",
    required:true
}
},
    {timestamps:true})
    performanceSchema.index(
    {
        athleteId: 1,
        matchId: 1
    },
    {
        unique: true
    }
);

performanceSchema.index(
{
    athleteId:1,
    matchId:1
},
{
    unique:true
}
);
    const Performance = mongoose.model("Performance",performanceSchema)
    export default Performance