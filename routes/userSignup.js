// require('dotenv').config();
// const express = require ('express');
// const app = express();
// app.use(express.static("public"));
// const router = express.Router();
// const User = require('../models/userSignup');
// const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
//
// //router.set('view engine','ejs');
//
//
// const mailgun = require("mailgun-js");
// const DOMAIN = 'sandbox1062316fb8e94d448142cea4ddc64b67.mailgun.org';
//
// const mg = mailgun({apiKey:process.env.API_KEY, domain: DOMAIN});
//
// router.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
// }))
//
// router.use(passport.initialize());
// router.use(passport.session());
//
// // passport.use('signup', new LocalStrategy({
// //   passReqToCallback : true,
// // },
// // function(req, username, password, done) {
// //   findOrCreateUser = function(){
// //     User.findOne({'username': username},function(err, user) {
// //       if (err){
// //         console.log('Error in SignUp: '+err);
// //         return done(err);
// //       }
// //       if (user) {
// //         console.log('User already exists');
// //         return done(null, false,
// //            req.flash('message','User Already Exists'));
// //       } else {
// //         const newUser = new User();
// //         newUser.username = req.body.fname,
// //         newUser.email = req.body.email,
// //         console.log("Hello");
// //         newUser.save(function(err) {
// //           if (err){
// //             console.log('Error in Saving user: '+err);
// //             throw err;
// //           }
// //           console.log('User Registration succesful');
// //           return done(null, newUser);
// //         });
// //       }
// //     });
// //   };
// //   process.nextTick(findOrCreateUser);
// // })
// // )
//
//
//
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//
//
//
// router.post('/signup', (req, res, next) => {
//
//   User.findOne({'username': req.body.fname},function(err, user) {
//         if (err){
//           console.log('Error in SignUp: '+err);
//           return done(err);
//         }
//         if (user) {
//           console.log('User already exists');
//           return done(null, false,
//              req.flash('message','User Already Exists'));
//         }
//         else{
//           console.log("Hello");
//
//                 const name = req.body.fname;
//                 const email = req.body.email;
//                 const password = req.body.password;
//
//                 var token = jwt.sign({name,email,password},process.env.JWT_ACCOUNT_ACTIVATE,{expiresIn:'20m'})
//                 const data = {
//           	     from:'noreply@nitp.ac.in',
//           	     to:req.body.email,
//           	     subject: 'Account Activation link',
//           	     html:`<p>please click on the link</p>
//                  Link to <a href="http://localhost:5000/user/${token}">${token}</a>`
//                 };
//                 mg.messages().send(data, function (error, body) {
//                   if(error){
//                     console.log(error);
//
//                   }else{
//                     return res.json({message:'Email has been send Please Activate your account'});
//                   }
//
//                 });
//
//             }
//           })
//
//     })
//
//
// router.get('/:token',(req,res,next)=>{
//   const token = req.params.token;
//
//   if(token){
//     jwt.verify(token,process.env.JWT_ACCOUNT_ACTIVATE,function(err,decodedToken){
//       if(err){
//         return res.status(400).json({error:"Incorrect or Expired link"});
//       }
//       else{
//
//         const {name,email,password} = decodedToken;
//
//         User.register(
//         {
//           username: name,
//           email: email,
//         },
//         password, (err, user) => {
//         if(err) {
//           console.log(err);
//           res.statusCode = 500;
//           res.setHeader('Content-Type', 'application/json');
//           res.json({err: err});
//         }
//         else {
//             passport.authenticate('local')(req, res, () => {
//             res.render("index");
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json({success: true, status: 'Registration Successful!'});
//
//           //  res.render("../views/index");
//         })
//       }
//         });
//       }
//
//     })
//   }else{
//     return res.json({error:"Something went wrong"});
//   }
//
// })
//
//
//
//
// router.post('/login',(req,res,next)=>{
//   const user = new User({
//     username : req.body.fname,
//     password : req.body.password,
//   });
//
//   req.login(user,function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       passport.authenticate('local')(req, res, () => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json({success: true, status: 'login Successful!'});
//       });
//     }
//   })
// })
//
//
//
//
//
// module.exports = router;
