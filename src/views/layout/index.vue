<template>
  <el-container>
    <el-aside width="200px">
      <AppAside></AppAside>
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader></AppHeader>
      </el-header>
      <el-main>
        <!-- layout组件的路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <!-- <div>
   <AppAside></AppAside>
   <AppHeader></AppHeader>
  </div>-->
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
  data () {
    return {}
  },
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #d0dce7;
}
.el-header {
  background-color: #aec0d1;
}
.el-main {
  background-color: #e8eff4;
}
</style>
