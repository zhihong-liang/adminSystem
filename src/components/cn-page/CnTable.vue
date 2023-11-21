<script lang="ts">
import { h, renderSlot } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/table/style/css'
import useDictionary from '@/hooks/useDictionary'

export default {
  props: ['columns', 'data'],
  setup(props: CnPage.TableProps<any>, { slots }) {
    return () => {
      const { columns, ...tableProps } = props
      return h(ElTable, tableProps, () =>
        columns.map((column) =>
          h(
            ElTableColumn,
            { ...column },
            {
              default: (params: any) => {
                if (column.slot) {
                  return [renderSlot(slots, column.slot, params)]
                } else if (column.dict) {
                  const dict = column.dict
                  column.formatter = (row) => {
                    if (!column.prop) return ''
                    if (row[column.prop] === undefined || row[column.prop] === null) {
                      return ''
                    }
                    return useDictionary(dict, row[column.prop]).value
                  }
                  delete column.dict
                } else if (column.buttons) {
                  return column.buttons.map((button) =>
                    h(
                      ElButton,
                      {
                        ...button,
                        onClick: (evt) => button.onClick && button.onClick(params, evt)
                      },
                      () => button.label
                    )
                  )
                }
              }
            }
          )
        )
      )
    }
  }
}
</script>
