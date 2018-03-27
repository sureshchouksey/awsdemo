var userCtrl = require('../controllers/user');
let User =  require('../models/user');

module.exports = function (app) {
  app.route('/').get(userCtrl.home);
  app.route('/api/login').post(userCtrl.login);
  app.route('/api/adminLogin').post(userCtrl.adminLogin);
  app.route('/api/users').get(userCtrl.getAll);
  app.route('/api/updatePIN').put(userCtrl.updatePIN);
  app.route('/api/users/count').get(userCtrl.count);
  app.route('/api/user').post(userCtrl.insert);
  app.route('/api/user/:username').get(userCtrl.get);
  app.route('/api/user/:id').put(userCtrl.update);
  app.route('/api/user/:id').delete(userCtrl.delete);
  app.route('/api/user/search')
        .post(userCtrl.searchUser);
  app.route('/api/user/sendMessage')
        .post(userCtrl.sendMessage);        
  app.route('/api/user/changePassword')
        .post(userCtrl.changePassword);   

  app.route('/api/insertRates')
        .post(userCtrl.insertRates);
  app.route('/api/getRates').get(userCtrl.getRates);
  app.route('/api/deleteRates').delete(userCtrl.deleteRates);
  app.route('/api/updateRates').put(userCtrl.updateRates);
  
}
