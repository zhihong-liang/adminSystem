<script lang="ts">
import { h } from 'vue'
import { ElCheckboxButton, ElCheckbox, ElCheckboxGroup } from 'element-plus'
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/checkbox-button/style/css'

export default {
  props: ['options', 'type'],
  setup(props: CnPage.FormItemCheckboxProps['props']) {
    return () => {
      const { type, options, ...rest } = props || {}
      const el = type === 'button' ? ElCheckboxButton : ElCheckbox
      return h(
        ElCheckboxGroup,
        rest,
        () =>
          options?.map((option) => h(el, { ...option, label: option.value }, () => option.label))
      )
    }
  }
}
</script>

<style scoped lang="scss">
.el-checkbox {
  vertical-align: top;
}
</style>
