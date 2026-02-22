require('dotenv').config();
const Listing=require('../models/listing');
const Booking = require("../models/booking");
const Razorpay=require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});
const crypto=require('crypto');
module.exports.index=async (req, res, next) => {
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
}

module.exports.show=async (req,resp)=>{
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
}
module.exports.insert=async (req,resp)=>{
 
     let {title,price,latitude,category,longitude,address,country}=req.body;
    console.log(req.body);
   const listing=new Listing(
        {
            title:title,
            price:price,
            category:category,
            location:{
                latitude:latitude,
                longitude:longitude,
                Address:address
            },
            country:country,
            owner:req.user._id
        }
    )
      listing.images = req.files.map(f => ({
    url: f.path,
    filename: f.filename
  }));
     await listing.save();
    resp.json({
      sucess:true,
      message:"Successfully added"
    })
}
module.exports.edit=async (req,resp)=>{
       let {id}=req.params;
       let listing=req.body;
       let orglisting=await Listing.findById(id).populate("owner");
       if(req.user._id.equals(orglisting.owner._id))
       {
    let listing2=await Listing.findByIdAndUpdate(id,listing);
    console.log("Image is");
    console.log(req.file);
    if(req.file){
     listing2.image={
        filename:req.file.originalname,
        url:req.file.path
     }
     await listing2.save();
    }
   resp.json({
    success:true,
    message:"Successfully Ediited Listing"
   });
 }
 else{
       resp.json({
        success:false,
        message:"You are not the owner of this listing"
       })
 }
}
    module.exports.delete=async (req,resp)=>{
       let {id}=req.params;
   let listing= await Listing.findById(id).populate("owner");
   if(req.user._id.equals(listing.owner._id))
       {
    await Listing.findByIdAndDelete(id);
  resp.json({
    success:true,
    message:"Listing Successfully Deleted"
  })
      }
else{
   resp.json({
    success:false,
    message:"You are not the owner of this Listing"
   })
}
}
module.exports.booking=async(req,resp)=>{

const {id}=req.params;
console.log("I am booking");
console.log(req.body)
const { CheckIn, CheckOut } = req.body;
    const listing=await Listing.findById(id);
    console.log(listing);
const nights =
    (new Date(CheckOut) - new Date(CheckIn)) / (1000 * 60 * 60 * 24);
    console.log(nights);
  const totalPrice = nights * listing.price;

const conflict = await Booking.findOne({
  listing: listing,
  checkIn: { $lt: CheckOut },
  checkOut: { $gt: CheckIn },
  paymentStatus: "paid"
});

const booking= new Booking({
listing: listing,
    user: req.user._id,
   checkIn: CheckIn,
    checkOut:CheckOut,
    totalPrice
})
if (conflict) {
resp.json({
  success:false,
  message:"Dates not available for booking"
})
}
const order=await razorpay.orders.create({
amount: totalPrice * 100,
currency: "INR",
receipt: booking._id.toString()
});
await booking.save();
    resp.json({success:true,booking:booking,order:order,razorpayKey: process.env.RAZORPAY_KEY});
}
module.exports.verifyPayment=async(req,resp)=>{
    console.log("Here to verify")
    console.log(req.body);
    const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;
console.log(req.body.bookingId);
  const booking =await Booking.findById(req.body.bookingId);
  console.log(booking);
  console.log("Upar hai booking")
    const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  
console.log(generatedSignature);
console.log(razorpay_signature);
  if (generatedSignature !== razorpay_signature) {
    booking.paymentStatus = "failed";
    await booking.save();
    return resp.json({
      success:false,
      message:"Payment verification failed"
    })
  }

  booking.paymentStatus = "paid";
  booking.paymentId = razorpay_payment_id;
  await booking.save().then((result)=>{
    console.log(result);
  })
  .catch((err)=>console.log(err));

  resp.json({
    success:true
  })
};

module.exports.bookingSuccess=async (req,resp)=>{
    const booking = await Booking.findById(req.params.booking_id)
    .populate("listing")
    .populate("user");

  if (!booking || booking.paymentStatus !== "paid") {
    req.flash("error", "Invalid booking");
    return resp.redirect("/");
  }
resp.json({success:true,booking:booking});
};
