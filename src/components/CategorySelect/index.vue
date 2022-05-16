<template>
  <div>
    <!-- inline 代表的是行内表单(一行可以放置都个表单元素) -->
    <el-form :inline="true" class="demo-form-inline" :model="categoryFrom">
      <el-form-item label="一级分类">
        <el-select v-model="categoryFrom.category1Id" placeholder="请选择" @change="handler1">
          <!-- 二级分类需要一级分类的id -->
          <!-- select的v-model 是需要 value来收集的 在使用v-model绑定 -->
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryFrom.category2Id" placeholder="请选择" @change="handler2">
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryFrom.category3Id" placeholder="请选择" @change="handler3">
          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'CategorySelect',
  data() {
    return {
      list1: [], // 一级分类
      // 收集相应一级二级三级分类的id
      categoryFrom: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      list2: [], // 二级分类
      list3: [] // 三级分类
    }
  },
  // 当组件挂载完毕 向服务器获取一级分类的
  mounted() {
    this.getCategory1List() // 一级分类
  },
  methods: {
    async getCategory1List() {
      let result = await this.$http.attr.reqCategory1List()
      // eslint-disable-next-line eqeqeq
      if (result.code == 200) {
        this.list1 = result.data
      }
    },
    // 一级分类的select事件回调(当一级分类的option发生变化时获取二级分类的数据)
    async handler1() {
      // 发生改变时清除上一次的缓存
      this.list2 = []
      this.list3 = []
      this.categoryFrom.category2Id = ''
      this.categoryFrom.category3Id = ''
      const { category1Id } = this.categoryFrom
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 }) // 传递给父组件并区别几级
      // 通过一级分类的id获取二级分类的数据
      let result = await this.$http.attr.reqCategory2List(category1Id)
      //  eslint-disable-next-line eqeqeq
      if (result.code == 200) {
        this.list2 = result.data
      }
    },
    // 二级分类的select事件回调(当二级分类的option发生变化时获取三级分类的数据)
    async handler2() {
      //  发生改变时清除上一次的缓存
      this.list3 = []
      this.categoryFrom.category3Id = ''
      const { category2Id } = this.categoryFrom
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 }) // 传递给父组件并区别几级
      // 通过二级分类的id获取三级分类的数据
      let result = await this.$http.attr.reqCategory3List(category2Id)
      //  eslint-disable-next-line eqeqeq
      if (result.code == 200) {
        this.list3 = result.data
      }
    },
    // 三级分类的回调
    handler3() {
      const { category3Id } = this.categoryFrom
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 }) // 传递给父组件并区别几级
    }
  }
}
</script>

<style>

</style>
