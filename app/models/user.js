// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Qualifications = mongoose.Schema(
    {
      qualification: {
        level:String,
        name : Array
      }
    }
);

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    details          : {
        firstname : String, 
        surname   : String, 
        dob       : Date, 
        team      : String, 
        department: String, 
        image     : String,
        permissions: String,
        qualifications: [Qualifications] 
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports.user = mongoose.model('User', userSchema);
module.exports.qualification = mongoose.model('Qualification', Qualifications);


