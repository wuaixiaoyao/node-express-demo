var fs = require('fs')
var path = require('path')
var rs = fs.createReadStream(path.join(__dirname, './a.txt'))
var ws = fs.createWriteStream(path.join(__dirname, './b.txt'))
rs.setEncoding('utf-8')
rs.on('data', (chunk) => {
 console.log('---读取中---')
 ws.write(chunk, 'utf-8')
})
rs.on('end' , () => {
  console.log('读取完成')
  // 关闭写入流
  ws.end()
})