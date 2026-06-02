import mongoose from 'mongoose'

const athleteSchema= new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true
        },
        sport:{
            type:String,
            enum:['cricket','football'],
            required:true
        },
        primaryRole:{
            type:String,
            required:true,
            trim:true
        },
        secondaryRole:{
            type:String,
            trim:true
        },
        gender:{
            type:String,
            enum:['male','female'],
            required:true
        },
        dob:{
            type:Date,
            required:true
        },
        height:{
            type:Number,
            required:true
        },
        weight:{
            type:Number,
            required:true
        },
        city:{
            type:String,
            required:true,
            trim:true
        },
        state:{
            type:String,
            required:true,
            trim:true
        },
        country:{
            type:String,
            required:true,
            trim:true
        },
        bio:{
            type:String,
            // required:true,
            trim:true
        }
    },
    {timestamps:true}
)

const Athlete =mongoose.model("Athlete",athleteSchema);

export default Athlete