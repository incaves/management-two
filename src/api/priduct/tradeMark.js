import request from '@/utils/request'
/**
 * 品牌管理的请求模块
 * page 当前第几页 limit展示数据的条数
 */

export function reqTradeMarkList(page, limit) {
  return request({
    method: 'GET',
    url: `/admin/product/baseTrademark/${page}/${limit}`
  })
}

/**
 * 添加品牌 需要携带品牌名称 品牌LOGO
 * 修改品牌 需要携带 品牌的ID 品牌的名称 品牌的LOGO
 */
export function reqAddOrUpdateTrademark(tradeMark) {
  if (tradeMark.id) {
    // 需要id 代表的是修改
    return request({
      method: 'PUT',
      url: '/admin/product/baseTrademark/update',
      data: tradeMark
    })
  } else {
    // 添加
    return request({
      method: 'POST',
      url: '/admin/product/baseTrademark/save',
      data: tradeMark
    })
  }
}
/**
 * 删除业务
 * 传递id
 */
export function reqDeleteTradeMark(id) {
  return request({
    method: 'DELETE',
    url: `/admin/product/baseTrademark/remove/${id}`
  })
}
