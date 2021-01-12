const express = require('express')

const app = express()
const mysql=require('mysql2')
const db=require('./models/User')

const passport = require('passport')

const session = require('express-session')



//const User = require('./models/User')

const facebookStrategy = require('passport-facebook').Strategy

app.set("view engine","ejs")
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new facebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : "1809180645887749",
    clientSecret    : "74592cfda567fce292816a10dd4a1b33",
    callbackURL     : "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email'],
    enableProof: true
},// facebook will send back the token and profile
function(token, refreshToken, profile, done) {
    //console.log(profile)
    let id    = profile.id; // set the users facebook id                   
    let tok = token; // we will save the token that facebook provides to the user                    
    let firstName  = profile.name.givenName
    let lastName=profile.name.familyName; // look at the passport user profile to see how names are returned
    let email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
    //let gender = profile.gender
    //let pic = profile.photos[0].value
    db.execute("SELECT count(*) as ink FROM users WHERE email='"+email+"'").then(([row])=>{
        if(row[0].ink){
            console.log("User Found")
        }
        else{
            db.execute("INSERT INTO users(id,firstName,lastName,email)VALUES('"+id+"','"+firstName+"','"+lastName+"','"+email+"')")
            .then(result=>console.log(result)).catch(err=>console.log(err))
            
        }
    }).catch(err=>{
        console.log(err)
        logger.debug(err)
     })

    done(null, profile);
}))
   
passport.serializeUser(function(user, done) {
    done(null, user);
});
// used to deserialize the user
passport.deserializeUser(function(id, done) {
    /*User.findById(id, function(err, user) {
        done(err, user);
    });*/
    return(null,id)
});

app.get('/profile', isLoggedIn, function(req, res) {
    console.log('Valid User')
    res.send("You are a valid user")
    //console.log(req.user)
    res.render('profile', {
        user : req.user // get the user out of session and pass to template
    });
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

app.get('/',(req,res) => {
    res.render("index.ejs")
})

app.listen(5000,() => {
    console.log("App is listening on Port 5000")
})