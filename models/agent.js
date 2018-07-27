var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
let config = require('config');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(config.DBHost)
autoIncrement.initialize(connection);

var agentSchema = mongoose.Schema({
  firstName:{ type: String,trim: true,require:true,default:'' },
  lastName:{ type: String,trim: true,require:true,default:'' },  	
  phoneNumber: { type: Number, unique: true, lowercase: true, trim: true },
  email:String,
  password: { type: String,trim:true},    
  flatNoBuidlingName:{ type: String,trim: true,require:true,default:'' },
  streetName:{ type: String,trim: true,require:true,default:'' },
  area:{ type: String,trim: true,require:true,default:'' },
  landmark:{ type: String,trim: true,require:true,default:'' },
  pincode:{ type: Number,trim: true,require:true},
  city:{ type: String,trim: true,require:true,default:'' },
  state:{ type: String,trim: true,require:true,default:'' },    
  aadharNumber:{ type: Number,trim: true,require:true},
  panNumber:{ type: String,trim: true},
  profilePic: {type:String},  
  quantityCapacity:{type:Number},
  role:{type:String},
  milkType:{type:String},
  availabilityStatus:{type:String},
  });

// Omit the password when returning a user
agentSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

agentSchema.plugin(autoIncrement.plugin, { model: 'Agent', field: 'agentId' });


module.exports = mongoose.model('Agent', agentSchema);