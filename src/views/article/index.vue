<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio
             v-for="(item,index) in statTypes"
             :key="item.label"
             :label="index+''">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动区域">
          <article-Channel v-model="filterParams.channel_id"></article-Channel>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="begin_end_pubdate"
            @change="handleDateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到<strong>{{ totalCount }}</strong>条符合条件的内容</span>
      </div>
      <!-- table表格 -->
      <!--
        data 用来指定表格的数据
        表格不需要我们自己手动遍历
        只需要把数据给 el-table 的 data 属性就可以了
        然后配置 el-table-column 需要展示的数据字段即可
      -->
      <el-table
      class="list-table"
      :data="articles"
      style="width: 100%"
      v-loading="articleLoading">
        <el-table-column prop="cover.images[0]" label="封面" width="180">
          <template slot-scope="scope">
            <img width="30" :src="scope.row.cover.images[0]" />
          </template>
        </el-table-column>
        <!-- 表格列默认只能输出文本，如果需要自定义里面的内容，则需要 -->
        <!--
            slot-scope 是插槽作用域，现在先听个名词，你要知道的是值 scope 是起的一个名字
            scope 中有个成员叫 row
            也就是说 scope.row 就是当前的遍历项对象
            自定义列模板，el-table-column 的 prop 就没有意义了
        -->
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="pubdate" label="发布日期" width="180"></el-table-column>
        <el-table-column  label="状态">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{statTypes[scope.row.status].label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button type="success" plain>修改</el-button>
            <el-button type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!--
        一：分多少页
          每页多大，默认是10条每页，我们的接口如果没有指定每页条数，则默认也是按照每页10条返回数据
          有多少条数据
          total  总记录数
          current-page 当前页码，也就是高亮的那个页码
        二：页面改变加载对应的页码数据
       -->
      <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :disabled="articleLoading"
      :current-page="page"
      @current-change="handleCurrentChange"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  components: {
    ArticleChannel
  },
  data () {
    return {
      articles: [],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value: ''
      },
      totalCount: 0,
      articleLoading: false,
      page: 1,
      statTypes: [ // 文章状态
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      filterParams: { // 文章查询条件参数
        status: '', // 文本状态
        channel_id: '', // 频道 id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      begin_end_pubdate: []
    }
  },
  created () {
    // 加载文章列表
    this.loadArticles()
  },
  methods: {
    loadArticles (page = 1) { // 函数参数的默认值
      this.articleLoading = true

      // 过滤出有效的查询条件数据字段
      const filterData = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      this.$http({
        method: 'GET',
        url: '/articles',
        // headers: {
        //   Authorization: `Bearer ${userInfo.token}` // 注意： Bearer和token之间要有空格
        // }
        params: {
          page, // 请求数据的页码，不传默认为一
          per_page: 10, // 请求数据的每页大小，不传默认为10
          ...filterData // 将对象混入当前对象，说白就是对象拷贝
        }
      }).then(data => {
        // console.log(data)
        this.articles = data.results // 列表数据
        this.totalCount = data.total_count // 总记录数
        this.articleLoading = false
      })
    },
    onSubmit () {
      // console.log('submit!')
      this.page = 1
      this.loadArticles()
    },
    handleCurrentChange (page) {
      // console.log(page)
      // 当页码发生改变的时候，请求该页码对应的数据
      this.loadArticles(page)
    },
    handleDelete (article) {
      // 确认执行
      // 发送删除请求
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: `/articles/${article.id}`
        }).then(data => {
          // 提示删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          console.log(data)
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          thpe: 'info',
          message: '已取消删除'
        })
      })
      // console.log(article)
    },
    // 日期选择组件的改变事件
    handleDateChange (value) {
      // console.log(value)
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
.list-table {
  margin-bottom: 30px;
}
</style>
