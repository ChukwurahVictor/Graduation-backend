/**
 * 接口服务入口文件
 */
// 引入api
const api = require('./api');
// 引入文件模块
const fs = require('fs');
// 引入处理路径的模块
const path = require('path');
// 引入处理post数据的模块
const bodyParser = require('body-parser');
// 引入Express
const express = require('express');
// const expressJwt = require('express-jwt');
const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

// the server responded with a status of 413 (Payload Too Large) 解决上传参数太大的方法
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(api);

// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '../dist')));
module.exports = {
  start: () => {
    // 因为是单页应用 所有请求都走/dist/index.html
    app.get('*', function(req, res) {
      const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
      res.send(html)
    });
    // 监听8088端口
    app.listen(8088);
    console.log('success listen......')
  },
};
