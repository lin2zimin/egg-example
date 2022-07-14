'use strict';
const Service = require('egg').Service;

class UserService extends Service {
  async getUsers() {
    const { app } = this;
    const QUERY_STR = 'id, userName, pwd';
    const sql = `select ${QUERY_STR} from user`;
    try {
      const res = await app.mysql.query(sql);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async checkExistByName(userName) {
    const { app } = this;
    try {
      const res = await app.mysql.get('user', { userName });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async register(params) {
    const { app } = this;
    try {
      const res = await app.mysql.insert('user', params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getUserByName(userName) {
    const { app } = this;
    try {
      const res = await app.mysql.get('user', { userName });
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async editUserInfo(params) {
    const { app } = this;
    try {
      // update('the table need change' , 'the content you use for update', 'the condition')
      const res = await app.mysql.update(
        'user',
        {
          ...params,
        },
        {
          id: params.id,
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
