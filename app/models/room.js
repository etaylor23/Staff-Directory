var mongoose = require('mongoose');

var Bookings = mongoose.Schema({
    dateFrom        : Date,
    dateTo          : Date,
    bookingUserId   : String
})


var roomSchema = mongoose.Schema({

        name        : String,
        number      : String,
        bookings    : [Bookings],
        building    : String,
        campus      : String,
        addressLine1: String,
        addressLine2: String,
        addressLine3: String,
        city        : String,
        county      : String,
        postCode    : String 

});

module.exports.roomSchema = mongoose.model('Room', roomSchema);

