const express = require('express')

const app = express()

const mysql=require('mysql2')

const db=require('./models/User')

const passport = require('passport')

const session = require('express-session')

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

require('./fb_passport_auth');

require('./google_passport_auth');

require('./routes/admin');
//const User = require('./models/User')

const facebookStrategy = require('passport-facebook').Strategy

app.set("view engine","ejs")
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session()); 


app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
// route middleware to make sure
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/profilefb', isLoggedIn, (req, res) =>{
    let ema = req.user.emails[0].value;
    db.execute("select * from fb_users where email = '"+ema+"' ")
   .then(result => {
    res.render("profile_fb",{fname:result[0][0].firstName,lname:result[0][0].lastName,email:result[0][0].email,phone:result[0][0].phone_no})
    })
    .catch(err=> {
        console.log(err);
    });
})

app.get('/profilegm', isLoggedIn, (req, res) =>{

    let ema = req.user.emails[0].value;
    console.log(ema);
    db.execute("select * from google_users where email = '"+ema+"' ")
    
   .then(result => {
       console.log(result);
    res.render("profile_gm",{fname:result[0][0].firstname,lname:result[0][0].lastname,email:result[0][0].email,phone:result[0][0].phone_no})
    })
    .catch(err=> {
        console.log(err);
    });
})

app.post('/updatefb',(req,res,next) => {
    let ob={
        'fname':req.body.fname,
        'lname':req.body.lname,
        'phno':req.body.phone,
        'email':req.body.email
   } 
    db.execute("update fb_users set firstName='"+ob.fname+"', lastName ='"+ob.lname+"', phone_no ='"+ob.phno+"' where email='"+ob.email+"' ")
    .then(result => {
        console.log(result[0]);
    })
    .catch(err=> {
        console.log(err);
    });  
    res.redirect('/profilefb') 
})

app.post('/updategm',(req,res,next) => {
    let ob={
        'fname':req.body.fname,
        'lname':req.body.lname,
        'phno':req.body.phone,
        'email':req.body.email
   } 
    db.execute("update google_users set firstname='"+ob.fname+"', lastname ='"+ob.lname+"', phone_no ='"+ob.phno+"' where email='"+ob.email+"' ")
    .then(result => {
        console.log(result[0]);
    })
    .catch(err=> {
        console.log(err);
    });  
    res.redirect('/profilegm') 
})


app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profilegm');
  }
);

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

app.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profilefb');
  }
);


app.get('/', (req, res) => res.render('index'));
app.get('/failed', (req, res) => res.send('You Failed to log in!'));

module.exports = app

app.listen(3000,() => {
    console.log("App is listening on Port 3000")
})

