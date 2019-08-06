<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button type="success" @click="handlePublish(false)">发布</el-button>
        <el-button type="primary" @click="handlePublish(true)">存入草稿</el-button>
      </div>
    </div>
    <el-form v-loading="$route.name === 'publish-edit'&&editLoading">
      <el-form-item>
        <el-input type="text" v-model="articleForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- bidirectional data binding（双向数据绑定） -->
        <quill-editor
          v-model="articleForm.content"
          ref="myQuillEditor"
          :options="editorOption"
        ></quill-editor>
      </el-form-item>
      <el-form-item label="封面"></el-form-item>
      <el-form-item label="频道">
        <!--
          组件通信：
            父传子：Props Down
            子传父：Events Up
        -->
        <!-- <article-channel
          :value="articleForm.channel_id"
          @input="articleForm.channel_id = $event"
        ></article-channel>-->

        <!--
          v-model 就是：
            :value="articleForm.channel_id"
            @input="articleForm.channel_id = $event"
          简写。
        -->
        <article-Channel :value="articleForm.channel_id" @input="articleForm.channel_id = $event"></article-Channel>
        <!-- <el-select v-model="articleForm.channel_id">
          <el-option label="" value="shanghai"></el-option>
        </el-select>-->
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'AppPublish',
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        cover: {
          // 封面
          type: 0, // 封面类型，-1：自动，0-无图，1-1张，3-3张
          images: [] // 图片链接
        },
        channel_id: '' // 频道
      },
      editorOption: {}, // 富文本编辑器相关参数选项
      editLoading: false
    }
  },
  components: {
    ArticleChannel,
    quillEditor
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  created () {
    if (this.$route.name === 'publish-edit') { this.loadArticle() }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  },
  methods: {
    handlePublish (draft = false) {
      this.$http({
        method: 'POST',
        url: '/articles',
        data: this.articleForm,
        params: {
          draft
        }
      })
        .then(data => {
          this.$message({
            type: 'success',
            message: '发布成功'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message.error('发布失败')
        })
    },
    loadArticle () {
      this.editLoading = true
      this.$http({
        method: 'GET',
        url: `/articles/${this.$route.params.id}`
      }).then(data => {
        // console.log(data)
        this.articleForm = data
        this.editLoading = false
      }).catch(err => {
        console.log(err)
        this.$message.error('加载文章详情失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

</style>
