<template>
  <!-- 准备一个画布容器 -->
  <!--
    不要使用 id 操作 DOM，还是会有冲突的问题
    Vue 中获取 DOM 的方式
      1. 给节点声明 ref
      2. 通过 this.$refs.ref名字 来访问
    一个组件中不要有同名 ref
   -->
  <div ref="main" style="width: 600px;height:400px;"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: '',
  data () {
    return {
      myChart: null
    }
  },
  mounted () {
    // 初始化图表组件
    this.initChart()

    // 发请求，更新数据
    this.loadData()
  },
  methods: {
    initChart () {
      this.myChart = echarts.init(this.$refs.main)
      // 显示标题，图例和空的坐标轴
      this.myChart.setOption({
        title: {
          text: '异步数据加载示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: []
        }]
      })
    },

    loadData () {
      this.myChart.showLoading()
      setTimeout(() => {
        this.$http({
          method: 'GET',
          url: 'http://localhost:3000/barData'
        }).then(data => {
          // myChart
          this.myChart.setOption({
            xAxis: {
              data: data.xAxisData
            },
            series: [{
              // 根据名字对应到相应的系列
              name: '销量',
              data: data.seriesData
            }]
          })

          this.myChart.hideLoading()
        })
      }, 2000)
    }
  }
}

</script>
<style lang="scss" scoped>

</style>
