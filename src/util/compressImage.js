// 压缩图片
// eslint-disable-next-line no-unused-vars
export function compressImage(file, config) {
  // eslint-disable-next-line no-unused-vars
  let src
  // eslint-disable-next-line no-unused-vars
  let files
  // let fileSize = parseFloat(parseInt(file['size']) / 1024 / 1024).toFixed(2)
  const read = new FileReader()
  read.readAsDataURL(file)
  return new Promise(function (resolve, reject) {
    read.onload = function (e) {
      let img = new Image()
      img.src = e.target.result
      img.onload = function () {
        // 默认按比例压缩
        let w = config.width
        let h = config.height
        // 生成canvas
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let base64
        // 创建属性节点
        canvas.setAttribute('width', w)
        canvas.setAttribute('height', h)
        ctx.drawImage(this, 0, 0, w, h)

        base64 = canvas.toDataURL(file['type'], config.quality)

        // 回调函数返回file的值（将base64编码转成file）
        // files = dataURLtoFile(base64) // 如果后台接收类型为base64的话这一步可以省略

        // 回调函数返回file的值（将base64转为二进制）
        let fileBinary = dataURLtoBlob(base64)

        resolve(fileBinary)
      }
    }
  })
};

// 将base64转为二进制
function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// base64转码（将base64编码转回file文件）  此方法我没用到
// eslint-disable-next-line no-unused-vars
function dataURLtoFile(dataurl) {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], { type: mime })
}
