const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner,validateListing} = require("../middleware.js");
const User = require("../models/user.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get(wrapAsync(listingController.index))                                        //home page route
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));  //create route

//create route
router.get("/new" ,isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing)) //update listing
.get(wrapAsync(listingController.showListing)) //read listing
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); //delete
    
 //edit
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
    
      

    

module.exports = router;
