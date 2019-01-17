const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/signup',(req, res, next)=>{
  console.log(req.body.collegeId);
  User.find({collegeId:req.body.collegeId}).exec()
  .then(user=>{
    console.log(user.length);
    //check if id exists
    if(user.length>=1){
      return res.status(409).json({
        message:'College Id exists!',
        success: false
      });
    }else {
      //hashing password
      bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err){
          console.log(err);
          return res.status(500).json({
            error1: err
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
              mesage: 'user created',
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
    }
  });
});

router.post('/login',(req, res, next)=>{
  User.find({collegeId:req.body.collegeId}).exec().then(user=>{
    if(user.length<1){
      return res.status(401).json({
        message: "Authentication Failed",
        success: false
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
      if (err) {
        return res.status(401).json({
          message:'Authentication Failed',
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
        return res.status(401).json({
          message:'LogIn Successful',
          success: true,
          data:{token: token}
        });
      }
      res.status(401).json({
        message: 'auth failed',

      });
    });
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.delete('/:collegeId', (req, res, next)=>{
  User.remove({collegeId:req.params.collegeId}).exec().then(result=>{
    res.status(200).json({
      message:"collegeId deleted!"
    });
  }).catch(err=> {

    res.status(500).json({error: err});
  });
});

module.exports = router;
