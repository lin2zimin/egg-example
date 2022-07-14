'use strict';
// 请求接口前，先执行这个中间件函数
// 判断当前有无token，token是否有效，
module.exports = secret => {
  return async function jwtErr(ctx, next) {
    // 先拿到token
    const token = ctx.request.header.authorization;
    let decode;
    // 判断token是否存在
    if (token && token !== 'null') {
      try {
        decode = ctx.app.jwt.verify(token, secret);
        // next（） 跳到下一个中间件，执行完再回来
        console.log('decode11111111111', decode);
        await next();
      } catch (error) {
        console.log('error', error);
        ctx.status = 200;
        ctx.body = {
          msg: 'token already expired, please log in',
          code: 402,
        };
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token does not exist',
      };
      return;
    }
  };
};
