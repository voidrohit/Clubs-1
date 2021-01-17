require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./models/userSignup');
// const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();
app.use(bodyParser.urlencoded({extended: true}));


const DB_NAME = "clubs_testing"; // @note - later change it according to database used in production

const MONGO_DB_URI = `mongodb+srv://admin-vishal:${process.env.DB_PASSWORD}@cluster0-cujjf.mongodb.net/ClubsDB`; // @note - Don't modify this, if it doesn't work for you please ask


mongoose
  .connect(MONGO_DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    dbName: DB_NAME,
    w: "majority",
  })
  .catch((err) => {
    console.error(`Error in DB connection: mongo DB couldn't be reached`);
    console.error(err);
    exit(1);
  });

const db = mongoose.connection; //access to the pending connection
db.on("error", (err) => {
  console.log(`Error in DB connection`);
  console.error(err);
});
db.once("open", () => {
  console.log(`Connected to the database : ${DB_NAME}`);
});

app.set('view engine','ejs');
app.use(express.static("Public"));

const clubsSchema =  new Schema({
  name:{
        type:String,
  },
  event:{
        type:String,
  },
  date:{
        type:String,
  }
});
const Club = mongoose.model('club',clubsSchema);


let Event = "";

app.get('/',function(req,res){
  Club.find({},function(err,foundEvent){
    if (err){
      console.log(err);
    }
    else{
      res.render("home",{Event :foundEvent});
    }
  })
})



app.post('/signup', function(req, res){

    console.log(req.body.password);
      bcrypt.hash(req.body.password,saltRounds,function(err,hash){
      const user = new User({
        username : req.body.fname,
        email :req.body.email,
        password : hash,
      });
      user.save(function(err){
        if(err){
          console.log(err);
        }
        else{
          Club.find({"name":req.body.fname},function(err,foundEvent){
              if (err){
                  console.log(err);
              }
              else{
                  console.log(foundEvent);
                  res.render("index",{Event :foundEvent,Name : req.body.fname});
              }
          })
        }
    })
  })
})

app.post('/login',(req,res,next)=>{
    username = req.body.fname,
    password = req.body.password,

    User.find({"username": username},function(err,foundUser){
      if (err){
        return res.json({message:'Incorrect Email and Password'});
        console.log(err);
      }
      else{
          bcrypt.compare(password,foundUser[0].password,function(err,result){
            if(result === true){
              Club.find({"name":req.body.fname},function(err,foundEvent){
                if (err){
                  console.log(err);
                  res.render("home",{Event :foundEvent});
                }
                else{
                  res.render("index",{Event :foundEvent,Name : req.body.fname});
                }
              })
            }
            else{
              Club.find({},function(err,foundEvent){
                if (err){
                  console.log(err);
                }
                else{
                  console.log(foundEvent);
                  res.render("home",{Event :foundEvent});
                }
              })
            }
          })
      }
    });
})

//
app.post('/',function(req,res){

  console.log(req.body);
  const clubinfo = new Club({
    name: req.body.ClubName,
    event: req.body.event,
    date: req.body.Date,
  });

  clubinfo.save();
  //db.close();
  Club.find({name : req.body.ClubName},function(err,foundEvent){
    if (err){
      console.log(err);
    }
    else{
      res.render("index",{Event :foundEvent,Name : req.body.ClubName});
    }
  })
})

app.post("/delete",function(req,res){

  Club.deleteOne({"_id": req.body.checkbox}, function (err) {
    if(err) console.log(err);
    console.log("Successful deletion");
  });
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server listening on ${PORT}`));
