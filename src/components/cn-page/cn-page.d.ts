import type { ExtractPropTypes, MaybeRef } from 'vue'
import type {
  FormInstance as ElFormInstance,
  TableProps as ElTableProps,
  TableColumnCtx as ElTableColumnCtx,
  RenderRowData as ElRenderRowData,
  PaginationProps as ElPaginationProps,
  PaginationEmits as ElPaginationEmits,
  FormProps as ElFormProps,
  FormItemProps as ElFormItemProps,
  InputProps as ElInputProps,
  ElSelect,
  ElOption,
  ElCheckboxGroup,
  ElRadioGroup,
  DatePickerProps as ElDatePickerProps,
  CascaderProps as ElCascaderProps,
  CascaderOption as ElCascaderOption,
  ButtonProps as ElButtonProps,
  DialogProps as ElDialogProps,
  formProps,
  IconProps as ElIconProps,
  InputNumberProps as ElInputNumberProps
} from 'element-plus'

import type { IToolbarConfig } from '@wangeditor/editor'
import type { IEditorConfig } from '@wangeditor/editor'

declare namespace CnPage {
  interface Props<Row = Record<string, any>, Params = Record<string, any>, Init = void> {
    /**
     * 页面初始化，适用于需要异步请求设置搜索条件的场景
     */
    init?: Promise<Init>
    /**
     * 请求接口
     */
    action: (params: any) => Promise<any>
    /**
     * 请求参数，用于搜索栏回显和表格请求
     */
    params: Params
    /**
     * 修改请求参数
     */
    transformRequest?: (params: Params, type?: string) => Params
    /**
     * 修改响应数据
     */
    transformResponse?: (data: Res<Row>) => ListRes<Row>
    /**
     * 刷新页面，通常指定一个随机数或时间戳，适用于在新增或编辑操作之前重新请求列表
     */
    refresh?: number
    /**
     * 搜索组件参数
     */
    search?: Omit<SearchProps, 'model' | 'onSearch' | 'onReset'>
    /**
     * 工具组件参数
     */
    toolbar?: ToolbarProps<Row>
    /**
     * 列表组件参数
     */
    table: Omit<TableProps<Row>, 'data'>
    /**
     * 分页组件参数
     */
    pagination?: boolean | Omit<PaginationProps, 'total' | 'onUpdate'>
  }

  /**
   * 按钮
   */
  type ButtonProps<Row = Record<string, any>> = {
    -readonly [K in keyof ElButtonProps]?: ElButtonProps[K]
  } & {
    label: string
    onClick?: (data: ElRenderRowData<Row>, evt?: MouseEvent) => any
  }

  /**
   * 搜索模块
   */
  interface SearchProps extends FormProps {
    onSearch?: (data: unknown) => void
    onReset?: (data: unknown, el: ElFormInstance) => void
  }

  /**
   * 操作模块
   */
  interface ToolbarProps<Row = Record<string, any>> {
    items: ToolbarButtonProps<Row>[]
  }
  type ToolbarButtonProps<Row = Record<string, any>> = ButtonProps<Row>

  /**
   * 表格模块
   */
  interface TableProps<T = Record<string, any>> extends ElTableProps<T> {
    columns: TableColumnProps<T>[]
  }
  type TableColumnProps<T = Record<string, any>> = Partial<
    ElTableColumnCtx<T> & {
      slot: string
      dict: string
      buttons: ButtonProps<T>[]
      icons: ElIconProps<T>[]
    }
  >

  /**
   * 分页模块
   */
  type PaginationProps = {
    -readonly [K in keyof ElPaginationProps]?: ElPaginationProps[K]
  } & {
    [K in keyof ElPaginationEmits as `on${Capitalize<K>}`]?: (val: number) => any // ElPaginationEmits[K]
  } & {
    page?: number
    size?: number
    total: number
    onUpdate: (page: number, size: number) => any
  }

  /**
   * 表单模块
   */
  type FormProps = {
    -readonly [K in keyof ElFormProps]?: ElFormProps[K]
  } & {
    model: Record<string, any>
    items: MaybeRef<FormItem[]>
    colSpan?: number
    footerSpan?: number
    readonly?: boolean
  }

