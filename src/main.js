import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 优先查找文件，如果文件查找不到，则找目录
// 找到目录，优先加载目录中的index.js
import router from './router'
import './styles/index.less'
import 'nprogress/nprogress.css'
// 配置 axios 的基础路由
// 也就是说配置了这个东西，你就不用每次都写长长的 http://xxxx
// 只需要，例如 axios({ url: '/authorizations' })
// 路径中的 / ，多退少补
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 几乎每个组件都要使用 axios 去发请求，频繁的 import 就变得非常麻烦
// 我们可以将一些频繁使用的成员放到 Vue.prototype 中，然后就可以在组件中直接 this.xxx 使用了
// 为什么？因为所有组件都是 Vue 的实例
// 所以往 Vue.prototype 中添加的成员可以直接通过组件实例 this 进行访问
// Vue.prototype.foo = 'bar'

// 往Vue原型对象中添加成员，尽量使用 $名字 起名字，目的是为了防止和组件中的成员冲突
Vue.prototype.$http = axios
Vue.use(ElementUI)

/**
 * Axios 请求拦截器
 * 所有使用 axios 发起的请求都要先经过这里
 * config 是本次请求相关的配置对象
 * 我们可以通过修改 config 配置来统一自定义请求相关参数
 * return config 就是允许通过的方式
 */
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  // console.log('request userInfo => ', userInfo)
  // console.log('request config => ', config)

  // 如果登录了，才给那些需要 token 的接口统一添加 token 令牌
  // 登录相关接口不需要添加 token 令牌，想要也没有
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, error => {
  // console.log('request error', error)
  return Promise.reject(error)
})
/**
 * Axios响应拦截器
 */
axios.interceptors.response.use(response => { // >= 200 && < 400 的状态码进入这里
  // console.log('response => ', response)
  // return response
  // 将响应数据处理成统一的数据格式方便使用
  console.log('response => ', response)
  return response.data.data
}, error => { // >= 400 的状态码会进入这里
  // console.dir(error)
  console.log('response error =>', error)
  return Promise.reject(error)
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
