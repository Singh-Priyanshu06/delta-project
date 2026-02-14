if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const { cloudinary, storage } = require('./cloudConfig.js'); 
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path"); 
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js")

const dbUrl = process.env.ATLASDB_URL



async function main() {
    await mongoose.connect(dbUrl)
}

main().then(()=>{
    console.log("connect to db")
}).catch(err =>{
    console.log(err)
})


// const store =MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret: process.env.SECRET,
//     },
//     touchAfter: 24 * 3600,
// });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});



const sessionOption={
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized: false,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};




app.use(session(sessionOption));
app.use(flash());


app.set("view engine",'ejs')
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

const listingRouter = require("./routes/listing.js")
app.use("/listings", listingRouter);

const reviewRouter = require("./routes/review.js")
app.use("/listings/:id/reviews", reviewRouter)

const userRouter = require("./routes/user.js")
app.use("/", userRouter);



// app.use((err, req, res, next) => {
//     // if (res.headersSent) return next(err);
//     const statusCode = err.statusCode || 500;
//     const message = err.message || "Page not found";
//     // res.status(statusCode).send(message);
//     res.render("error.ejs",{err})
// });

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(3000,()=>{
    console.log("Server are run")
})
console.log("SECRET:", process.env.CLOUD_API_SECRET);
