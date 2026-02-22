const User = require('../models/user.js');
const Listing = require('../models/listing.js');
const Booking = require('../models/booking.js');
const passport = require('passport');

module.exports.getCurrentUser = (req, res) =>
{
if (!req.user)
{
return res.json({ user: null });
}

res.json({
user:
{
_id: req.user._id,
username: req.user.username
}
});
};

module.exports.loginUser = (req, res, next) =>
{
passport.authenticate("local", (err, user, info) =>
{

if (err) return next(err);

if (!user)
{
return res.status(401).json({
success: false,
message: "Invalid username or password"
});
}

req.logIn(user, err =>
{
if (err) return next(err);

res.json({
success: true,
user:
{
_id: user._id,
username: user.username
}
});
});

})(req, res, next);
};

module.exports.registerUser = async (req, res) =>
{
try
{
const { username, email, password } = req.body;

const user = new User({ username, email });
const registeredUser = await User.register(user, password);

req.login(registeredUser, err =>
{
if (err)
{
return res.status(500).json({
success: false,
message: "Login after signup failed"
});
}

res.json({
success: true,
user:
{
_id: registeredUser._id,
username: registeredUser.username
},
message: "Account created successfully"
});
});
}
catch (err)
{
res.status(400).json({
success: false,
message: err.message
});
}
};

module.exports.logoutUser = (req, res) =>
{
req.logout(() =>
{
res.json({
success: true,
message: "Logged out successfully"
});
});
};

module.exports.getMyListings = async (req, res) =>
{
try
{
const listings = await Listing.find({ owner: req.user._id });

res.json({
success: true,
listings
});
}
catch (error)
{
res.json({
success: false,
message: error
});
}
};

module.exports.getMyBookings = async (req, res) =>
{
try
{
const bookings = await Booking
.find({ user: req.user._id, paymentStatus: "paid" })
.populate("listing");

res.json({
success: true,
bookings
});
}
catch (error)
{
res.json({
success: false,
message: error
});
}
};