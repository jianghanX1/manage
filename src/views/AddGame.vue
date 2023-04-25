<template>
  <div class="add_game">
    <div class="upload_box">
      <el-upload
        class="avatar-uploader"
        :action="actionUrl"
        ref="upload"
        v-loading="uploadLoading"
        element-loading-text="拼命上传中"
        element-loading-spinner="el-icon-loading"
        :on-progress="uploadFile"
        :headers="headers"
        :auto-upload="true"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="uploadSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div class="from_box">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入游戏名称"></el-input>
        </el-form-item>
        <el-form-item label="游戏简介" prop="description">
          <el-input v-model="form.description" placeholder="请输入游戏简介"></el-input>
        </el-form-item>
        <el-form-item label="游戏评分" prop="score">
          <el-input v-model="form.score" placeholder="请输入游戏评分"></el-input>
        </el-form-item>
        <el-form-item label="下载数量" prop="downloads">
          <el-input v-model="form.downloads" placeholder="请输入下载数量"></el-input>
        </el-form-item>
        <el-form-item label="在玩人数" prop="players">
          <el-input v-model="form.players" placeholder="请输入在玩人数"></el-input>
        </el-form-item>
        <el-form-item label="游戏排名" prop="ranking">
          <el-input v-model="form.ranking" placeholder="请输入游戏排名"></el-input>
        </el-form-item>
        <el-form-item label="开发商">
          <el-input v-model="form.developer" placeholder="请输入开发商"></el-input>
        </el-form-item>
        <el-form-item label="游戏URL" prop="playUrl">
          <el-input v-model="form.playUrl" placeholder="请输入游戏URL"></el-input>
        </el-form-item>
        <el-form-item label="游戏类别">
          <el-radio v-model="form.type" v-for="(item,index) in gameTypeList" :label="item.code" :key="index">{{item.name}}</el-radio>
        </el-form-item>
        <el-form-item label="屏幕适配">
          <el-radio v-model="form.adaptation" label="vertical">竖屏</el-radio>
          <el-radio v-model="form.adaptation" label="horizontal">横屏</el-radio>
        </el-form-item>
        <el-form-item label="游戏状态">
          <el-radio v-model="form.gameStatus" label="1">启用</el-radio>
          <el-radio v-model="form.gameStatus" label="2">禁用</el-radio>
        </el-form-item>
        <el-form-item label="游戏分级">
          <el-radio v-model="form.classify" v-for="(item,index) in gameGradeList" :label="item.code" :key="index">{{item.name}}</el-radio>
        </el-form-item>
        <el-form-item label="语言">
          <el-radio v-model="form.language" label="chinese">中文</el-radio>
          <el-radio v-model="form.language" label="english">英文</el-radio>
        </el-form-item>
        <el-form-item>
          <div class="submit_now">
            <div>
              <el-button type="primary" @click="onSubmit('form')">立即添加</el-button>
              <el-button @click="cancel">取消</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: "AddGame",
  data() {
    var validateRanking = (rule, value, callback) => {
      let number = /^[1-9][0-9]*$/.test(value)
      if (value === '') {
        callback(new Error('请输入游戏排名'))
      } else if (!number){
        callback(new Error(`请输入正确游戏排名`))
      } else if (value < 1 || value > Number(this.$route.query.lastRankNo) + 1){
        callback(new Error(`请输入正确游戏排名1-${Number(this.$route.query.lastRankNo) + 1}`))
      } else {
        callback()
      }
    }
    return {
      actionUrl: `${process.env.BASE_URL_HTTPS}pmm/system/upload/image`,
      uploadLoading: false,
      imageUrl: '',
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      form: {
        name: '',
        description: '', // 简介
        score: '', // 评分
        downloads: '', // 下载数量
        players: '', // 在玩人数
        ranking: '', // 游戏排名
        developer: '', // 开发商
        playUrl: '', // 游戏URL
        type: '1',
        adaptation: 'vertical',
        classify: '0',
        language: 'chinese',
        gameStatus: '1', // 游戏状态
      },
      gameTypeList: [], // 游戏类型
      gameGradeList: [], // 游戏类型
      rules: {
        name: [
          { required: true, message: '请输入游戏名称' }
        ],
        description: [
          { required: true, message: '请输入游戏简介' },
          { max: 140, message: '长度在140个字符' }
        ],
        score: [
          { required: true, message: '请输入游戏评分' },
          { pattern: /^\d+(.\d{1})?$/, message: '请输入正确游戏评分' }
        ],
        downloads: [
          { required: true, message: '请输入下载数量' },
          { pattern: /(^\d$)|(^[1-9])/, message: '请输入正确下载数量' }
        ],
        players: [
          { required: true, message: '请输入在玩人数' },
          { pattern: /(^\d$)|(^[1-9])/, message: '请输入正确在玩人数' }
        ],
        ranking: [
          { required: true, validator: validateRanking }
        ],
        // developer: [
        //   { required: true, message: '请输入活动名称' }
        // ],
        playUrl: [
          { required: true, message: '请输入游戏URL' },
          // { pattern: /^(http(s)?:\/\/)?(www\.)?([0-9a-z-]{1,}.)?[0-9a-z-]{2,}.([0-9a-z-]{2,}.)?[a-z]{2,}$/i, message: '请输入正确格式' }
          { pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/, message: '请输入正确格式' }
        ],
      }
    };
  },
  mounted() {
    this.getGameType()
    const { query } = this.$route || {}
    const { gameId } = query || {}
    if (gameId) {
      this.getGameInfo(gameId)
    }
  },
  methods: {
    // 获取游戏类型
    getGameType() {
      request({
        url: '/pmm/system/dict',
        method: 'get',
        params: {
          dictTypes: 'game_type,game_grade'
        }
      }).then((res)=>{
        const { data } = res || {}
        const { code, data:dataObj } = data || {}
        const { game_type, game_grade } = dataObj || {}
        if (code == 1) {
          this.gameTypeList = game_type
          this.gameGradeList = game_grade
        } else {
          this.$message.error('获取游戏类别/分级失败')
        }
      }).catch((err)=>{
        console.log(err);
      })
    },

    // 回显
    getGameInfo(gameId) {
      request({
        url: '/pmm/game/info',
        method: 'get',
        params: {
          gameId: gameId
        }
      }).then((res)=>{
        const { data } = res || {}
        const { code, data:dataObj } = data || {}
        const { gameName, description, score, downloads, players, ranking, developer, playUrl, gameType, screenAdapter, gameGrade, language, iconUrl, isAvailable } = dataObj || {}
        let type = '1'
        let classify = '0'
        this.gameTypeList.map((item)=>{
          if (item.name == gameType) {
            type = item.code
          }
        })
        this.gameGradeList.map((item)=>{
          if (item.name == gameGrade) {
            classify = item.code
          }
        })
        if (code == 1) {
          this.form = {
            name: gameName,
            description: description, // 简介
            score: score, // 评分
            downloads: downloads, // 下载数量
            players: players, // 在玩人数
            ranking: ranking, // 在玩人数
            developer: developer, // 开发商
            playUrl: playUrl, // 游戏URL
            type,
            adaptation: screenAdapter,
            classify,
            language: language,
            gameStatus: isAvailable ? '1' : '2'
          }
          this.imageUrl = iconUrl
        } else {
          this.$message.error('数据加载失败');
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/webp';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg/jpeg/gif/png/webp 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // handleChange(file) {
    //   console.log(file.raw);
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    uploadFile() {
      this.uploadLoading = true
    },
    uploadSuccess(res) {
      const { code, data, msg } = res || {}
      if (code == 1) {
        this.imageUrl = data
      } else {
        this.$message.error(msg);
      }
      this.uploadLoading = false
    },
    onSubmit(form) {
      console.log('submit!');
      console.log(this.$refs[form]);
      const { query } = this.$route || {}
      const { gameId } = query || {}
      if (!this.imageUrl) {
        this.$message.error('请上传游戏图标')
        return
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          let gameGrade = null
          this.gameGradeList.map((item)=>{
            if (item.code == this.form.classify) {
              gameGrade = item.name
            }
          })
          request({
            url: gameId ? "/pmm/game/update" : "/pmm/game/add",  //接口路径
            method: "post",  //接口方法
            // headers: { 'Content-Type': 'multipart/form-data' }, //给接口添加请求头
            data:{
              siteId: gameId ? null : 'default',
              gameId,
              gameName: this.form.name,
              gameType: this.form.type,
              isAvailable: this.form.gameStatus == 1 ? true : false,
              description: this.form.description,
              screenAdapter: this.form.adaptation,
              gameGrade,
              language: this.form.language,
              score: this.form.score,
              ranking: this.form.ranking,
              downloads: this.form.downloads,
              players: this.form.players,
              developer: this.form.developer,
              iconUrl: this.imageUrl,
              playUrl: this.form.playUrl
            }//接口参数
          }).then((res)=>{
            const { data } = res || {}
            const { code } = data || {}
            if (code == 1) {
              this.$router.push({
                path: '/gameList'
              },()=>{})
            } else {
              this.$message.error('添加失败');
            }
          }).catch((err)=>{
            console.log(err);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel() {
      this.$router.push({
        path: '/gameList'
      },()=>{})
    }
  }
}
</script>

<style lang="less" scoped>
  .add_game{
    .upload_box{
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      margin-top: 20px;
      /deep/.avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      /deep/.avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
    .from_box{
      .submit_now{
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
