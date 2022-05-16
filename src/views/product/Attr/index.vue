<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 展示列表 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="category3Id == ''"
          @click="isShowTable = false"
        >添加属性</el-button>
        <!-- 表格区域 -->
        <el-table border :data="attrList">
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          />
          <el-table-column label="属性名称" width="150" prop="attrName" />
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 20px"
                type="primary"
              >{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="isShowTable = false"
              />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或者是修改属性 -->
      <div v-show="isShowTable == false">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button icon="el-icon-plus" type="primary">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table border style="margin:20px 0">
          <el-table-column type="index" label="序号" align="center" width="80" />
          <el-table-column
            width="width"
            prop="prop"
            label="属性值名称"
          />
          <el-table-column
            width="width"
            prop="prop"
            label="操作"
          />
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [], // 数据
      isShowTable: false // 控制表格的显示与隐藏
    }
  },
  methods: {
    // 自定义事件--父组件(传递的是三个分类的id)
    // categoryId ID值  level用来区分是几级分类
    getCategoryId({ categoryId, level }) {
      // eslint-disable-next-line eqeqeq
      if (level == 1) {
        this.category1Id = categoryId // 获取到一级
        this.category2Id = '' // 清除上一次的缓存
        this.category3Id = '' // 清除上一次的缓存
        // eslint-disable-next-line eqeqeq
      } else if (level == 2) {
        this.category2Id = categoryId // 获取到二级
        this.category3Id = '' // // 清除上一次的缓存
      } else {
        this.category3Id = categoryId // 获取到三级
        // 代表三级分类的id有了(三个select框都选择了)可以发送请求
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    // 确定三级分类的数据时,才可以发送请求
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      let result = await this.$http.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      )
      // eslint-disable-next-line eqeqeq
      if (result.code == 200) {
        this.attrList = result.data
      }
    }
  }
}
</script>

<style></style>
