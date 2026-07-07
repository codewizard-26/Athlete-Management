import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
    {
        ownerId:{
            type:mongoose.Schema.Types.ObjectId,
                        ref:"User",
                        required:true,
                        unique:true
        },
        organizationName:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        description:{
            type:String,
            // required:true
        },
        logo: {
            url: { type: String, default: "" },
            public_id: { type: String, default: "" }
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
        website:{
            type:String,
            default:""
        },
        isVerified:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
)

const Organization =mongoose.model("Organization",organizationSchema)
export default Organization