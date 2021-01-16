
require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./models/userSignup');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const userRouter = require("./routes/userSignup");
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox1062316fb8e94d448142cea4ddc64b67.mailgun.org';

const mg = mailgun({apiKey: process.env.API_KEY, domain: DOMAIN});
app.set('view engine','ejs');
app.use(express.static("Public"));

//mongoose.connect("mongodb+srv://admin-vishal:Vishal@2611@cluster0-cujjf.mongodb.net/blogDB",{useNewUrlParser :true});
mongoose.connect('mongodb+srv://rishak192:Mongodb@192@firstproject.8maq4.mongodb.net/ClubsDB?retryWrites=true&w=majority',{useNewUrlParser :true,useUnifiedTopology: true});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());



///home route
let Event = "";

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


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.post('/signup', (req, res, next) => {

  User.findOne({'username': req.body.fname},function(err, user) {
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        if (user) {
          console.log('User already exists');
          return done(null, false,
             req.flash('message','User Already Exists'));
        }
        else{
          console.log("Hello");

                const name = req.body.fname;
                const email = req.body.email;
                const password = req.body.password;

                var token = jwt.sign({name,email,password},process.env.JWT_ACCOUNT_ACTIVATE,{expiresIn:'20m'})
                const data = {
          	     from:'noreply@nitp.ac.in',
          	     to:req.body.email,
          	     subject: 'Account Activation link',
          	     html:`<p>please click on the link</p>
                 Link to <a href="http://localhost:5000/${token}">${token}</a>`
                };
                mg.messages().send(data, function (error, body) {
                  if(error){
                    console.log(error);

                  }else{
                    return res.json({message:'Email has been send Please Activate your account'});
                  }

                });

            }
          })

    })


app.get('/:token',(req,res,next)=>{
  const token = req.params.token;

  if(token){
    jwt.verify(token,process.env.JWT_ACCOUNT_ACTIVATE,function(err,decodedToken){
      if(err){
        return res.status(400).json({error:"Incorrect or Expired link"});
      }
      else{

        const {name,email,password} = decodedToken;

        User.register(
        {
          username: name,
          email: email,
        },
        password, (err, user) => {
        if(err) {
          console.log(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }
        else {
          console.log("jgufuyf");
            passport.authenticate('local')(req, res, () => {
              Club.find({},function(err,foundEvent){
                if (err){
                  console.log(err);
                }
                else{
                  console.log(foundEvent);
                  res.render("home",{Event :foundEvent});
                }
              })
            // res.statusCode = 200;
            // res.setHeader('Content-Type', 'application/json');
            // res.json({success: true, status: 'Registration Successful!'});
        })
      }
        });
      }

    })
  }else{
    return res.json({error:"Something went wrong"});
  }

})




app.post('/login',(req,res,next)=>{
  const user = new User({
    username : req.body.fname,
    password : req.body.password,
  });

  req.login(user,function(err){
    if(err){
      console.log(err);
    }
    else{
      passport.authenticate('local')(req, res, () => {

        console.log(req.body);


        if(req.isAuthenticated()){
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
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json({success: true, status: 'login Successful!'});
      });
    }
  })
})


app.get('/',function(req,res){
  Club.find({},function(err,foundEvent){
    if (err){
      console.log(err);
    }
    else{
      console.log(foundEvent);
      res.render("home",{Event :foundEvent});
    }
  })
})


app.post("/delete",function(req,res){

  var ClubName = "";
  console.log(req.body.checkbox);

  Club.find({"_id":req.body.checkbox}, function (err, foundItem) {
    if (err) {
        console.log(err);
    }else{
      console.log(foundItem);
      ClubName = foundItem[0].name;
      console.log(ClubName);
      Club.remove({"_id": foundItem._id});
    }
  })

console.log(ClubName);

  Club.find({name : ClubName},function(err,foundEvent){
  if (err){
    console.log(err);
  }
  else{
    console.log(foundEvent);
    res.render("index",{Event :foundEvent,Name :ClubName});
  }
  })

})

// app.get('/results',function(req,res){
//   Club.find({},function(err,foundEvent){
//     if (err){
//       console.log(err);
//     }
//     else{
//       console.log(foundEvent);
//       res.render("index",{Event :foundEvent});
//     }
//   })
// })

app.post('/',function(req,res){

  console.log(req.body);
  const clubinfo = new Club({
    name: req.body.ClubName,
    event: req.body.event,
    date: req.body.Date,
  });

  clubinfo.save();
  Club.find({name : req.body.ClubName},function(err,foundEvent){
    if (err){
      console.log(err);
    }
    else{
      console.log(foundEvent);
      res.render("index",{Event :foundEvent,Name : req.body.ClubName});
    }
  })
  //res.redirect('/results');
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server listening on ${PORT}`));


















// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
//
//
// mongoose.connect('mongodb://localhost/ClubsDB',{useNewUrlParser :true,useUnifiedTopology: true});
//
// let Event = "";
//
// const clubsSchema =  new Schema({
//   name:{
//         type:String,
//   },
//   event:{
//         type:String,
//   },
//   date:{
//         type:String,
//   }
// });
// const Club = mongoose.model('club',clubsSchema);
//
//
// app.set('view engine','ejs');
//
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static("public"));
//
//
// app.get('/',function(req,res){
//   res.render("home");
// })
//
// app.get('/results',function(req,res){
//   Club.find({},function(err,foundEvent){
//     if (err){
//       console.log(err);
//     }
//     else{
//       console.log(foundEvent);
//       res.render("results",{Event :foundEvent});
//     }
//   })
// })
//
// app.post('/',function(req,res){
//   const clubinfo = new Club({
//     name: req.body.ClubName,
//     event: req.body.event,
//     date: req.body.Date,
//   });
//
//   clubinfo.save();
//   res.redirect('/results');
// })
//
//
//
// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 5000;
// }
// app.listen(port,function(){
//   console.log("server is running on 5000 port");
// })
