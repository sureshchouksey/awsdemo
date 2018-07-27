
let dotenv = require('dotenv');
let jwt = require('jsonwebtoken');
let User = require('../models/user');
let Agent = require('../models/agent');
let Order = require('../models/order');
let Rates = require('../models/rates');
let Coupon = require('../models/coupon');

let config = require('config');
let mongoose = require('mongoose');
let Nexmo = require('nexmo');
let cc = require('coupon-code');
var voucher_codes = require('voucher-code-generator');

var log4js = require('log4js'); // include log4js
//require('fs').mkdirSync('./log');
var logConfig = require('../config/log4js');

log4js.configure({
  appenders: {
    access: { type: 'dateFile', filename: 'log/access.log', pattern: '-yyyy-MM-dd' },
    app: { type: 'file', filename: 'log/gwala.log', maxLogSize: 10485760, numBackups: 3 },
    errorFile: { type: 'file', filename: 'log/errors.log' },
    errors: { type: 'logLevelFilter', level: 'error', appender: 'errorFile' }
  },
  categories: {
    default: { appenders: ['app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'info' }
  }
});


var loggerinfo = log4js.getLogger('info'); // initialize the var to use.
var loggererror = log4js.getLogger('error'); // initialize the var to use.
var loggerdebug = log4js.getLogger('debug'); // initialize the var to use.
if(logConfig.visible){
    loggerinfo.level = "OFF";
    loggererror.level = "OFF";
    loggerdebug.level = "OFF";    
}


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
   try{
      var phoneNumber = req.body.phoneNumber;
      var password = req.body.password;  
      User.findOne({phoneNumber:phoneNumber,password:password},(err,user)=>{
            if(err) return next(err);
          if(!user) return res.send('Not logged in!'); 
          res.json({code:200,role:user.role});

      })
   }
   catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get user Service Internal server error'});
    } 
}

exports.adminLogin = (req,res) =>{
  console.log(req.body);
  var email = req.body.username;
   var password = req.body.password;  
   console.log(email,password);
  User.findOne({email:email,password:password,role:"admin"},(err,user)=>{
         if(err) return next(err);
       if(!user) return res.send('Not logged in!'); 
        const token = jwt.sign({ user: user }, config.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        console.log(token);      
       let resultData = {
          username :user.firstName + "" + user.lastName,
          email:user.email,
          token :token
        }
        res.status(200).json(resultData);
  })
}

  // Get all
  exports.getAll = (req, res) => {
     try{
          User.find({}, (err, docs) => {
            if (err) { return console.error(err); }
            loggerinfo.info("Search result of getAll Service", docs);
            res.json({code:200,data:docs});
          });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get user Service Internal server error'});
    } 
  }

  // Count all
  exports.count = (req, res) => {
    try{
        User.count((err, count) => {
          if (err) { return console.error(err); }
          loggerinfo.info("Search result of count Service", count);
          res.json({code:200,data:count});
        });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get user Service Internal server error'});
    } 
  }

  // Insert
  exports.insert = (req, res) => {
     try{
        loggerinfo.info('Request body of Registration Service',req.body);
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
         
          if (err) {
             console.log('item',err);
             loggerinfo.error('Get user Service: Database server error',err);
             res.json({code:500,'status':'error','err':err});
          }
          else{
            res.json({'code':200,data:item});
          }
          
        });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get user Service Internal server error'});
    } 
  }

  // Get by id
  exports.get = (req, res) => {
     try{
        console.log(req.params.id);
        User.findOne({ username: req.params.username }, (err, obj) => {
          if (err) { return console.error(err); }
          loggerinfo.info("Search result of get Service", obj[0]);
          res.json(obj);
        });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
       res.json({code:500,err:err,message:'Get user Service Internal server error'});
    } 
  }

  // Get by id
  exports.home = (req, res) => {
    console.log(req.params.id);
    res.send('Welcome to server');
  }

 
 // Update by id
  exports.update = (req, res) => {
     try{
        loggerinfo.info('Request body of Registration Service',req.body);
        User.findOneAndUpdate({ _id: req.params.id }, req.body, (err,item) => {
          if (err) { return res.json({code:500,status:'fail'});; }
          loggerinfo.info('New device successfully register for FCM');
          res.json({code:200,data:item});
        });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get user Service Internal server error'});
    } 
  }

  // Update by id
  exports.updatePIN = (req, res) => {
     try{
        User.update({ phoneNumber: req.body.phoneNumber}, {$set:{password:req.body.mPin}}, (err) => {
          if (err) { return res.json({status:'fail'});; }
          res.status(200).json({status:'success'});
        });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
       res.json({code:500,err:err,message:'Get user Service Internal server error'});
    } 
  }

  // Delete by id
  exports.delete = (req, res) => {
    try{
      console.log( req.params.id );
      User.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.params.id) }, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
       res.json({code:500,err:err,message:'Get user Service Internal server error'});
    }
  }

