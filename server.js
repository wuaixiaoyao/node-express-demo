let express = require('express');
let compression = require('compression')
let path = require('path')
let app = express();
let chalk = require("chalk");
let fs = require("fs");
let bodyParser = require('body-parser');
let multer = require('multer');
//nodemon  node 热更新
let cookieParser = require('cookie-parser')
let util = require('util');
app.use(compression())

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(multer({
  dest: '/tmp/'
}).array('image'));
app.use(cookieParser())

// static 托管静态文件
app.use(express.static(path.join(__dirname, 'public')))

//--------登录注册
app.post('/process_get', function (req, res) {

  // 输出 JSON 格式
  let body = req.body;
  let response = {
    "first_name": body.first_name,
    "last_name": body.last_name
  };
  console.log("response", response);
  res.set({
    "content-type":"application:json"
  }).end(JSON.stringify({
    code:0,
    message:"",
    data:response}));
  // res.download('./fileList/20190521000022.pdf')
})


//上传文件
app.post('/file_upload', function (req, res) {

  console.log("files[0]", req.files[0]); // 上传的文件信息

  let des_file = __dirname + "/fileList/" + req.files[0].originalname;
  fs.readFile(req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        console.log(err);
      } else {
        response = {
          message: 'File uploaded successfully',
          filename: req.files[0].originalname,
          des_file:"des_file"
        };
      }
      console.log(response)
      res.end(JSON.stringify(response));
    });
  });
})


app.get('/listUsers', function (req, res) {
  let dataUri = __dirname + "/data" + "/users.json";
  fs.readFile( dataUri, 'utf8', function (err, data) {
      console.log(dataUri, data );
      res.end( data );
  });
})


let server = app.listen(5678, function () {

  let host = server.address().address
  let port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, `${chalk.green(port)}`)

})