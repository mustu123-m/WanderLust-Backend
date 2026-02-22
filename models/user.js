const mongoose=require('mongoose');
const passport_local_mongo=require('passport-local-mongoose');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passport_local_mongo);
module.exports = mongoose.model('User', userSchema);