const express = require('express');
const router = express.Router({ mergeParams: true });

const { isAuthenticated } = require('../../authenticate.js');

const userController = require('../../controllers/user.js');

router.get("/me", userController.getCurrentUser);

router.post("/login", userController.loginUser);

router.post("/register", userController.registerUser);

router.post("/logout", userController.logoutUser);

router.get("/my-listings",
isAuthenticated,
userController.getMyListings
);

router.get("/my-bookings",
isAuthenticated,
userController.getMyBookings
);

module.exports = router;