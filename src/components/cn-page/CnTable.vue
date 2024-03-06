<script lang="ts">
import { h, renderSlot, resolveComponent, resolveDirective, withDirectives } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElIcon } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/table/style/css'
import useDictionary from '@/hooks/useDictionary'

export default {
  props: ['columns', 'data', 'selectionChange'],
  setup(props: CnPage.TableProps<any>, { slots }) {
    return () => {
      const { columns, ...tableProps } = props
      return h(
        ElTable,
        {
          ...tableProps,
          ref: 'tableRef',
          stripe: true,
          class: 'tooltb',
          maxHeight: '500',
          'onSelection-change': (selection) =>
            props.selectionChange && props.selectionChange(selection)
        },
        () =>
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
                      let label = useDictionary(dict, row[column.prop]).value
                      return h(
                        'span',
                        { class: label + ' ' + column.prop + row[column.prop] },
                        label
                      )
                    }
                    delete column.dict
                  } else if (column.buttons) {
                    return column.buttons.map((button) => {
                      const elButton = h(
                        ElButton,
                        {
                          ...button,
                          text: true,
                          directives: null,
                          style: "padding: 0",
                          onClick: (evt) => button.onClick && button.onClick(params, evt)
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
                      return (!button.visible || button.visible(params)) && elButton
                    })
                  } else if (column.icons) {
                    return column.icons.map((icon) => {
                      if (params.row.icon) {
                        return h(ElIcon, { ...icon.props }, () =>
                          h(resolveComponent(params.row.icon))
                        )
                      }
                    })
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

<style lang="scss" scoped>
.tooltb {
  margin-top: 15px
}
</style>