  /**
   * 表单项
   */
  type FormItem =
    | FormItemProps
    | FormItemSubTitleProps
    | FormItemInputProps
    | FormItemSelectProps
    | FormItemCheckboxProps
    | FormItemRadioProps
    | FormItemDatePickerProps
    | FormItemCascaderProps
    | FormItemInputNumberProps
    | FormItemAdministrativeDivisionProps
    | FormItemGroupProps
    | FormItemSlotProps
    | FormItemEditorProps

  type FormItemProps = {
    -readonly [K in keyof ElFormItemProps]?: ElFormItemProps[K]
  } & {
    component?: undefined
    props?: undefined
    prop?: string | string[]
    span?: number
    display?: string
    /**
     * 字典
     */
    dict?: string
    visible?: () => boolean
  }

  /**
   * 小标题
   */
  interface FormItemSubTitleProps extends FormItemProps {
    component: 'subtitle'
  }

  /**
   * 输入框
   */
  interface FormItemInputProps extends FormItemProps {
    component: 'input'
    props?: {
      -readonly [K in keyof ElInputProps]?: ElInputProps[K]
    }
  }

  /**
   * 选择框
   */
  interface FormItemSelectProps extends FormItemProps {
    component: 'select'
    props?: ExtractPropTypes<typeof ElSelect> & {
      options: OptionProps[]
    }
  }
  interface OptionProps {
    value: string | number | boolean | object
    label: string | number
    disabled?: boolean
  }

  /**
   * 多选框
   */
  interface FormItemCheckboxProps extends FormItemProps {
    component: 'checkbox'
    props?: ExtractPropTypes<typeof ElCheckboxGroup> & {
      options: OptionProps[]
      type?: 'button'
    }
  }

  /**
   * 单选框
   */
  interface FormItemRadioProps extends FormItemProps {
    component: 'radio'
    props?: ExtractPropTypes<typeof ElRadioGroup> & {
      options: RadioOptionProps[]
      type?: 'button'
    }
  }
  interface RadioOptionProps {
    value: string | number | boolean
    label: string | number
    disabled?: boolean
  }

  /**
   * 时间选择器
   */
  interface FormItemDatePickerProps extends FormItemProps {
    component: 'datepicker'
    props?: {
      -readonly [K in keyof ElDatePickerProps]?: ElDatePickerProps[K]
    }
  }

  /**
   * 级联选择器
   */
  interface FormItemCascaderProps extends FormItemProps {
    component: 'cascader'
    props?: {
      [key: string]: any
      options: ElCascaderOption[]
      props?: ElCascaderProps
    }
  }

  /**
   * 数字输入框
   */
  interface FormItemInputNumberProps extends FormItemProps {
    component: 'inputnumber'
    props?: {
      -readonly [K in keyof ElInputNumberProps]?: ElInputNumberProps[K]
    }
  }

  /**
   * 行政区划
   */
  interface FormItemAdministrativeDivisionProps extends FormItemProps {
    component: 'ad'
    props?: {
      [key: string]: any
      props?: ElCascaderProps
    }
  }

  /**
   * 富文本
   */
  interface FormItemEditorProps extends FormItemProps {
    component: 'editor'
    props?: {
      [key: string]: any
      height?: string
      toolbarConfig?: Partial<IToolbarConfig>
      editorConfig?: Partial<IEditorConfig>
    }
  }

  /**
   * 表单组
   * TODO
   */
  interface FormItemGroupProps extends FormItemProps {
    component: 'group'
    props?: {
      children: FormItem[]
    }
  }

  /**
   * 自定义插槽
   */
  interface FormItemSlotProps extends Omit<FormItemProps, 'prop'> {
    component: 'slot'
    prop: string
  }

  /**
   * 对话框
   */
  type DialogProps<T = Record<string, any>> = {
    -readonly [K in keyof ElDialogProps]?: ElDialogProps[K]
  } & {
    [key: string]: any
    formProps?: FormProps
    loading?: Boolean
    action?: (params: any) => Promise<any>
  }
}

export = CnPage
export as namespace CnPage
