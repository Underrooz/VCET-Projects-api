const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const projectRoutes = require('./api/routes/project');
const ideaRoutes = require('./api/routes/idea');
const userRoutes = require('./api/routes/user');
const indexRoutes = require('./api/routes/index');


mongoose.connect('mongodb://Tarun:'+ process.env.MONGO_ATLAS_PW +'@cluster0-shard-00-00-gwous.mongodb.net:27017,cluster0-shard-00-01-gwous.mongodb.net:27017,cluster0-shard-00-02-gwous.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
{
  useNewUrlParser: true
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use((req, res, next)=>{
//  res.header("Acess-Control-Allow-origin",'*');
//  res.header("Acess-Control-Allow-Headers","Origin, X-Requested-With, Context-Type, Authorization");
//  if (req.method === 'OPTIONS') {
//    res.header('Acess-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
//    return res.status(200).json({});
//  }
//});
//app.use('/', indexRoutes);
app.use('/projects', projectRoutes);
app.use('/ideas', ideaRoutes);
app.use('/user', userRoutes);


app.use((req, res, next)=>{
  const error = new Error('Not Found');
  error.status= 404;
  next(error);
});

app.use((error, req, res, next)=>{
  console.log(error);
  res.status(error.status || 500);
  res.json({
    error12: error.message
  });
});

module.exports = app;
