var mongoose = require('mongoose');
let config = require('config');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(config.DBHost)
autoIncrement.initialize(connection);

var DiscountCodesSchema = mongoose.Schema({
  code: { type: String, require: true, unique: true },
  amount: { type: Number, required: true },  	
  expireDate: { type: String, require: true, default: ''},
  isActive: { type: Boolean, require: true, default: true },
  userIds:[{type: Number}],
  created_at: { type: Date },
  updated_at: { type: Date }
  });

DiscountCodesSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
    this.created_at = currentDate;
    }
    next();
});

DiscountCodesSchema.plugin(autoIncrement.plugin, { model: 'Coupon', field: 'couponId' });


module.exports = mongoose.model('Coupon', DiscountCodesSchema);