<script lang="ts">
import { h, resolveComponent } from 'vue'
import { ElIcon } from 'element-plus'

export default {
  props: ['html'],
  setup(props) {
    return () => {
        return h(ElIcon, null, () => h(resolveComponent(props.html)))
    }
  }
}
</script>