exports.deleteAll = (req, res) => {
  try{
      loggerinfo.info('Request body of deleteAll Service',req.body);
      User.remove({}, (err) => {
        if (err) { return loggererror.info(err); }
        loggerinfo.info('All device sucessfully deleted!');
        console.log('All device sucessfully deleted!');
        res.sendStatus(200);
      })
  } 
  catch(err){
    loggerinfo.error('Get user Service: Internal server error',err);
    res.status(500).send(err);
  }
}

exports.searchUser = (req, res) => {
  try{
      //loggerinfo.info('Request body of searchUseer Service',req.body);
      let searchUseer = req.body;
      User.find(searchUseer, (err, docs) => {
        if (err) { return loggererror.info(err); }
        //loggerinfo.info('Search result based on device',docs);
        res.json({code:200,data:docs});
      });
  } 
  catch(err){
    loggerinfo.error('Get user Service: Internal server error',err);
    res.json({code:500,err:err,message:'Get user Service Internal server error'});
  }
}

exports.addOrder = (req,res) =>{
  
   try{
       var userId = req.body.userId;
       console.log(req.body);
       let query = { "userId": req.body.userId};
      Order.findOneAndUpdate({ "userId": req.body.userId}, {"$push": {order: req.body.item}}, { upsert: true }, (err) => {
        if (err) { return console.log(err); }
        console.log('add order');
        loggerinfo.info('add order');
        res.sendStatus(200);
      });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get user Service Internal server error'});
    }
}

