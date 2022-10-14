'use strict';
const Service = require('egg').Service;

class BillService extends Service {
  async add(params) {
    try {
      const { app } = this;
      const res = await app.mysql.insert('bill', params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list(id) {
    const { app } = this;
    const QUERY_STR =
      'id, paymentType, amount, date, typeID, typeName, userID, remark';
    const sql = `select ${QUERY_STR} from bill where userID = ${id}`;
    const res = await app.mysql.query(sql);
    console.log(res)
    return res;
  }

  async detail(id, userID) {
    const { app } = this;
    const res = await app.mysql.get('bill', { id, userID });
    return res;
  }

  async update(params) {
    const { app } = this;
    const res = await app.mysql.update(
      'bill',
      { ...params },
      { id: params.id }
    );
    return res;
  }

  async delete(id) {
    const { app } = this;
    const res = await app.mysql.delete('bill', { id });
    return res;
  }

}
module.exports = BillService;
