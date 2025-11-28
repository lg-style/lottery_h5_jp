//npm run build打包前执行此段代码
//npm run test打包前执行此段代码
const fs = require('fs');

//返回version的json数据
function getVersionJson() {
  let data = fs.readFileSync('./static/version.json') //fs读取文件
  return JSON.parse(data) //转换为json对象
}

let versionData = getVersionJson(), //获取version的json
    arr = versionData.version.split('.') //切割后的版本号数组
arr[2] = parseInt(arr[2]) + 1
versionData.version = arr.join('.') //转换为以"."分割的字符串
//用versionData覆盖version.json内容
fs.writeFile('./static/version.json', JSON.stringify(versionData, null, '\t'), err => {})