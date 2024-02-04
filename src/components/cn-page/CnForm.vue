<script lang="ts" setup>
import { computed, reactive, ref, watchEffect, type PropType, type UnwrapNestedRefs } from 'vue'
import type { FormInstance } from 'element-plus'
import CnFormItem from './CnFormItem.vue'
import CnAdministrativeDivision from './CnAdministrativeDivision.vue'
import CnEditor from './CnEditor.vue'

const props = defineProps({
  model: { type: Object, default: () => ({}) },
  readonly: Boolean,
  labelWidth: [String, Number],
  labelPosition: { type: String, default: 'top' }, // 弃用，本属性不支持自定义配置
  colSpan: { type: Number, default: 24 },
  footerSpan: { type: Number, default: 24 },
  rules: Object,
  items: Array as PropType<UnwrapNestedRefs<CnPage.FormItem>[]>
})

const formRef = ref<FormInstance>()
const modelValue = reactive<Record<string, any>>({})
watchEffect(() => {
  props.items?.forEach((item) => {
    if (!item.visible) {
      item.visible = () => true
    }

    if (!item.prop) return

    // 把 prop 统一转成字符串，这是给 form 表单校验用的
    const itemProp = Array.isArray(item.prop) ? item.prop.join('.') : item.prop || ''
    item.prop = itemProp
    // 使用 . 操作符切割字符串，根据索引数组得到多级引用
    const itemProps = itemProp.split('.')

    let model = props.model
    // 保留最后一个属性的引用
    while (itemProps.length > 1) {
      const cur = itemProps[0]
      if (!model[cur]) model[cur] = {}
      model = model[cur]
      itemProps.shift()
    }
    const last = itemProps[0]
    // 部分类型需要初始化赋值
    if (
      (item.component === 'checkbox' || (item.component === 'select' && item.props?.multiple)) &&
      model[last] === undefined
    ) {
      model[last] = []
    }
    // 选择框支持多选，且非独占一行，默认折叠标签
    if (item.component === 'select' && item.props?.multiple && (item.span === undefined ? props.colSpan !== 24 : item.span !== 24)) {
      item.props.collapseTags = item.props.collapseTags === undefined ? true : item.props.collapseTags
      item.props.collapseTagsTooltip = item.props.collapseTagsTooltip === undefined ? true : item.props.collapseTagsTooltip
    }

    // 设置组件的双向绑定
    if (item.component === 'ad') {
      ;['provinceCode', 'cityCode', 'districtCode', 'streetCode', 'villageCode'].forEach((prop) => {
        modelValue[prop] = computed({
          get() {
            return model[prop]
          },
          set(val) {
            model[prop] = val
          }
        })
      })
    } else {
      modelValue[item.prop] = computed({
        get() {
          return model[last]
        },
        set(val) {
          model[last] = val
        }
      })
    }
  })
})

defineExpose({ formRef })
</script>

<template>
  <el-form
    v-if="items?.length"
    ref="formRef"
    :model="model"
    :rules="readonly ? undefined : rules"
    :inline="colSpan === 0"
    :label-width="colSpan === 0 ? undefined : labelWidth"
    :label-position="'top'"
  >
    <el-row :gutter="colSpan ? 20 : 0">
      <el-col
        v-for="({ data, span, component, dict, props, display, ...rest }, index) in items"
        :key="index"
        :class="display"
        :span="span || colSpan"
      >
        <el-form-item
          v-bind="rest"
          :rules="readonly ? undefined : rest.rules"
          v-if="rest.visible!()"
        >
          <slot v-if="component === 'slot'" :name="rest.prop" />
          <CnAdministrativeDivision
            v-else-if="component === 'ad'"
            v-bind="props"
            :model="modelValue"
          />
          <CnEditor
            v-else-if="component === 'editor'"
            v-bind="props"
            v-model:modelValue="modelValue[rest.prop as string]"
          />
          <CnFormItem
            v-else
            v-bind="props"
            v-model="modelValue[rest.prop as string]"
            :component="component"
            :dict="dict"
            :readonly="readonly"
          />
        </el-form-item>
      </el-col>

      <el-col v-if="$slots.footer" :span="footerSpan" class="footer-col">
        <el-form-item>
          <slot name="footer" v-bind="{ data: model, el: formRef }" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-select),
:deep(.el-cascader),
:deep(.el-input-number),
:deep(.el-date-editor),
:deep(.el-date-editor .el-input__wrapper) {
  width: 100%;
}
:deep(.el-date-editor.el-input) {
  --el-date-editor-width: 100%;
}
:deep(.el-date-editor .el-input__wrapper) {
  box-sizing: border-box;
}
.el-form--inline :deep([class*='el-col-']) {
  flex: 0 0 auto;
  max-width: none;
}
.el-form--inline :deep(.el-col-0) {
  display: block;
}
.none {
  display: none !important;
}
.block {
  display: block !important;
}

.footer-col {
  align-self: flex-end;
}
</style>
