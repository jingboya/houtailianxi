<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="头条" />
      </div>
      <el-form ref="form" :model="form">
        <el-form-item>
          <el-input v-model="form.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-input v-model="form.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button type="primary" @click="handleSendCode">获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <!-- 给组件加class，会作用到它的根元素 -->
          <el-button class="btn-login" type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
// import { constants } from 'crypto'
export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '18848956338',
        code: ''
      }
    }
  },
  components: {},
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleSendCode () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data.data)
        const data = res.data.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏按钮式
        }, function (captchaObj) {
          // 这里可以调用验证实例 captchaObj 的实例方法
          // console.log(captchaObj)
          captchaObj.onReady(function () {
          // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify() // 显示验证码
          }).onSuccess(function () {
            console.log('验证成功了')
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #ccc;
  background: url("./login_bg.jpg") no-repeat;
  background-size: 100%;
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .login-form-wrap {
    background-color: #fff;
    padding: 50px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
