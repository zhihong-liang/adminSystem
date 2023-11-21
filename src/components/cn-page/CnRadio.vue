<script lang="ts">
import { h } from 'vue'
import { ElRadioButton, ElRadio, ElRadioGroup } from 'element-plus'
import 'element-plus/es/components/radio/style/css'
import 'element-plus/es/components/radio-button/style/css'

export default {
  props: ['options', 'type'],
  setup(props: CnPage.FormItemRadioProps['props']) {
    return () => {
      const { type, options, ...rest } = props || {}
      const el = type === 'button' ? ElRadioButton : ElRadio
      return h(ElRadioGroup, { ...rest }, () =>
        options?.map((option) => h(el, { ...option, label: option.value }, () => option.label))
      )
    }
  }
}
</script>

<style scoped lang="scss">
.el-radio-group {
  display: block;
}
.el-radio {
  vertical-align: top;
}
</style>
