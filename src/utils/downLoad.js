// 通过a标签下载文件
export default function downLoad(name, url) {
  let a = document.createElement('a')
  a.href = url
  a.download = name // 这里注意如果是静态资源链接，跨域请求的情况下download会失效
  // 合成函数，执行下载
  a.dispatchEvent(new MouseEvent('click'))
}
