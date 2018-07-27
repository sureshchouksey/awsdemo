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

      app.route('/api/user/saveOrder')
        .post(userCtrl.saveOrder);
        
      app.route('/api/user/addOrder')
        .post(userCtrl.addOrder);
      app.route('/api/orders').get(userCtrl.getAllOrders);

      app.route('/api/deleteOrder').delete(userCtrl.deleteOrder);

      app.route('/api/user/searchOrder')
        .post(userCtrl.searchOrder);
        
      app.route('/api/user/deleteAll').delete(userCtrl.deleteAll);
 
      app.route('/api/user/changePassword')
        .post(userCtrl.changePassword);   

      app.route('/api/insertRates')
        .post(userCtrl.insertRates);
      app.route('/api/getRates').get(userCtrl.getRates);
      app.route('/api/deleteRates').delete(userCtrl.deleteRates);
      app.route('/api/updateRates').put(userCtrl.updateRates);

      app.route('/api/agent/addAgent')
        .post(userCtrl.addAgent);
      app.route('/api/agent/updateAgent')
        .put(userCtrl.updateAgent);
      app.route('/api/agent/getAllAgents').get(userCtrl.getAllAgents);
      app.route('/api/agent/getAgentById/:id').get(userCtrl.getAgentById);
      app.route('/api/agent/deleteAgent').delete(userCtrl.deleteAgent);      
      app.route('/api/agent/search')
        .post(userCtrl.searchAgent);

      app.route('/api/addCoupon')
        .post(userCtrl.addCoupon);
      app.route('/api/deleteCoupons').delete(userCtrl.deleteCoupons);
      app.route('/api/getAllCoupons').get(userCtrl.getAllCoupons);
      
  
}
