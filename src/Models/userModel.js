const mongoose=require("mongoose");

//Schema for users
const UserSchema=new mongoose.Schema({
    
    UserId: {
        type:String,
        required:true,
        unique:true,
    },
    Username: {
        type:String,
        required:true,
        unique:false,
    },
    Password: {
        type:String,
        required:true,
        unique:false,
    },
    Salt: {
        type:String,
        required:true,
        unique:true,
    },
    Points:{
        type: Number,
        default:0
    },
    Rank:{
        type:Number,
        default:1,
    }

    });

    const user=mongoose.model('Users',UserSchema);
    module.exports=user;