import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 优先查找文件，如果文件查找不到，则找目录
// 找到目录，优先加载目录中的index.js
import router from './router'
import './styles/index.less'
import 'nprogress/nprogress.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
