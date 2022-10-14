'use strict';
const moment = require('moment');
const Controller = require('egg').Controller;
const getDecode = require('../utils/decode');
class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    const {
      paymentType,
      amount,
      typeName,
      typeID,
      remark = '',
    } = ctx.request.body;
    let date = ctx.request.body.date;
    date = moment(date).format('x');
    // 做一个判空处理
    if (!paymentType || !amount || !date || !typeName || !typeID) {
      ctx.body = {
        code: 400,
        msg: '缺少必填字段',
        data: null,
      };
      return;
    }
    try {
      const userID = getDecode(ctx, app).id;
      await ctx.service.bill.add({
        amount,
        typeID,
        typeName,
        date,
        paymentType,
        remark,
        userID,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: 'ERROR' + error,
        data: null,
      };
    }
  }
  // return the bills of current user by the request date
  async list() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 5, typeID = 'all' } = ctx.query;
    try {
      const userID = getDecode(ctx, app).id;
      // get the list of all bills from current user
      const res = await ctx.service.bill.list(userID);
      // filter the bills by selected month and bill type if existed
      const selected_Month_bills = res.filter(obj => {
        if (typeID !== 'all') {
          return (
            moment(Number(obj.date)).format('YYYY-MM') === date &&
            typeID === obj.typeID
          );
        }
        return moment(Number(obj.date)).format('YYYY-MM') === date;
      });
      // convert the format of list for response body

      const _list = selected_Month_bills
        .reduce((accumulate, cur) => {
          // date after convert
          const date = moment(Number(cur.date)).format('YYYY-MM-DD');
          // multiple bills from same day are supposed to merge into one array  s
          const index = accumulate.findIndex(obj => obj.date === date);
          if (accumulate && accumulate.length && index > -1) {
            accumulate[index].bills.push(cur);
            // if the date of new bill hasn't appear, then create a new {date, bills}
          } else {
            accumulate.push({
              date,
              bills: [ cur ],
            });
          }
          return accumulate;
        }, [])
        // the chronologically is reverse order, the laster bill is on above
        .sort((a, b) => moment(b.date) - moment(a.date));
      // console.log('List----------------------------', _list);

      // page is 5, pagesize is 6, total bills is 40
      // filterListMap is the 6 bills between 4*6 and 5*6
      const filterListMap = _list.slice(
        (page - 1) * page_size,
        page * page_size
      );
      // console.log('filterListMap-------------', filterListMap);
      let totalExpense = 0;
      let totalIncome = 0;
      selected_Month_bills.forEach(obj => {
        if (obj.paymentType === '1') totalExpense += Number(obj.amount);
        if (obj.paymentType === '2') totalIncome += Number(obj.amount);
      });

      ctx.body = {
        code: 200,
        msg: 'SUCCESS',
        data: {
          totalExpense,
          totalIncome,
          totalPage: Math.ceil(_list.length / page_size),
          list: filterListMap || [],
        },
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: 'ERROR' + error,
        data: null,
      };
      return;
    }
  }
  async detail() {
    const { ctx, app } = this;
    const { id: BillID = '' } = ctx.query;
    const userID = getDecode(ctx, app).id;
    // 判断是否传入账单ID
    if (!BillID) {
      ctx.body = {
        code: 400,
        msg: '订单ID不能为空',
        data: null,
      };
      return;
    }
    try {
      console.log(BillID, userID);
      const res = await ctx.service.bill.detail(BillID, userID);
      ctx.body = {
        code: 200,
        msg: 'SUCCESS',
        data: res,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: 'Error' + error,
        data: null,
      };
    }
  }
  async update() {
    const { ctx, app } = this;
    const { id, paymentType, amount, typeID, typeName, remark } =
      ctx.request.body;
    let date = ctx.request.body.date;
    // 为什么一定要判空
    if (!id || !amount || !date || !typeName) {
      console.log(id, amount, date, typeName);
      ctx.body = {
        code: 400,
        msg: 'Update bills Params Issue',
      };
      return;
    }
    try {
      const decode = getDecode(ctx, app);
      const userID = decode.id;
      date = moment(date).format('x');
      await ctx.service.bill.update({
        id, // 账单id
        paymentType, // income or expense
        amount,
        date, // 日期
        typeID, // id of the label type
        typeName, // name of the label
        remark,
        userID, // dependency for select
      });

      ctx.body = {
        code: 200,
        msg: 'SUCCESS',
        data: {},
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: 'ERROR' + error,
      };
    }
  }
  async delete() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      await ctx.service.bill.delete(id);
      ctx.body = {
        code: 200,
        msg: 'DELETE SUCCESS',
        data: {},
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: 'ERROR' + error,
      };
    }
  }
  async data() {
    const { ctx, app } = this;
    const { date = '' } = ctx.query;
    const userID = getDecode(ctx, app).id;

    try {
      // all data of current user
      const res = await ctx.service.bill.list(userID);
      
      const start = moment(date).startOf('month').unix() * 1000;
      const end = moment(date).endOf('month').unix() * 1000;
      // data for the selected month
      const selected_month_data = res.filter(
        obj => Number(obj.date) >= start && Number(obj.date) < end
      );
      let totalExpense = 0;
      let totalIncome = 0;
      selected_month_data.forEach(obj => {
        if (obj.paymentType === '1') totalExpense += Number(obj.amount);
        if (obj.paymentType === '2') totalIncome += Number(obj.amount);
      });
      const totalData = selected_month_data.reduce((acc, cur) => {
        // find the same payment type bills
        const index = acc.findIndex(obj => obj.typeID === cur.typeID);
        // if cur bill is a new type bill which does not exit in accumulate
        if (index === -1) {
          acc.push({
            typeID: cur.typeID,
            typeName: cur.typeName,
            paymentType: cur.paymentType,
            amount: Number(cur.amount),
          });
        }
        // if type of current bill already appear
        if (index > -1) {
          acc[index].amount += Number(cur.amount);
        }
        return acc;
      }, []);

      totalData.forEach(obj => Number(obj.amount).toFixed(2));
      ctx.body = {
        code: 200,
        msg: 'SUCCESS',
        data: {
          totalExpense: Number(totalExpense).toFixed(2),
          totalIncome: Number(totalIncome).toFixed(2),
          totalData: totalData || [],
        },
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: 'ERROR' + error,
      };
    }
  }

}

module.exports = BillController;
