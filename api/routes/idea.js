const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Idea = require('../models/idea');
const checkAuth = require('../middleware/check-auth.js');

router.get('/', (req, res, next)=>{
  Idea.find().exec()
  .then(data=>{
    if(data.length<=0){
      return res.status(404).json({
        success:true, 
        message:"no docs found",
        data:{}
      });
    }else{
      const _data = { 
        success:true,
        data
      };
      res.status(200).json(_data);
    }
  }).catch(err=>{
    console.log(err); 
    res.status(500).json({
      error: err
    });
  });
});

router.get('/:author', (req, res, next)=>{
  const authorobj=req.params.author;
  Idea.find({author:authorobj}).select()
  .exec()
  .then(data=>{
    if(data.length<=0){
      return res.status(404).json({
        success:true, 
        message:"no docs found",
        data:{}
      });
    }else{
      const _data = {
        data, 
        success:true,  
        message: "Operation Succesful"
      };
      res.status(200).json(_data);
    }
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json({error: err});
  });
});

router.post('/', checkAuth, (req, res, next)=>{
  const idea = new Idea({
    _id: new mongoose.Types.ObjectId(),
    collegeId: req.body.user,
    author: req.body.author,
    name:req.body.name,
    abstract: req.body.abstract,
    document: req.body.document,
    contact: req.body.contact
  });
  idea
  .save()
  .then(result=>{
    console.log(result);
    res.status(200).json({
      message: "uploaded",
      success: true
    });
  })
  .catch(err=>{console.log(err)
    console.log(err);
    res.status(500).json({
      success: false,
      error: "Operation Falied"
    });
  });
});


router.patch('/:ideaId', checkAuth, (req, res, next)=>{
  const id=req.params.ideaId;
  const updateOps={};
  for(const ops of req.body){
    updateOps[ops.propName]=ops.value;
  }
  Idea.update({_id:id},{$set:updateOps})
  .exec().then(result=>{
    console.log(result);
    res.status(200).json({
      success: true,
      message:"Operation Successful!"
    });
  }).catch(err=>{
      console.log(err);
      res.status(200).json({
        success: false,
        error: "Operation Falied"
      });
  });
});

router.delete('/:ideaId', checkAuth, (req, res, next)=>{
  const id=req.params.ideaId;
  Idea.remove({_id:id}).exec().then(result=>{
    res.status(200).json({
      message:"Idea deleted!"
    });
  }).catch(err=> {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "Operation Falied"
    });
  });
});

module.exports = router;
