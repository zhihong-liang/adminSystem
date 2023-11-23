# 通用页面

## 组件地址

`src/components/cn-page/CnPage.vue`

## 功能描述

通用列表查询页面组件，集合搜索、列表、分页功能。由 [CnSearch](./cn-search.md)、[CnToolbar](./cn-toolbar.md)、[CnTable](./cn-table.md) 和 [CnPagination](./cn-pagination.md) 四个子组件集合而成。

## 参数

|属性|说明|类型|必选|可选值|默认值
|:--|:--|:--|:--|:--|:--
|init|页面初始化函数，适用于需要异步请求设置搜索条件的场景|`promise`|否|-|-
|action|请求接口|`function`|是|-|-
|params|请求参数，没有默认参数也需要指定为 `{}`|`object`|是|-|-
|transformRequest|发送请求前，修改请求参数|`function`|否|-|-
|transformResponse|请求响应后，（在传递到组件前）修改响应数据|`function`|否|-|-
|refresh|刷新监听，通常指定一个随机数或时间戳，适用于在新增或编辑操作之前重新请求列表|`number`|否|-|-
|search|搜索组件|`object`|否|-|-
|toolbar|工具组件|`object`|否|-|-
|table|列表组件|`object`|否|-|-
|pagination|分页组件|`boolean \| object`|否|-|-
