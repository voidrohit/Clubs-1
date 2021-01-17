const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new Schema({

    username:{
        type:String,
        required:true,
    },
    email:{
      type: "string",
      pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
    },
    password:{
      type:String,
      required:true,
    }

})
//UserSchema.plugin(passportLocalMongoose,{ usernameField : 'username' });

const User = mongoose.model('user', UserSchema);

module.exports = User;
