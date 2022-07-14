'use strict';

function getDecode(ctx, app) {
  const token = ctx.request.header.authorization;
  const decode = app.jwt.verify(token, app.config.jwt.secret);
  if (!decode) {
    ctx.body = {
      code: 401,
      msg: 'Token invalid, please login ',
    };
    return;
  }
  return decode;
}

module.exports = getDecode;
