import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
{
    tournamentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tournament",
        required:true
    },

    homeTeamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },

    awayTeamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },

    matchDate:{
        type:Date,
        required:true
    },

    venue:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:[
            "scheduled",
            "live",
            "completed",
            "cancelled"
        ],
        default:"scheduled"
    },

    homeScore:{
        type:Number,
        default:0
    },

    awayScore:{
        type:Number,
        default:0
    },

    winner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team"
    },

    hasReport:{
        type:Boolean,
        default:false
    },

    matchStats:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    }
},
{timestamps:true}
);

const Match =
mongoose.model("Match",matchSchema);

export default Match;