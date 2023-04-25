<template>
  <div id="app">
    <div class="top_box" v-if="showType">
      <el-button class="out_button" @click="outClick">退出登录</el-button>
    </div>
    <div style="margin: 70px 8px 8px">
      <router-view/>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: 'App',
  mounted() {
    console.log(this.$route);
  },
  computed: {
    showType() {
      return this.$route.name == 'LogIn' ? false : true
    }
  },
  methods: {
    outClick() {
      request({
        url: '/pmm/user/logout',
        method: 'get',
        params: {
          Authorization: localStorage.getItem('token')
        }
      }).then((res)=>{
        const { data } = res || {}
        const { code } = data || {}
        if (code == 1) {
          localStorage.setItem('token','')
          this.$router.push({
            path: '/'
          })
        } else {
          this.$message.error('退出失败')
        }
      }).catch((err)=>{
        console.log(err);
      })
    }
  }
}
</script>

<style lang="less">
#app {
  position: relative;
  .top_box{
    width: 100%;
    text-align: right;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #cccccc;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    background: white;
    .out_button{
      margin-right: 10px;
    }
  }
}
body{
  margin: 0;
}
</style>
