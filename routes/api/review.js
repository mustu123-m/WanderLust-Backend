const express=require('express');
const route=express.Router({mergeParams:true});
const {ListingSchema,ReviewSchema}=require('../../schemaValidate.js');
const ReviewController=require('../../controllers/review.js');
const Listing=require('../../models/listing.js');
const Review=require('../../models/reviews.js');
const{ isAuthenticated}=require('../../authenticate.js');
const validateReview=(req,resp,next)=>{
    console.log(ReviewSchema);
  const {error}=ReviewSchema.validate(req.body);
    console.log(error);
    if(error) throw new ExpressError(error,501);
    else next();
}

const ExpressError=require('../../util/ExpressError.js');
const asyncWrap=require('../../asyncWrap.js');

route.post("/",isAuthenticated,validateReview,asyncWrap(ReviewController.post));
route.delete("/:review_id",isAuthenticated,asyncWrap(ReviewController.delete));
module.exports=route;