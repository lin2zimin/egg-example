'use strict';

/** @type Egg.EggPlugin */
// 插件管理
module.exports = {
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
