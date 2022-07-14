// app/service/home.js
'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    const { app } = this;
    const QUERY_STR = 'id, name';
    const sql = `select ${QUERY_STR} from user`;
    try {
      const res = await app.mysql.query(sql);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async addUser(name) {
    const { app } = this;
    try {
      const res = await app.mysql.insert('list', { name });
      return res;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async editUser(id, name) {
    const { app } = this;
    try {
      const res = await app.mysql.update(
        'list',
        { name },
        {
          where: {
            id,
          },
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async deleteUser(id) {
    const { app } = this;
    try {
      const res = await app.mysql.delete('list', { id });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = HomeService;

