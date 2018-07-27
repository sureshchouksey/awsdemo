var mongoose = require('mongoose');
let config = require('config');
var autoIncrement = require('mongoose-auto-increment');

var orderSchema = mongoose.Schema({
  userId:{ type: Number,require:true},
  userName:{ type: String,trim: true},
  userContactNumber:{ type: Number,require:true},
  agentId:{ type: Number,require:true},
  agentName:{ type: String,trim: true},
  agentContactNumber:{ type: Number,require:true},
  totalPrice:{ type: Number,require:true},
  totalQuantity:{ type: Number,require:true},
  forDays:{ type: Number,require:true},
  pinCode:{ type: Number,require:true},
  fromDate:{ type: String,trim: true},  	
  toDate:{ type: String,trim: true},
  orderDate:{ type: String,trim: true},  	
  milkType:{ type: String,trim: true},  	
  milkArivalTime:{ type: String,trim: true},
  area:{ type: String,trim: true},
  couponCode:{ type: String,trim: true},  
  deliveryStatusByUser:{ type: String,trim: true},
  deliveryStatusByAgent:{ type: String,trim: true},
});

orderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'orderId' });
module.exports = mongoose.model('Order', orderSchema);