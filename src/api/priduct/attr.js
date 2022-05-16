/**
 * 平台属性管理模块请求文件
 */
import request from '@/utils/request'

//
// 一级分类
export function reqCategory1List() {
  return request({
    method: 'GET',
    url: '/admin/product/getCategory1'
  })
}
// 根据一级分类的ID 获取二级分类的数据
export function reqCategory2List(category1Id) {
  return request({
    method: 'GET',
    url: `/admin/product/getCategory2/${category1Id}`
  })
}
// 根据二级分类的ID 获取三级分类的数据
export function reqCategory3List(category2Id) {
  return request({
    method: 'GET',
    url: `/admin/product/getCategory3/${category2Id}`
  })
}
/**
 * 获取平台属性
 * 需要携带 三种id
 */
export function reqAttrList(category1Id, category2Id, category3Id) {
  return request({
    method: 'GET',
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
  })
}
