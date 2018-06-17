

let dotenv = require('dotenv');
let jwt = require('jsonwebtoken');
let User = require('../models/user');
let Order = require('../models/order');
let config = require('config');
let mongoose = require('mongoose');
let Nexmo = require('nexmo');
let cc = require('coupon-code');
var voucher_codes = require('voucher-code-generator');

let nexmo = new Nexmo({
  apiKey: '49f4ee41',
  apiSecret: 'wJ4rAleyPO5f0DUI'
})

exports.sendMessage = (req,res)=>{
  nexmo.message.sendSms(
  9561508019, req.body.phoneNumber, req.body.message,
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );
}



exports.login = (req,res) =>{
  var phoneNumber = req.body.phoneNumber;
   var password = req.body.password;  
  User.findOne({phoneNumber:phoneNumber,password:password},(err,user)=>{
         if(err) return next(err);
       if(!user) return res.send('Not logged in!');       
       res.json({'code':200,data:user});
  })
}

exports.adminLogin = (req,res) =>{
  var phoneNumber = req.body.phoneNumber;
   var password = req.body.password;  
  User.findOne({phoneNumber:phoneNumber,password:password,role:"admin"},(err,user)=>{
         if(err) return next(err);
       if(!user) return res.send('Not logged in!');       
       res.status(200).json({status:'success'});
  })
}



 // Get all
  exports.getAll = (req, res) => {
    User.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  }

  // Count all
  exports.count = (req, res) => {
    User.count((err, count) => {
      if (err) { return console.error(err); }
      res.json(count);
    });
  }

  // Insert
  exports.insert = (req, res) => {
    //var code = cc.generate();
    var codeList = voucher_codes.generate({
        length: 6,
        count: 1
    }); 
    //console.log('coupon code',code);
    req.body.couponCode = codeList[0];
    const obj = new User(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      console.log('item',item);
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.json({'code':200,data:item});
    });
  }

  // Get by id
  exports.home = (req, res) => {
    console.log(req.params.id);
    res.send('Welcome to server');
  }

  // Get by id
  exports.get = (req, res) => {
    console.log(req.params.id);
    User.findOne({ username: req.params.username }, (err, obj) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
  }

  // Update by id
  exports.update = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  // Update by id
  exports.updatePIN = (req, res) => {
    User.update({ phoneNumber: req.body.phoneNumber}, {$set:{password:req.body.mPin}}, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  // Delete by id
  exports.delete = (req, res) => {
    console.log( req.params.id );
    User.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.params.id) }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  exports.deleteAll = (req, res) => {
  loggerinfo.info('Request body of deleteAll Service',req.body);
  User.remove({}, (err) => {
    if (err) { return loggererror.info(err); }
    loggerinfo.info('All device sucessfully deleted!');
    res.sendStatus(200);
  })
}

exports.searchUser = (req, res) => {
  //loggerinfo.info('Request body of searchUseer Service',req.body);
  let searchUseer = req.body;
  User.find(searchUseer, (err, docs) => {
    if (err) { return loggererror.info(err); }
    //loggerinfo.info('Search result based on device',docs);
    res.json(docs);
  });
}

// Insert
  exports.saveOrder = (req, res) => {
 
    const obj = new Order(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      console.log('item',item);
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.json({'statusCode':200,'message':'Order save successfully',data:item});
    });
  }

   // Get all
  exports.getAllOrders = (req, res) => {
    Order.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  }
