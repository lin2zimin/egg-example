'use strict';

const Controller = require('egg').Controller;

// class HomeController extends Controller {
//   async index() {
//     const { ctx } = this;
//     // const { id } = ctx.query;
//     // ctx.body = id;
//     await ctx.render('index.html', {
//       title: 'i  am  lin',
//     });
//   }
//   async user() {
//     const { ctx } = this;
//     const result = await ctx.service.home.user();
//     ctx.body = result;
//   }
//   async add() {
//     const { ctx } = this;
//     const { title } = ctx.request.body;
//     ctx.body = {
//       title,
//     };
//   }
//   async addUser() {
//     const { ctx } = this;
//     const { name } = ctx.request.body;
//     try {
//       const res = await ctx.service.home.addUser(name);
//       ctx.body = {
//         code: 200,
//         msg: '添加成功',
//         data: null,
//       };
//     } catch (error) {
//       ctx.body = {
//         code: 500,
//         msg: '添加失败',
//         data: null,
//       };
//     }
//   }
//   async editUser() {
//     const { ctx } = this;
//     const { id, name } = ctx.request.body;
//     try {
//       const res = await ctx.service.home.editUser(id, name);
//       ctx.body = {
//         code: 200,
//         msg: '编辑成功',
//         data: null,
//       };
//     } catch (error) {
//       ctx.body = {
//         code: 500,
//         msg: '编辑失败',
//         data: null,
//       };
//     }
//   }
//   async deleteUser() {
//     const { ctx } = this;
//     const { id } = ctx.request.body;
//     try {
//       const res = await ctx.service.home.deleteUser(id);
//       console.log(res);
//       ctx.body = {
//         code: 200,
//         msg: '删除成功',
//         data: null,
//       };
//     } catch (error) {
//       ctx.body = {
//         code: 500,
//         msg: '删除失败',
//         data: null,
//       };
//     }
//   }
// }

// module.exports = HomeController;
class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { userName, pwd } = ctx.request.body;
    if (!userName || !pwd) {
      ctx.body = {
        code: 500,
        msg: '账号密码为空',
        data: null,
      };
      return;
    }
    const userInfo = await ctx.service.UserController.register(userName);
    if (userInfo && userInfo.userName) {
      ctx.body = {
        code: 500,
        msg: '该用户名已被注册，请重新输入',
        data: null,
      };
    }
  }
}

module.exports = UserController;
