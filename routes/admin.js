const path = require('path');
const express = require('express');

 
const router = express.Router();
const db = require('../models/User');

router.get('/',(req,res,next) => {
    
     res.sendFile(path.join(__dirname,'../','views','profile.html'));     //__dirname searches in routes folder so ../ goes 1 level up
 });

router.post('/update',(req,res,next) => {
       let ob={
            'fname':req.body.fname,
            'lname':req.body.lname,
            'phno':req.body.phone,
            'email':req.body.email
       } 
       console.log(ob.fname)
       /*
       db.execute("update users set firstName='"+ob.fname+"'where email='loveu@gmail.com' ")
    .then(result => {
        console.log(result[0]);
    })
    .catch(err=> {
        console.log(err);
    });   
    res.redirect('/');
       */
   });

 
module.exports = router;