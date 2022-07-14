'use strict';
module.exports = () => {
  return async function testMiddle(ctx, next) {
    console.log('我已起飞，感觉良好');
    await next();
    console.log('第二飞行员飞行完毕');
  };
};
