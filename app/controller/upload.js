'use strict';
const fs = require('fs');
const moment = require('moment');
const mkdirp = require('mkdirp');
const path = require('path');
const Controller = require('egg').Controller;

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    // 需要 config/config.default.js 设置 config.multipart 的 mode 属性为 file
    const file = ctx.request.files[0];
    // 声明存在资源的路径
    let uploadDir = '';
    try {
      // readFileSync 根据路径读取文件，返回文件内容。 Sync是同步，代码会在这一行等待结果
      const f = fs.readFileSync(file.filepath);
      // current date with the form of yyyy/mm/dd
      const day = moment(new Date()).format('YYYYMMDD');
      // this.config.uploadDir: 'app/public/upload',
      const dir = path.join(this.config.uploadDir, day);
      // 毫秒数
      const date = Date.now();
      // 创建一个路径为app/public/upload 的文件夹
      await mkdirp(dir);
      // combine directory and the date.extension
      uploadDir = path.join(dir, date + path.extname(file.filename));
      fs.writeFileSync(uploadDir, f);
    } finally {
      // clean the temp file
      ctx.cleanupRequestFiles();
    }
    ctx.body = {
      code: 200,
      msg: 'upload  successfully',
      data: uploadDir.replace(/app/g, '').replace(/\\/g, '/'),
    };
  }
}

module.exports = UploadController;
