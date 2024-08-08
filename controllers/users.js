const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
    };

module.exports.signup = async (req,res) =>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser , password);
    //console.log(registeredUser);
    req.login(registeredUser, (erro)=>{
        if(erro){
            return next(erro);
        }
        req.flash("success" , "WELCOME TO WANDERLUST!");
    res.redirect("/listings");
    });
    } catch(e){ 
        if (!res.headersSent) {
            req.flash("err", e.message);
            res.redirect("/signup");
        }
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
    };

module.exports.login = async (req,res)=>{
    req.flash("success", "Welcomeback!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    };

module.exports.logout = (req,res,next) => {
    req.logout((erro)=>{
            if(erro){
                return next(erro);
            }
        req.flash("success","you are logged out");
        res.redirect("/listings");
     })
    };