<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="头条" />
      </div>
      <div class="login-form">
        <!-- 表单验证：rules配置验证规则，ref获取表单组件，可以手动调用表单组件的验证方法 -->
        <!-- 将需要验证的字段，通过prop属性配置到el-form-item组件上 -->
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 支持栅格布局，一共24列 -->
            <el-col :span="12">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="6" :offset="2">
              <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
              <el-button type="primary" @click="handleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
              <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加class，会作用到它的根元素 -->
            <el-button
            class="btn-login"
            type="primary"
            @click="handleLogin"
            :loading="loginLoading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
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
      form: { // 表单数据
        mobile: '18848956338',
        code: '',
        agree: ''// 是否同意用户协议
      },
      loginLoading: false, // 登录按钮的loading状态
      rules: { // 表单验证规则
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      captchaObj: null // 通过initGeetest得到极验验证码对象
    }
  },
  components: {},
  methods: {
    // 表单组件有一个方法 validate 可以用于获取当前表单的验证状态
    handleLogin () {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      })
        .then(res => {
          // >=200&<400的状态码会进入到这里
          // console.log(res.data)
          // Element 提供的Message消息提升组件，也是组件调用的一种形式
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.loginLoading = false
          // 建议路由跳转用name去跳转，路由传参非常方便
          this.$router.push({
            name: 'home'
          })
        })
        .catch(err => {
          // >=400的http状态码会进入catch中
          // console.dir(err)
          // this.$message.error('登录失败')
          if (err.response.status === 400) {
            this.$message.error('登录失败，验证码或手机号错误')
          }
          this.loginLoading = false
        })
    },
    handleSendCode () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data.data)
        const data = res.data.data
        if (this.captchaObj) {
          return this.captchaObj.verify()
        }
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind' // 隐藏按钮式
          },
          captchaObj => {
            this.captchaObj = captchaObj
            // 这里可以调用验证实例 captchaObj 的实例方法
            // console.log(captchaObj)
            captchaObj
              .onReady(function () {
                // 验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify() // 显示验证码
              })
              .onSuccess(function () {
                // console.log('验证成功了')
                // console.log(captchaObj.getValidate())
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()
                // 调用获取短信验证码（极验API2）接口，发送短信
                axios({
                  method: 'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  parmas: {
                    // 专门用来 传递query查询字符串参数
                    challenge,
                    seccode,
                    validate
                  }
                }).then(res => {
                  console.log(res.data)
                })
              })
          }
        )
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
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
