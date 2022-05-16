/* eslint-disable eqeqeq */
<template>
  <div>
    <!-- 添加用户的按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin10px 0" @click="addshowDialog">添加</el-button>
    <!-- 表格区域 -->
    <!-- data是需要渲染的数据 必须是数组类型 -->
    <!-- border 是边框 -->
    <el-table
      style="width: 100%"
      :data="list"
      border
    >
      <!-- el-table-column 代表每一列 -->
      <!-- label 代表标题 -->
      <!-- width 对应列的宽度 -->
      <!-- align 标题的位置 -->
      <!-- type="index" 可以展示序号 -->
      <!-- prop 代表的是每一行(对应没一列) -->
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      />
      <el-table-column
        prop="prop"
        label="品牌LOGO"
        width="width"
        align="center"
      >
        <!-- row 是每一条数据 -->
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column
        prop="prop"
        label="操作"
        width="width"
      >
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateShowDiglog(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 当前第几页 current-page -->
    <!-- 数据总条数 total-->
    <!-- 每一页展示几条数据 page-size -->
    <!-- layout 分页器每个属性的位置 -->
    <!-- page-count 连续的页码数量 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="7"
      layout="prev,pager,next,jumper,->,sizes,total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 添加和修改的对话框 两者只是接口不同 -->
    <!-- :visible.sync 控制对话框的显示与隐藏 -->
    <!-- :label-width  -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="ruleRef" style="width:80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传logo -->
          <!-- 不是表单元素不能使用v-model -->
          <!-- action 是上传的地址 -->
          <!-- on-success 上传成功会执行一次 -->
          <!-- before-upload 上传之前执行一次 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 图片和加号切换 -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'TradeMark',
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('名称只能2-10位'))
      } else {
        callback()
      }
    }
    return {
      page: 5, // 代表分页器第几页
      limit: 3, // 每页显示多少条数据
      total: 0, // 总共有多少条
      list: [], // 数据源
      dialogFormVisible: false, // 对话框显示与隐藏
      // 收集品牌的信息
      tmForm: {
        tmName: '', // 品牌名称
        logoUrl: '' // 品牌LOGO
      },
      // 表单验证
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validate: validateTmName, trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌的图片' }
        ]
      }
    }
  },
  mounted() {
    // 获取列表数据方法
    this.getPageList()
  },
  methods: {
    async getPageList() {
      const { page, limit } = this
      const result = await this.$http.tradeMark.reqTradeMarkList(page, limit)
      // eslint-disable-next-line eqeqeq
      if (result.code == 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 当前页改变时会触发
    handleCurrentChange(pager) { // 参数自己会调用
      // console.log(pager) 代表的是去的第几页
      this.page = pager // 更换最新的页数
      this.getPageList() // 请求最新数据
    },
    // 每一页展示的数据发生变化时会触发(例如现在每页显示3条.更换成了每页5条)
    handleSizeChange(limit) { // 参数自己会调用
      // console.log(limit) 3 5 10
      this.limit = limit // 更换最新的显示条数
      this.getPageList() // 请求最新数据
    },
    // 点击添加 弹出对话框
    addshowDialog() {
      // 点击之前清空 清空上一次的表单内容
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
      this.dialogFormVisible = true
    },
    // 点击修改 弹出对话框
    updateShowDiglog(row) {
      this.dialogFormVisible = true
      // row 是当前行的数据 id logoUrl tmName(修改的对话框 默认是有当前行的数据)
      // 不能直接操作tmForm  点击取消按钮也会更新数据
      this.tmForm = { ...row } // 把数据给到tmForm(修改时会使用)
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res, file) {
      // console.log(res) 上传成功之后的返回的数组 成功的状态码 和服务器的地址
      // console.log(file)上传成功之后的返回的数据 图片 地址 等等
      // 上传成功之后 显示图片 res.data 是上传成功之后 图片在服务器的地址
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前的回调(判断图片的格式,大小等)
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 点击确定按钮
    addOrUpdateTradeMark() {
      // 当全部表单验证通过 再去发送请求
      this.$refs.ruleRef.validate(async(success) => {
        if (success) {
          this.dialogFormVisible = false // 关闭对话框
          // 又可能是添加或者是修改
          let result = await this.$http.tradeMark.reqAddOrUpdateTrademark(this.tmForm)
          // eslint-disable-next-line eqeqeq
          if (result.code == 200) {
            // 弹出信息 可能是添加成功 ｜ 修改成功 (添加接口不需要id,修改接口需要)
            this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
            this.getPageList() // 获取最新数据
          }
        } else {
          this.$message.error('添加失败')
          return false
        }
      })
    },
    // 删除操作
    deleteTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}品牌?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let result = await this.$http.tradeMark.reqDeleteTradeMark(row.id)
        // console.log(result)
        // eslint-disable-next-line eqeqeq
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageList() // 获取最新数据
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
.el-pagination {
  margin-top:20px;
  text-align: center;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
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
</style>
