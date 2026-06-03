import mongoose from 'mongoose'

const matchSchema=new mongoose.Schema(
    {
        teamAId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
},
        teamBId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true
},
        tournamentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tournament',
        required:true
        },
        venue:{
    type:String,
    required:true,
    trim:true
},
        matchDate:{
            type:Date,
            required:true
        },
        status:{
            type:String,
            enum:['scheduled','live','completed','cancelled'],
            default:'scheduled'
        },
       result: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
},

winnerTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
},

resultSummary: {
    type: String,
    trim: true
}
    },
    {timestamps:true}
)

const Match = mongoose.model("Match",matchSchema)
export default Match