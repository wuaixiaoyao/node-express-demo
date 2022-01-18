let express = require('express');
let router = express.Router()
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
let mysql = require('mysql');
let db = require('./db/db');
let userSql = require('./sql/userSql')

//todo; 添加ejs 模板引擎
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

app.get('/index.html', function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})

//设置允许跨域请求
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
  res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});


//-------- 登录注册 -----------
router.post('/process_get', function (req, res) {
  // 输出 JSON 格式
  let body = req.body;
  let project = {
    "user": body.name,
    "pwd": body.pwd
  };
  let sqlString = 'INSERT INTO user SET ?';
  let connection = db.connection();
  //校验唯一性
  db.get(connection, userSql.getUserByName, body.name, (userList) => {
    console.log(userList, 'list')
    if (!userList.length) { //不存在
      db.insert(connection, sqlString, project, function (id) {
        res.set({
          "content-type": "application/json;charset=utf-8"
        }).json({
          code: 0,
          message: "注册成功",
          data: project
        }).end();
      });

    } else {
      res.set({
        "content-type": "application/json;charset=utf-8"
      }).json({
        code: 0,
        message: "已注册",
        data: null
      }).end();
    }
    db.close(connection)
  })


})


//上传文件
router.post('/file_upload', function (req, res) {
  console.log("-------------------files[0]--------------", req.body); // 上传的文件信息
  console.log(`已存在此文件${fs.existsSync(req.files[0].originalname)}`);
  if (fs.existsSync(req.files[0].originalname)) {
    console.log(`${req.files[0].originalname}已存在`);
    return
  }
  let des_file = __dirname + "/fileList/" + req.files[0].originalname;
  console.log('__dirname', __dirname)
  fs.readFile(req.files[0].path, function (err, data) {
    fs.writeFile(des_file, 'utf8', data, function (err) {
      if (err) {
        console.log(err);
      } else {
        response = {
          message: 'File uploaded successfully',
          filename: req.files[0].originalname,
          des_file: "des_file"
        };
      }
      console.log(response)
      res.json(response)
    });
  });
})

router.get('/listUsers', function (req, res) {
  let connection = db.connection();
  //校验唯一性
  db.get(connection, userSql.queryAll, {}, (userList) => {
    console.log('list', userList)
    res.set({}).json({
      code: 0,
      message: "success",
      data: userList
    });
    db.close(connection)
  })
})

router.get('/listUsersJson', function (req, res) {
  let dataUri = __dirname + "/data" + "/users.json";
  function asyncFake(data, callback) {
    if (data === 'foo') callback(true);
    else callback(false);
  }

  asyncFake('bar', function (result) {
    // this callback is actually called synchronously!
    console.log('result 同步', result)
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('promise then')
        console.log('resovle 后的打印')
      }, 0)
    }).then(res => {
      console.log('promise  result 异步', res)
    })
    process.nextTick(() => {
      console.log('nextTick result 异步', result)
    })
    // nextTick 先于 promise 执行
  });
  console.log(chalk.green('test 执行'))
  

  fs.readFile(dataUri, 'utf8', function (err, data) {
    console.log(dataUri, data);
    res.send(JSON.stringify({
      code: 0,
      message: "OK",
      data: data
    }));
    // compute();
  });

})

app.use('/', router)
let server = app.listen(5678, function () {
  let host = server.address().address
  let port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, `${chalk.green(port)}`)

})
const compute = () => {
  console.error('nextTick 后执行');
  process.nextTick(compute)
}
// compute();