const mongoose=require('mongoose');
const ReviewSchema=new mongoose.Schema({
    comment:String,
    rating:{
        type:String,
        min:1,
        max:5
    },
    created_at:{
    type:Date,
    default:new Date()
    }
    ,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports=mongoose.model("Review",ReviewSchema);