exports.deleteOrder = (req, res) => {
    try{
      Order.remove({}, (err) => {
        if (err) { return loggererror.info(err); }      
        res.sendStatus(200);
      })
    } 
    catch(err){
      loggerinfo.error('Get Rates Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Rates Service Internal server error'});
    } 
  }



  exports.saveOrder = (req, res) => {
    console.log('saveOrder',req.body);
     try{
        const obj = new Order(req.body);
        console.log('obj',obj);
        obj.save((err, item) => {
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
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get user Service Internal server error'});
    }
  }

  // Get all
  exports.getAllOrders = (req, res) => {
     try{
          Order.find({}, (err, docs) => {
            if (err) { return console.error(err); }
            loggerinfo.info("Search result of getAll Service", docs);
            res.json(docs);
          });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get user Service Internal server error'});
    } 
  }

  exports.searchOrder = (req, res) => {
  try{
      //loggerinfo.info('Request body of searchUseer Service',req.body);
      let searchAgent = req.body;
      Order.find(searchAgent, (err, docs) => {
        if (err) { return loggererror.info(err); }
        //loggerinfo.info('Search result based on device',docs);
        res.json({code:200,data:docs});
      });
  } 
  catch(err){
    loggerinfo.error('Get Agent Service: Internal server error',err);
    res.json({code:500,err:err,message:'Get Agent Service Internal server error'});
  }
}


// Insert
  exports.insertRates = (req, res) => {
    try{
        const obj = new Rates(req.body);
        obj.save((err, item) => {
          
          console.log('item',item);
          if (err && err.code === 11000) {
            res.sendStatus(400);
          }
          if (err) {
            return console.error(err);
          }
          res.json({code:200,'status':'success',data:item});
        });
    } 
    catch(err){
      loggerinfo.error('Get Rates Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Rates Service Internal server error'});
    } 
  }

 // Get by id
  exports.getRates = (req, res) => {
    try{
        Rates.findOne({}, (err, obj) => {
          if (err) { return console.error(err); }
          res.json(obj);
        });
    } 
    catch(err){
      loggerinfo.error('Get Rates Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Rates Service Internal server error'});
    } 
  }

  exports.deleteRates = (req, res) => {
    try{
      Rates.remove({}, (err) => {
        if (err) { return loggererror.info(err); }      
        res.sendStatus(200);
      })
    } 
    catch(err){
      loggerinfo.error('Get Rates Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Rates Service Internal server error'});
    } 
  }

  // Update by id
  exports.updateRates = (req, res) => {
    try{
      Rates.findOneAndUpdate({ masterKey: req.body.masterKey }, req.body, (err) => {
        if (err) { return res.json({status:'fail'});; }
        res.status(200).json({status:'success'});
      });
    } 
    catch(err){
      loggerinfo.error('Get Rates Service: Internal server error',err);
     res.json({code:500,err:err,message:'Get Rates Service Internal server error'});
    } 

  }

  // Update by id
  exports.changePassword = (req, res) => {
    try{
      console.log('Body',req.body);
      User.findOne({phoneNumber: req.body.phoneNumber,password:req.body.oldPassword},(err,user)=>{
        console.log('user',user);
          if (err) {
            return res.json({status:'fail',err:err}); 
          }
          if(!user){
              return res.json({status:'password is wrong'});
          }
          else{
              User.update({ phoneNumber: req.body.phoneNumber}, {$set:{password:req.body.newPassword}}, (err) => {
                if (err) { 
                  return res.json({status:'Update fail'});
                }
                res.status(200).json({status:'success'});
              });
          }        
      });
    } 
    catch(err){
      loggerinfo.error('Get Rates Service: Internal server error',err);
      res.status(500).send(err);
    } 
        
    
  }


   // Insert
  exports.addAgent = (req, res) => {
     try{
        loggerinfo.info('Request body of Registration Service',req.body);        
        const obj = new Agent(req.body);
        obj.save((err, item) => {
          // 11000 is the code for duplicate key error
          console.log('item',item);         
          if (err) {
             console.log('item',err);
             loggerinfo.error('Get Agent Service: Database server error',err);
             res.json({code:500,'status':'error','err':err});
          }
          else{
            res.json({'code':200,data:item});
          }          
        });        
    } 
    catch(err){
      loggerinfo.error('Get Agent Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Agent Service Internal server error'});
    } 
  }

    // Insert
  exports.updateAgent = (req, res) => {
     try{
        loggerinfo.info('Request body of Registration Service',req.body);                       
        let query = { "agentId": req.body.agentId};
        Agent.findOneAndUpdate(query, req.body, { upsert: true }, (err) => {
          if (err) { return loggererror.info(err); }
          loggerinfo.info('New device successfully register for FCM');
          res.sendStatus(200);
        });
    } 
    catch(err){
      loggerinfo.error('Get Agent Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Agent Service Internal server error'});
    } 
  }

   // Delete by id
  exports.getAgentById = (req, res) => {
    try{
      console.log( req.params.id );
      Agent.find({ agentId: req.params.id}, (err,item) => {
        if (err) { return console.error(err); }
         res.json({'code':200,data:item});
      });
    } 
    catch(err){
      loggerinfo.error('Get user Service: Internal server error',err);
       res.json({code:500,err:err,message:'Get user Service Internal server error'});
    }
  }

  // Get all
  exports.getAllAgents = (req, res) => {
     try{
          Agent.find({}, (err, docs) => {
            if (err) { return console.error(err); }
            loggerinfo.info("Search result of getAllAgents Service", docs);
            res.json({code:200,data:docs});
          });
    } 
    catch(err){
      loggerinfo.error('Get Agent Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Agent Service Internal server error'});
    } 
  }

  exports.searchAgent = (req, res) => {
  try{
      //loggerinfo.info('Request body of searchUseer Service',req.body);
      let searchAgent = req.body;
      Agent.find(searchAgent, (err, docs) => {
        if (err) { return loggererror.info(err); }
        //loggerinfo.info('Search result based on device',docs);
        res.json({code:200,data:docs});
      });
  } 
  catch(err){
    loggerinfo.error('Get Agent Service: Internal server error',err);
    res.json({code:500,err:err,message:'Get Agent Service Internal server error'});
  }
}

 exports.deleteAgent = (req, res) => {
    try{
      Agent.remove({}, (err) => {
        if (err) { return loggererror.info(err); }      
        res.sendStatus(200);
      })
    } 
    catch(err){
      loggerinfo.error('Get Agent Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Agent Service Internal server error'});
    } 
  }

exports.addCoupon = (req, res) => {
     try{
        loggerinfo.info('Request body of Registration Service',req.body);        
        const obj = new Coupon(req.body);
        obj.save((err, item) => {
          // 11000 is the code for duplicate key error
          console.log('item',item);
         
          if (err) {
             console.log('item',err);
             loggerinfo.error('Get Coupon Service: Database server error',err);
             res.json({code:500,'status':'error','err':err});
          }
          else{
            res.json({'code':200,data:item});
          }
          
        });
    } 
    catch(err){
      loggerinfo.error('Get Coupon Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Coupon Service Internal server error'});
    } 
  }

  exports.deleteCoupons = (req, res) => {
    try{
      Coupon.remove({}, (err) => {
        if (err) { return loggererror.info(err); }      
        res.sendStatus(200);
      })
    } 
    catch(err){
      loggerinfo.error('Get Coupon Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Coupon Service Internal server error'});
    } 
  }

  // Get all
  exports.getAllCoupons = (req, res) => {
     try{
          Coupon.find({}, (err, docs) => {
            if (err) { return console.error(err); }
            loggerinfo.info("Search result of getAllCoupons Service", docs);
            res.json({code:200,data:docs});
          });
    } 
    catch(err){
      loggerinfo.error('Get Coupon Service: Internal server error',err);
      res.json({code:500,err:err,message:'Get Coupon Service Internal server error'});
    } 
  }




