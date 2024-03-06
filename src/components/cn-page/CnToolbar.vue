<script lang="ts">
import { ref, h, resolveDirective, withDirectives } from 'vue'
import { ElButton } from 'element-plus'
import CnExport from './CnExport.vue'

// defineProps(['items'])

export default {
  props: ['items', 'params'],
  setup(props) {
    return () => {
      const exportRef = ref()
      const { items, params } = props
      if (items?.length) {
        return h('div', {}, [
          items.map((button: any) => {
            const elButton = h(
              ElButton,
              {
                ...button,
                onClick: () => {
                  if (button.exportProps) {
                    const exportProps = {
                      ...button.exportProps,
                      otherParams: {
                        ...button.exportProps.otherParams,
                        ...params.search,
                        ids: params.tableList.map((v: { id: string }) => v.id)
                      }
                    }
                    exportRef.value.open(exportProps)
                  } else {
                    button.onClick && button.onClick(params)
                  }
                }
              },
              () => button.label
            )
            if (button.directives && button.directives.length) {
              button.directives.forEach((d: any) => {
                const directive = resolveDirective(d.label)
                if (!!directive) {
                  withDirectives(elButton, [[directive, d.value || '']]) // 需要 argument、modifiers 时再加上
                }
              })
            }
            return elButton
          }),
          h(CnExport, { ref: exportRef })
        ])
      }
    }
  }
}
</script>

<!-- <template>
  <div v-if="items?.length">
    <el-button v-for="(item, index) in items" v-bind="item" :key="index">
      {{ item.label }}
    </el-button>
  </div>
</template> -->
