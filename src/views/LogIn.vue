<template>
  <div class="log_in">
    <div class="log_in_form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="user">
          <el-input
            type="text"
            placeholder="请输入用户名"
            required="required"
            v-model="ruleForm.user"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="ruleForm.pass"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="log_in_button">
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button>注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: "LogIn",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validateUser = (rule, value, callback) => {
      // if (value === '') {
      //   callback(new Error('手机号或者邮箱不能为空'))
      // } else {
      //   const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      //   // eslint-disable-next-line no-useless-escape
      //   const reg2 = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
      //   if ((reg.test(value) || reg2.test(value))) {
      //     callback()
      //   } else {
      //     callback(new Error('请输入正确的手机号或者邮箱'))
      //   }
      // }
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        user: ''
      },
      rules: {
        user: [{ required: true, validator: validateUser }],
        pass: [{ required: true, validator: validatePass }]
      }
    }
  },
  methods: {
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          request({
            url: "/pmm/user/login",  //接口路径
            method: "post",  //接口方法
            // headers: { 'Content-Type': 'multipart/form-data' }, //给接口添加请求头
            data:{
              userName: this.ruleForm.user,
              password: this.$md5(this.ruleForm.pass),
            }//接口参数
          }).then((res)=>{
            console.log(res);
            const { data } = res || {}
            const { code, msg, data:dataObj } = data || {}
            const { token } = dataObj || {}
            if (code == 1) {
              localStorage.setItem('token',token)
              this.$router.push({
                path: '/gameList'
              },()=>{})
            } else {
              this.$message.error(msg);
            }
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
  .el-loading-spinner{
    font-size: 50px;
  }
</style>
<style lang="less" scoped>
  .log_in{
    background: #ffffff;
    height: calc(100vh - 16px);
    display: flex;
    justify-content: center;
    align-items: center;
    .log_in_form {
      width: 400px;
      height: 360px;
      padding: 10px;
      background: #fff;
      border-radius: 10px;
      .log_in_button{
        text-align: center;
      }
    }
  }
</style>
