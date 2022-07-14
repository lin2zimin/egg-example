'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  // 所有需要验证token的请求，第二个参数传入-jwt这个函数
  const _jwt = middleware.jwtErr(app.config.secret);
  // const _test = middleware.testMiddle();
  router.post('/api/user/register', controller.user.register);
  router.get('/api/user/getUsers', controller.user.getUsers);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/test', _jwt, controller.user.test);
  router.get('/api/user/userInfo', _jwt, controller.user.getUserInfo);
  router.post('/api/user/editUserInfo', _jwt, controller.user.editUserInfo);
  router.post('/api/upload', controller.upload.upload);
  router.post('/api/bill/add', _jwt, controller.bill.add);
  router.get('/api/bill/list', _jwt, controller.bill.list);
  router.get('/api/bill/detail', _jwt, controller.bill.detail);
  router.post('/api/bill/update', _jwt, controller.bill.update);
  router.post('/api/bill/delete', _jwt, controller.bill.delete);
  router.post('/api/bill/data', _jwt, controller.bill.data);
};
