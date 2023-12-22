<script lang="ts">
import { h, resolveComponent } from 'vue'
import { ElIcon } from 'element-plus'

export default {
  props: ['html', 'size', 'color'],
  setup(props) {
    return () => {
      return h(ElIcon, { size: props.size, color: props.color }, () => {
        if (props.html) {
          return h(resolveComponent(props.html))
        } else {
          return null
        }
      })
    }
  }
}
</script>
