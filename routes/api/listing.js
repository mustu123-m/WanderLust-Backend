const express = require("express");
const router = express.Router();
const multer  = require('multer');
const {cloudinary,storage}=require('../../cloudConfig.js');
const Listing = require("../../models/listing");
const ListingController=require('../../controllers/listing.js');
const {isAuthenticated }=require("../../authenticate");
const asyncWrap=require("../../asyncWrap");
const upload = multer({ storage });
const {ListingSchema,ReviewSchema}=require('../../schemaValidate.js');
/*
 GET /api/listings
 Returns all listings (no pagination)
*/
const validateListing=(req,resp,next)=>{
  const {error}=ListingSchema.validate(req.body);
    console.log(error);
    if(error) throw new ExpressError(error,501);
    else next();
}
router.get("/", async (req, res, next) => {
  try {
 const {search}=req.query;
  console.log(search);
    if(search){
    const searchedListings=await Listing.find({$text:{$search:search}});
 console.log("Search");
    res.json({success:true,listings:searchedListings});
    }
    else{
    const listings = await Listing.find({})
      .sort({ _id: -1 }); // newest first (optional)
  console.log("Not Searched")
    res.json({
      success: true,
      count: listings.length,
      listings
    });
    }
    

  } catch (err) {
    next(err);
  }
});
router.get("/:id",async (req,resp)=>{
  console.log("I am in");
const {id}=req.params;
const listing=await Listing.findById(id).populate({path:"reviews",populate:"author"}).populate("owner");
try{
 resp.json({
      success: true,
      listing
    });
  }
  catch (err) {
    next(err);
  }
})
router.post("/",isAuthenticated,upload.array("images", 10),validateListing,asyncWrap(ListingController.insert))
router.patch("/:id",isAuthenticated,upload.array("images",10),validateListing,asyncWrap(ListingController.edit));
router.delete("/:id",isAuthenticated,asyncWrap(ListingController.delete));
router.post("/:id/booking",asyncWrap(ListingController.booking));
router.post("/booking/verify",asyncWrap(ListingController.verifyPayment));
router.get("/booking/:booking_id/success",asyncWrap(ListingController.bookingSuccess));
module.exports = router;
