var mongoose = require('mongoose');

var rateSchema = mongoose.Schema({
	masterKey:{type:String},
	cowMilkRate:{type:Number},
	buffaloMilkRate:{type:Number},
	deliveryCharge:{type:Number}
});

module.exports = mongoose.model('Rates', rateSchema);