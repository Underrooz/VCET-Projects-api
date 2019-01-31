const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth.js');

//  const storage = multer.diskStorage({
//    destination: function(req, file, cb) {
//      cb(null,'./uploads/'); 
//    },
//    filename:function(req, file, cb){
//      cb(null, Date.now()+file.originalname)
//    }
//  });

//  const filefilter=function(req, file, cb){
//    if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
//      cb(null, true);
//    }
//    else {
//      cb(null, false);
//    }
//  }

//  const upload = multer({
//    storage:storage,
//    limits:{
//      fileSize: 1024*1024*5
//    },
//    fileFilter: filefilter
//  });

const Project = require('../models/project');

router.get('/', (req, res, next)=>{
  Project.find().exec()
  .then(data=>{
    if(data.length<=0){
      return res.status(200).json({
        success:true, 
        message:"no docs found",
        data:{},
        count:"0"
      });
    }else{
      const _data = { 
        success:true,
        count:data.length,
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
//upload.single('projectImage')

router.post('/', checkAuth, (req, res, next)=>{
      
  const project = new Project({
    _id: new mongoose.Types.ObjectId(),
    collegeId: req.body.user,
    projectName: req.body.projectName,
    teamMembers: req.body.teamMembers,
    dept: req.body.dept,
    abstract: req.body.abstract,
    // projectImage: req.file.path,
    //document: req.body.document,
    contact: req.body.contact
  });
  project.save()
    .then(doc=>{
      res.status(200).json({
        message: "uploaded",
        success: true
      });
    })
  .catch(err=>{console.log(err)
    console.log(err);
    res.status(500).json({error: err});
  });
});

router.get('/:dept', (req, res, next)=>{
  const _dept=req.params.dept;
  Project.find({dept:_dept})
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
        success:true,
        data
      };
      res.status(200).json(_data);
    }
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json({error: err});
  });
});

router.patch('/:projectId', checkAuth, (req, res, next)=>{
  const id=req.params.projectId;
  const updateOps={};
  for(const ops of req.body){
    updateOps[ops.propName]=ops.value;
  }
  Project.update({_id:id},{$set:updateOps})
  .exec().then(result=>{
    console.log(result);
    res.status(200).json({
      success: true,
      message:"Operation Successful"
    });
  }).catch(err=>{
      console.log(err);
      res.status(200).json({
        success: false,
        error: "Operation Falied"
      });
  });
});

router.delete('/:projectId', checkAuth, (req, res, next)=>{
  const id=req.params.projectId;
  Project.remove({_id:id}).exec().then(result=>{
    res.status(200).json({
      success: true,
      message:"Operation Successful"
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

