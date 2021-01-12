// import dayjs from 'dayjs'
/**
 * 过滤器
 */

import dayjs from 'dayjs'

// pass默认时间处理
const passBaseTime = value => {
  // console.log(dayjs('2020-10-27T00:00:00+08:00').format('YYYY-MM-DD'));
  let res = '-'
  if (value) {
    if (value === '0001/1/1 0:00:00') {
      res = '-'
    } else {
      // res = value
      res = dayjs(value).format('YYYY-MM-DD')
    }
  }
  return res
}

// pass默认数值处理
const passBaseNum = value => {
  let res = '-'
  if (value) {
    if (value === '-9999.99' || value === '-9999') {
      res = '-'
    } else {
      res = value
    }
  }
  return res
}
export default {
  passBaseTime,
  passBaseNum
}
