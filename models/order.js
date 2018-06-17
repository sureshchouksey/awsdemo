var mongoose = require('mongoose');
let config = require('config');
var autoIncrement = require('mongoose-auto-increment');

var orderSchema = mongoose.Schema({
  totalPrice:{ type: Number,require:true},
  totalQuantity:{ type: Number,require:true},
  forDays:{ type: Number,require:true},
  fromDate:{ type: String,trim: true},  	
  toDate:{ type: String,trim: true},  	
  milkType:{ type: String,trim: true},  	
  milkArivalTime:{ type: String,trim: true},
});

orderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'orderId' });

module.exports = mongoose.model('Order', orderSchema);