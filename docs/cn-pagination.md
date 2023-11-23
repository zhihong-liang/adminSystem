# 分页组件

## 组件地址

`src/components/cn-page/CnPagination.vue`

## 功能描述

分页，配合 [CnTable](./cn-table.md) 使用。

## 参数

除 [Pagination](https://element-plus.gitee.io/zh-CN/component/pagination.html#%E5%B1%9E%E6%80%A7) 组件属性外，拓展支持以下属性：

|属性|说明|类型|必选|可选值|默认值
|:--|:--|:--|:--|:--|:--
|page|页码|`number`|否|-|1
|size|每页条数|`number`|否|-|10
|total|总数，`CnPage` 组件内部管理此属性|`number`|是|-|-
|onUpdate|监听页码或每页条数改变，`CnPage` 组件内部实现此方法|`function`|是|-|-
