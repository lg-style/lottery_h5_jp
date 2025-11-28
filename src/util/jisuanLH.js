export default {
  // 排列组合算法
  combo(arr, num) {
    var result = [];
    var range = function (r, _arr) {
      if (r.length == num) {
        result.push(r.toString())
      } else {
        let l = r.length;
        for (var i = 0, len = _arr.length - num + l; i <= len; i++) {
          range(r.concat(_arr[i]), _arr.slice(i + 1))
        }
      }
    }
    range([], arr);
    return result
  },
  duizi(arr) {
    if (arr[0] == arr[1] || arr[0] == arr[2] || arr[1] == arr[2]) {
      return true
    }
    return false
  },
  banshun(arr) {
    let arr2 = arr.sort()
    if (arr2[0] + 1 == arr2[1] || arr2[1] + 1 == arr2[2] || (arr2[0] == 0 && arr2[2] == 9)) {
      return true
    }
    return false
  },
  shunzi(arr) {
    var str = arr.sort().join('')
    let reg = /^(0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){2}\d$/;
    if (reg.test(str)) {
      return true
    } else if (str == '019') {
      return true
    } else {
      return false
    }
  },
  setSan(num1, num2, num3) {
    if (num1 == num2&&num2 == num3&&num1==num3){
      return '豹子'
    } else if (this.shunzi([num1, num2, num3])) {
      return '顺子'
    } else if (this.duizi([num1, num2, num3])) {
      return '对子'
    } else if (this.banshun([num1, num2, num3])) {
      return '半顺'
    } else {
      return '杂六'
    }
  },
  daxiao(bool){
    if(bool){
      return '大'
    }else {
      return '小'
    }
  },
  danshuang(bool){
    if(bool){
      return '单'
    }else {
      return '双'
    }
  },
  zonghelonghu(arr) {
    let num = 0
    let data = []
    arr.map(k => {
      num += parseInt(k)
    })
    data.push(num) //总和
    data.push(this.daxiao(num > 22)) //大小
    data.push(this.danshuang(num % 2 == 1)) //单双
    if (arr[0] > arr[4]) { //龙虎和
      data.push('龙')
    } else if (arr[0] < arr[4]) {
      data.push('虎')
    } else {
      data.push('和')
    }
    data.push(this.setSan(+arr[0], +arr[1], +arr[2]))//前三
    data.push(this.setSan(+arr[1], +arr[2], +arr[3]))//中三
    data.push(this.setSan(+arr[2], +arr[3], +arr[4]))//后三
    return data
  },
}
