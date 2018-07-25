var mongoose = require('mongoose');
let config = require('config');
var autoIncrement = require('mongoose-auto-increment');

var itemSchema = mongoose.Schema({  
  agentId:{ type: Number,require:true},
  agentName:{ type: String,trim: true},
  totalPrice:{ type: Number,require:true},
  totalQuantity:{ type: Number,require:true},
  forDays:{ type: Number,require:true},
  fromDate:{ type: String,trim: true},  	
  toDate:{ type: String,trim: true},
  orderDate:{ type: String,trim: true},  	
  milkType:{ type: String,trim: true},  	
  milkArivalTime:{ type: String,trim: true},
});

var orderSchema = mongoose.Schema({
  userId:{ type: Number,require:true},
  order:[itemSchema]
});
module.exports = mongoose.model('Order', orderSchema);