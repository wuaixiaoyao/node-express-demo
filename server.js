var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');

var cookieParser = require('cookie-parser')
var util = require('util');

 
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(multer({
  dest: '/tmp/'
}).array('image'));
app.use(cookieParser())


app.get('/index.htm', function (req, res) {
  res.sendFile(__dirname + "/" + "index.htm");
})

//--------登录注册
app.post('/process_get', function (req, res) {

  // 输出 JSON 格式
  let body = req.body;
  var response = {
    "first_name": body.first_name,
    "last_name": body.last_name
  };
  console.log("response", response);
  res.end(JSON.stringify(response));
})


//上传文件
app.post('/file_upload', function (req, res) {

  console.log("files[0]", req.files[0]); // 上传的文件信息

  var des_file = __dirname + "/fileList/" + req.files[0].originalname;
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


var server = app.listen(8888, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})