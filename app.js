if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
console.log("connected to database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
const path = require("path");
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});
store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
});
//server side validation
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialised: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly: true,
  }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8080,()=>{
console.log("listening on 8080");
});
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.err = req.flash("err");
  res.locals.currUser = req.user;
  next();
});
app.get("/demouser", async (req,res)=>{
 let fakeUser = new User({
  email: "student@gmail.com",
  username: "delta-student"
 });
 let registeredUser = await User.register(fakeUser,"abc");
 res.send(registeredUser);
})


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"PAGE NOT FOUND"));
});
app.use((err,req,res,next)=>{
let {status=500,message="error"} = err;
res.status(status).render("error.ejs",{message});
//res.status(status).send(message);
});
