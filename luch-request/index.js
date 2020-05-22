import Request from './request'
import configs from '../config.js'

const http = new Request()

http.setConfig((config) => { /* 设置全局配置 */
  config.baseUrl = configs.RequestUrl, /* 根域名不同 */
  // console.log("基础域名",config)
  // console.log("基础域名token",uni.getStorageSync( 'token'))
  config.header = {
    ...config.header,
	// 'app-auth':"eyJleHBpcmVzIjoxNTg2MDUzNDE1LCJyb2xlX2lkIjoxLCJzaWduIjoiYWUzNTY1MWZkODVlMmE3NDAyYmUxYzQ2NWQ5ODA3ODViOGQzMzJlMjBlZjE3ZWI2YzIxYmI2NWY1MzNiNGQ0YiIsInVzZXJfaWQiOjEyNDYwMzgyMzExMDM5NjcyMzJ9eyJleHBpcmVzIjoxNTg2MDUzNDE1LCJyb2xlX2lkIjoxLCJzaWduIjoiYWUzNTY1MWZkODVlMmE3NDAyYmUxYzQ2NWQ5ODA3ODViOGQzMzJlMjBlZjE3ZWI2YzIxYmI2NWY1MzNiNGQ0YiIsInVzZXJfaWQiOjEyNDYwMzgyMzExMDM5NjcyMzJ9"
  }
  return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
http.validateStatus = (statusCode) => {
  return statusCode === 200
}

http.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
  let token = uni.getStorageSync( 'token')
  config.header = {
    ...config.header,
	'app-auth':token
    // b: 1123
  }
  /*
  if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
    cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
  }
  */
  return config
})

http.interceptor.response((response) => { /* 请求之后拦截器 */
  if (response.data.code != 200) { // 服务端返回的状态码不等于200，则reject()
    return Promise.reject(response)
  }
  if(response.header["refresh-auth"]){
	  uni.setStorageSync("token",response.header["refresh-auth"])
  }
  // if (response.config.custom.verification) { // 演示自定义参数的作用
  //   return response.data
  // }
  return response.data
}, (response) => { // 请求错误做点什么
  return response
})

export default http
