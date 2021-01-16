const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new Schema({

    username:{
        type:String,
    },
    email:{
        type:String,
    },

})
UserSchema.plugin(passportLocalMongoose,{ usernameField : 'username' });

const User = mongoose.model('user', UserSchema);

module.exports = User;
