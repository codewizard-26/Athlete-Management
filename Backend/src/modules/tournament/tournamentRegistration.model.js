import mongoose from 'mongoose'

const tournamentRegistrationSchema=new mongoose.Schema({
    tournamentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tournament',
        required:true
    },
    teamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
    },
    status:{
        type:String,
        enum:['pending','approved','rejected','withdrawn'],
        default:'pending'
    },
    registeredAt:{
        type:Date,
        default:Date.now
    },
    remarks:{
        type:String,
        trim:true
    }
},{timestamps:true})
tournamentRegistrationSchema.index(
    {
        tournamentId:1,
        teamId:1
    },
    {
        unique:true
    }
);

const TournamentRegistration = mongoose.model("TournamentRegistration",tournamentRegistrationSchema)
export default TournamentRegistration