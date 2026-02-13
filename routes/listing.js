const express = require("express")
const router = express.Router();
exports.router = router;
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing")
const passport = require("passport");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

// router.route("/")
//     .get(wrapAsync(listingController.showListing))
//     .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing)
//     );


// index route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm)


//Show Route
router.get("/:id", wrapAsync(listingController.showListing))

//create routes
router.post("/", isLoggedIn,validateListing, upload.single('listing[image]'),wrapAsync(listingController.createListing));

//edit routes
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//update route
router.put("/:id", isLoggedIn,isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))

//delete route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

module.exports = router;
