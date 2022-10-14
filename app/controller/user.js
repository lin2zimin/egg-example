'use strict';
const getDecode = require('../utils/decode');
const Controller = require('egg').Controller;
const defaultAvatar =
  'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
class UserController extends Controller {
  // 查找user
  async getUsers() {
    const { ctx } = this;
    const info = await ctx.service.user.getUsers();
    if (info) {
      ctx.body = info;
    } else {
      ctx.body = 'NO DATA';
    }
  }
  // 登录请求
  async register() {
    const { ctx } = this;
    const { userName, pwd } = ctx.request.body;
    if (!userName || !pwd) {
      ctx.body = {
        code: 400,
        msg: 'userName || pwd missing',
        data: null,
      };
      return;
    }
    const userInfo = await ctx.service.user.checkExistByName(userName);
    if (userInfo && userInfo.userName) {
      ctx.body = {
        code: 402,
        msg: '该用户名已被注册，请重新输入',
        data: null,
      };
      return;
    }
    const res = await ctx.service.user.register({
      userName,
      pwd,
      createTime: this.app.mysql.literals.now,
      signature: '世界和平',
      avatar: defaultAvatar,
    });
    if (res) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }

  async login() {
    const { ctx, app } = this;
    const { userName, pwd } = ctx.request.body;
    console.log(userName);
    const userInfo = await ctx.service.user.getUserByName(userName);
    console.log(userInfo);
    // 拿到的账号在数据库找不到
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 400,
        msg: '账号不存在',
        data: 'null',
      };
      return;
    }
    //
    if (userInfo && userInfo.pwd !== pwd) {
      ctx.body = {
        code: 403,
        msg: '账号密码错误',
        data: 'null',
      };
      return;
    }
    // 账号存在并且密码正确后 用jwt方法 生成一个token
    // id和userName经过加密后写入这个token
    // 以后每次请求通过中间件验证token有效性
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        userName: userInfo.userName,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token 有效期为 24 小时
      },
      app.config.jwt.secret
    );
    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: { token },
    };
  }

  async test() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: 'token获取成功',
      data: {
        ...decode,
      },
    };
    console.log('doing controller !!!!!!');
  }
  async getUserInfo() {
    const { ctx, app } = this;
    // 客户端请求中解析出token
    // 解码Token拿出 请求中的用户名等信息
    const decode = getDecode(ctx, app);
    // 用token中的用户名去数据库查找到完整的用户信息
    try {

      const userInfo = await ctx.service.user.getUserByName(decode.userName);
      const { id, userName, signature, avatar,nickName } = userInfo;
      ctx.body = {
        code: 200,
        msg: '用户信息请求成功',
        data: {
          id,
          userName,
          signature: signature || '',
          avatar: avatar || defaultAvatar,
          nickName
        },
      };
    } catch (error) {
      console.log('TMD就是service 查这一步出问题了撒');
      ctx.body = {
        code: 500,
        msg: '用户查询出问题',
        data: null,
      };
    }
  }
  async editUserInfo() {
    const { ctx, app } = this;
    // 默认值为 ‘ ’
    const { signature = '', avatar = '', nickName='' } = ctx.request.body;
    // 这里res 是一个 mysql update函数返回的一个变更信息对象
    const decode = getDecode(ctx, app);
    // 从token中拿出id 进行匹配
    const { userName } = decode;

    const userInfo = await ctx.service.user.getUserByName(userName);
    console.log(userInfo , nickName)
    await ctx.service.user.editUserInfo({
      ...userInfo,
      signature,
      avatar,
      nickName,
    });
    ctx.body = {
      code: 200,
      msg: '用户信息变更成功',
      data: 'success',
    };
  }
}

module.exports = UserController;
