const mongoose=require('mongoose');
const { ListingSchema } = require('../schemaValidate');
const Review=require('./reviews.js');
const User=require('./user.js');
const listingSchema=new mongoose.Schema({
    title:{
    type:String,
    required:true   
},
    discription:String,
    images:[{
        filename:{
type:String
        },
        url:{
       type:String,
       default:"https://plus.unsplash.com/premium_photo-1734545294150-3d6c417c5cfb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
       set:(v)=> v===""?"https://plus.unsplash.com/premium_photo-1734545294150-3d6c417c5cfb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
     :v
        }
    }],
    price:Number,
    category: {
    type: String,
    enum: [
      "apartment",
      "house",
      "villa",
      "hotel",
      "camping",
      "beach",
      "mountain",
      "farm",
      "luxury",
      "city",
      "treehouse",
      "lake",
      "cabin",
      "heritage"
    ],
    required: true
  },
    location:{
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        },
        Address:{
            type:String,
            required:true
        }
    },
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
             ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    console.log("Hi I am Post");
    if(listing){
await Review.deleteMany({_id:{$in:listing.reviews}});
}})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;