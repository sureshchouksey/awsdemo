

let dotenv = require('dotenv');
let jwt = require('jsonwebtoken');
let User = require('../models/user');
let Rates = require('../models/rates');
let config = require('config');
let mongoose = require('mongoose');
let Nexmo = require('nexmo');

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
        res.status(200).json({status:'success',role:user.role});
  })
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
      res.json({'status':'success'});
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
      if (err) { return res.json({status:'fail'});; }
      res.status(200).json({status:'success'});
    });
  }

  // Update by id
  exports.updatePIN = (req, res) => {
    console.log(req.body);
    User.update({ phoneNumber: req.body.phoneNumber}, {$set:{password:req.body.mPin}}, (err) => {
      if (err) { return res.json({status:'fail'});; }
      res.status(200).json({status:'success'});
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
  exports.insertRates = (req, res) => {
    const obj = new Rates(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      console.log('item',item);
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.json({'status':'success'});
    });
  }

  // Get by id
  exports.getRates = (req, res) => {    
    Rates.findOne({}, (err, obj) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
  }

  exports.deleteRates = (req, res) => {    
    Rates.remove({}, (err) => {
      if (err) { return loggererror.info(err); }      
      res.sendStatus(200);
    })
  }

  // Update by id
  exports.updateRates = (req, res) => {
    Rates.findOneAndUpdate({ masterKey: req.body.masterKey }, req.body, (err) => {
      if (err) { return res.json({status:'fail'});; }
      res.status(200).json({status:'success'});
    });
  }


  // Update by id
  exports.changePassword = (req, res) => {
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

