const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth.js');


router.post('/signup',(req, res, next)=>{
  User.find({collegeId:req.body.collegeId}).exec()
  .then(user=>{
    //check if id exists
    if(user.length>=1){
      return res.status(200).json({
        message:'College Id exists!',
        success: false
      });
    }
    if(req.body.password!==req.body.password1){
      return res.json({
        message:'passwords do not match',
        success: false
      });
    }
     //hashing password
      bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err){
          console.log(err);
          return res.status(500).json({
            error: err
          });
        }else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            collegeId: req.body.collegeId,
            password: hash
           
          });
          user.save().then(result=>{
            console.log(result);
            res.status(201).json({
              message: 'Welcome!',
              success: true
            });
          }).catch(err=>{
            console.log(err);
            res.status(500).json({
              error1: err
            });
          });
        }
      });
  });
});

router.post('/login',(req, res, next)=>{
  
  User.find({collegeId:req.body.collegeId}).exec().then(user=>{
    if(user.length<1){
      return res.status(200).json({
        message: "Incorrect Details",
        success: false
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
     
      
      if (err) {
        return res.status(200).json({
          message:'Incorrect Details',
          success: false
        });
      }
      if (result) {
        const token = jwt.sign({
          collegeId: user[0].collegeId,
          userId:user[0]._id
        }
        ,process.env.JWT_KEY,
        {
          expiresIn:"1h"
        });
        return res.status(200).json({
          message:'LogIn Successful',
          success: true,
          data:{
            token: token,
            
          }
        });
      }
      res.status(200).json({
        message: 'Authentication Failed',

      });
    });
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.delete('/:collegeId', checkAuth ,(req, res, next)=>{
  User.remove({collegeId:req.params.collegeId}).exec().then(result=>{
    res.status(200).json({
      message:"collegeId deleted!"
    });
  }).catch(err=> {

    res.status(500).json({error: err});
  });
});

module.exports = router;
