<script lang="ts">
import { h, resolveDirective, withDirectives } from 'vue'
import { ElButton } from 'element-plus'

// defineProps(['items'])

export default {
  props: ['items'],
  setup(props) {
    return () => {
      const { items } = props

      if (items?.length) {
        return h(
          'div',
          {},
          items.map((button: any) => {
            const elButton = h(ElButton, { ...button }, () => button.label)
            if (button.directives && button.directives.length) {
              button.directives.forEach((d: any) => {
                const directive = resolveDirective(d.label)
                if (!!directive) {
                  withDirectives(elButton, [[directive, d.value || '']]) // 需要 argument、modifiers 时再加上
                }
              })
            }
            return elButton
          })
        )
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
