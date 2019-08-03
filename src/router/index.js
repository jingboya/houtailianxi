import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {/// 路由的名字，和组件名没有关系，说白了，就是path的别名，好处就是你的path是/x/x/x/x，我们跳转的时候可以直接使用$router.push('/x/x/x/x'),$router.push({name:'xxx'}),不仅仅如此，给个路由起个名字是个好的做法
      name: 'home',
      path: '/',
      component: () => import('@/views/home')
      // @表示src目录，无论你当前文件在哪里，@都是src绝对路径的别名
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
