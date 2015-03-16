var mongoose = require('mongoose');


var roomSchema = mongoose.Schema({

        name        : String,
        number      : String,
        dateTime    : Date,
        building    : String,
        campus      : String,
        addressLine1: String,
        addressLine2: String,
        addressLine3: String,
        city        : String,
        county      : String,
        postCode    : String 

        /*firstname : String, 
        surname   : String, 
        dob       : Date, 
        team      : String, 
        department: String, 
        image     : String,
        permissions: String*/
        //qualifications: [Qualifications] 

});

module.exports.roomSchema = mongoose.model('Room', roomSchema);

