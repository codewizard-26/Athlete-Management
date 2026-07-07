import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true
        },
        phoneNumber:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        avatar: {
            url: { type: String, default: "" },
            public_id: { type: String, default: "" }
        },
        role:{
            type:String,
            enum: ['athlete', 'organization', 'team'],
        required: true,
        lowercase:true
        },
        isProfileCompleted:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
)

const  User=mongoose.model("User",userSchema);
export default User;