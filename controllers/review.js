const Listing=require('../models/listing');
const Review=require('../models/reviews');
module.exports.post=async(req,resp)=>{
     let {id}=req.params;
     console.log("Post request Arrived");
    const listing=await Listing.findById(id);
    console.log(req.body);
    const review=new Review(req.body.review);
    console.log(review);
    review.author=req.user._id;
    await review.save();
    await review.populate("author", "username");
   listing.reviews.push(review);
   const result=await listing.save().then(()=>{
      resp.json({
      success:true,
      review:review,
      message:"Review Posted Sucessfully"
   })
   }).catch((err)=>{
resp.json({
   success:false,
   message:err
})
   });
}
module.exports.delete=async(req,resp)=>{
    let {id,review_id}=req.params;
    console.log("hello");
    try {
      console.log(review_id);
       let orgreview=await Review.findById(review_id).populate("author");
   if(orgreview.author._id.equals(req.user._id))
   {
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_id}});
    await Review.findByIdAndDelete(review_id);
    console.log("Sending Sucess")
    resp.json({
      success:true,
      message:"Successfully Deleted"
    })
   }
   else
   {
        console.log("Not Sending Sucess")
     resp.json({
      success:false,
      type:"danger",
      message:"You are not the author"
     })
   }
    } catch (error) {
        console.log("Not Sending Sucess")
      console.log(error);
      resp.json({
      success:false,
      type:"danger",
      message:error
     })
    }
  
}