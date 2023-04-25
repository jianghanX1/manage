<template>
  <div class="game_list">
    <div class="add_button">
      <div class="search">
        <el-input placeholder="请输入游戏名称" v-model="nameSearch" @keyup.enter.native="onNameSearch">
          <el-button slot="append" icon="el-icon-search" @click="onNameSearch"></el-button>
        </el-input>
      </div>
      <el-button type="primary" @click="addGame">添加游戏</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100vh - 200px)"
      :row-key="record=>record.id"
      border
    >
      <template slot="empty">
        <el-empty :image-size="100" description="暂无数据"></el-empty>
      </template>
      <el-table-column
        label="操作"
        width="165"
        fixed
      >
        <template slot-scope="scope">
          <div class="action_button">
            <el-button @click="deleteGame(scope)" style="color: red">删除</el-button>
            <el-button @click="edit(scope)">编辑</el-button>
            <el-button @click="startUsing(scope,true)" v-if="!scope.row.isAvailable" class="startUsing">启用</el-button>
            <el-button @click="startUsing(scope,false)" v-else class="forbidden">禁用</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="gameId"
        label="游戏编号"
      >
      </el-table-column>
      <el-table-column
        prop="gameName"
        label="游戏名"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="游戏类型"
      >
        <template slot-scope="scope">
          <div>
            {{scope.row.gameType}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="gameGrade"
        label="游戏分级"
      >
      </el-table-column>
      <el-table-column
        prop="playUrl"
        label="游戏URL"
      >
      </el-table-column>
      <el-table-column
        prop="downloads"
        label="下载数量"
      >
      </el-table-column>
      <el-table-column
        prop="players"
        label="在玩人数"
      >
      </el-table-column>
      <el-table-column
        prop="developer"
        label="开发商"
      >
      </el-table-column>
      <el-table-column
        prop="language"
        label="语言"
      >
      </el-table-column>
      <el-table-column
        prop="screenAdapter"
        label="屏幕适配"
      >
      </el-table-column>
      <el-table-column
        prop="score"
        label="评分"
      >
      </el-table-column>
      <el-table-column
        prop="currentState"
        label="当前状态"
      >
        <template slot-scope="scope">
          <div :style="scope.row.isAvailable ? 'color: green' : 'color: red'">
            {{scope.row.isAvailable ? '启用' : '禁用'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ranking"
        label="游戏排名"
      >
      </el-table-column>
      <el-table-column
        prop="currentRanking"
        label="排序"
        fixed="right"
        width="120"
      >
        <template slot-scope="scope">
          <div class="current_ranking">
            <el-button @click="rankingClick(scope,1)" :disabled="scope.row.ranking == 1"><i class="el-icon-top" /></el-button>
            <el-button @click="rankingClick(scope,2)" :disabled="scope.row.ranking == lastRankNo"><i class="el-icon-bottom" /></el-button>
            <el-button class="topping" @click="rankingClick(scope,3)" :disabled="scope.row.ranking == 1"><i class="el-icon-download" /></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10,20,30,40,50]"
        :page-size="pageSize"
        :total="total"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; text-align: right;"
      />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: "GameList",
  data() {
    return {
      nameSearch: '', // 搜索值
      tableData: [],
      multipleSelection: [], // 表格选中项
      currentPage: 1,
      pageSize: 10,
      total: 0,
      lastRankNo: null, // 最低排名
    }
  },
  mounted() {
    this.getGameList()
  },
  methods: {
    // 获取游戏列表
    getGameList() {
      request({
        url: "/pmm/game/list",  //接口路径
        method: "get",  //接口方法
        // headers: { 'Content-Type': 'multipart/form-data' }, //给接口添加请求头
        params:{
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          gameName: this.nameSearch, // 游戏名称
          gameType: null, // 游戏类型
          isAvailable: null, // 可用状态
          descOrderList: null, // 排行
        }//接口参数
      }).then((res)=>{
        const { data } = res || {}
        const { code, data:dataObj } = data || {}
        if (code == 1) {
          this.tableData =  dataObj.result || []
          this.total = dataObj.total
          this.lastRankNo = dataObj.lastRankNo
        } else {
          this.$message.error('数据加载失败');
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    // 搜索
    onNameSearch() {
      this.getGameList()
    },
    // 添加游戏
    addGame() {
      this.$router.push({
        path: '/addGame',
        query: {
          lastRankNo: this.lastRankNo
        }
      },()=>{})
    },
    // 删除游戏
    deleteGame (scope) {
      console.log(scope);
      const { row } = scope || {}
      const { gameId } = row || {}
      request({
        url: "/pmm/game/delete",  //接口路径
        method: "delete",  //接口方法
        params:{
          gameId, // 游戏Id
        },// get接口参数
        data: {

        }
      }).then((res)=>{
        const { data } = res || {}
        const { code } = data || {}
        if (code == 1) {
          this.currentPage = 1
          this.$nextTick(()=>{
            this.getGameList()
          })
        } else {
          this.$message.error('数据加载失败');
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    // 编辑游戏
    edit(scope) {
      console.log(scope);
      const { row } = scope || {}
      const { gameId } = row || {}
      this.$router.push({
        path: '/addGame',
        query: {
          gameId,
          lastRankNo: this.lastRankNo
        }
      },()=>{})
    },
    // 启用
    startUsing(scope, type) {
      console.log(scope);
      console.log(type);
      const { row } = scope || {}
      const { gameId } = row || {}
      request({
        url: "/pmm/game/update/available",  //接口路径
        method: "post",  //接口方法
        params:{

        },// get接口参数
        data: {
          gameId, // 游戏Id
          isAvailable: type, // true 启用  false 禁用
        }
      }).then((res)=>{
        const { data } = res || {}
        const { code } = data || {}
        if (code == 1) {
          this.getGameList()
        } else {
          this.$message.error('数据加载失败');
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    // 提升排名
    rankingClick(scope,status) {
      const { row } = scope || {}
      const { gameId, ranking } = row || {}
      request({
        url: "/pmm/game/update/ranking",  //接口路径
        method: "post",  //接口方法
        params:{

        },// get接口参数
        data: {
          gameId, // 游戏Id
          ranking: status === 1 ? ranking == 1 ? 1 : ranking - 1 : status === 2 ? ranking + 1 : 1, // 1 提升  2 下降  3 置顶
        }
      }).then((res)=>{
        const { data } = res || {}
        const { code } = data || {}
        if (code == 1) {
          this.getGameList()
        } else {
          this.$message.error('数据加载失败');
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    // 更改每页展示多少条方法
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.currentPage = 1
      this.$nextTick(()=>{
        this.getGameList()
      })
    },
    // 更改页码方法
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      this.$nextTick(()=>{
        this.getGameList()
      })
    }
  }
}
</script>

<style lang="less">
  .el-tooltip__popper{
    max-width: 200px;
  }
  .el-loading-spinner{
    font-size: 50px;
  }
</style>
<style lang="less" scoped>
.game_list{
  margin-top: 20px;
  .add_button{
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    .search{
      width: 50%;
    }
  }
  .action_button,.current_ranking{
    display: flex;
    .el-button{
      padding: 2px 5px;
    }
    .topping{
      transform: rotate(180deg);
    }
    .startUsing{
      color: green;
    }
    .forbidden{
      color: red;
    }
  }
}
</style>
