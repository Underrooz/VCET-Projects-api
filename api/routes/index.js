const express = require('express');
const router = express.Router();

router.get('/', ()=>{ 
  res.render('../../views/index') ;
}); 