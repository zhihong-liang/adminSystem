<template>
  <CnPage v-bind="props" />
  <CnDialog ref="dialogRef" v-bind="dialogProps">
    <template #auth>
      <el-tree
        v-model="areaCode"
        :key="areaCode"
        :data="division"
        node-key="value"
        :default-checked-keys="areaCode"
        show-checkbox
        check-strictly
        style="width: 100%"
        @check-change="handleCheckChange"
      >
        <template #default="{ node, data }">
          <div class="tree_label">
            {{ node.label }}
            <div v-if="areaCode.includes(data.value)" class="tree_auth" @click.stop>
              <CnDict
                v-model="authData[data.value]"
                component="checkbox"
                dict="DATA_PERMISSION_POLICY"
              />
            </div>
          </div>
        </template>
      </el-tree>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import CnDict from '@/components/cn-page/CnDict.vue'
import { getUnitList, addUnit, editUnit, getUnitDetail, type Unit, delUnit } from '@/api/admin'
import useDivision, { type Division2 } from '@/hooks/useDivision'
import { useDelete } from '@/hooks/useConfirm'

const division = ref<Division2[]>([])

const areaCode = ref<string[]>([])
const authData = ref<Record<string, string[]>>({})
const handleCheckChange = (data: Division2, checked: boolean) => {
  if (checked) {
    areaCode.value.push(data.value)
  } else {
    areaCode.value = areaCode.value.filter((v) => v !== data.value)
  }
}

const dialogRef = ref()
const dialogProps = reactive<CnPage.DialogProps>({
  formProps: {
    model: {},
    items: [
      { label: '基本信息', component: 'subtitle', span: 24 },
      { label: '单位名称', prop: 'fullName', component: 'input' },
      {
        label: '行政区划',
        prop: 'provinceCode',
        component: 'ad',
        props: { props: { checkStrictly: true } }
      },
      { label: '单位性质', prop: 'unitNature', component: 'select', dict: 'UNIT_NATURE' },
      { label: '单位类', prop: 'orgType', component: 'select', dict: 'ORG_TYPE' },
      { label: '单位类型', prop: 'unitType', component: 'select', dict: 'UNIT_TYPE' },
      { label: '排序', prop: 'unitSort', component: 'inputnumber', props: { step: 1, min: 0 } },
      { label: '单位地址', prop: 'address', component: 'input', span: 24 },
      { label: '状态', prop: 'status', component: 'radio', span: 24, dict: 'UNIT_STATUS' },
      { label: '备注', prop: 'remark', component: 'input', span: 24, props: { type: 'textarea' } },
      { label: '授权信息', component: 'subtitle', span: 24 },
      { prop: 'auth', component: 'slot', span: 24 }
    ],
    colSpan: 12,
    labelWidth: 100,
    rules: {
      fullName: [{ required: true, message: '请输入单位名称' }],
      provinceCode: [{ required: true, message: '请选择行政区划' }],
      unitNature: [{ required: true, message: '请选择单位性质' }],
      orgType: [{ required: true, message: '请选择单位类' }],
      unitType: [{ required: true, message: '请选择单位类型' }],
      address: [{ required: true, message: '请输入单位地址' }],
      status: [{ required: true, message: '请选择单位状态' }]
    }
  }
})
watch(
  [
    () => dialogProps.formProps?.model.villageCode,
    () => dialogProps.formProps?.model.streetCode,
    () => dialogProps.formProps?.model.districtCode,
    () => dialogProps.formProps?.model.cityCode,
    () => dialogProps.formProps?.model.provinceCode
  ],
  (code) => {
    const idx = code.findIndex(Boolean)
    if (code[idx]) {
      areaCode.value = [code[idx] as string]
      division.value = useDivision(code[idx] as string).value
      dialogProps.formProps!.model.unitLevel = 5 - idx
    } else {
      areaCode.value = []
      division.value = []
      dialogProps.formProps!.model.unitLevel = undefined
    }
  },
  { immediate: true }
)
watch(
  () => dialogProps.formProps?.model.permissions as Unit['permissions'],
  (permissions) => {
    if (!permissions) return
    areaCode.value = permissions.map((v) => v.regionCode)
    authData.value = permissions.reduce(
      (acc, cur) => {
        acc[cur.regionCode] = cur.dataPermissionPolicy?.split(',')
        return acc
      },
      {} as Record<string, string[]>
    )
  },
  { deep: true }
)
function saveUnit(type = 'add', model: Unit = {}) {
  areaCode.value = []
  authData.value = {}
  dialogProps.title = type === 'add' ? '新增单位' : '编辑单位'
  dialogProps.formProps!.model = { ...model }
  dialogProps.loading = true
  const getDetail = model.id ? getUnitDetail(model.id) : Promise.resolve()
  getDetail
    .then((res) => {
      const model = res?.data || {}
      if (model.permissions) {
        dialogProps.formProps!.model.permissions = model.permissions
      }
      dialogProps.action = () => {
        const action = type === 'add' ? addUnit : editUnit
        const model = dialogProps.formProps?.model || {}
        model.permissions = areaCode.value.map((v) => {
          const item = (model.permissions as Unit['permissions'])?.find((w) => w.regionCode === v)
          return {
            ...item,
            regionCode: v,
            dataPermissionPolicy: authData.value[v]?.toString()
          }
        })
        return action({ ...model })
      }
    })
    .finally(() => {
      dialogProps.loading = false
    })
  dialogProps.onSuccess = () => (props.refresh = Date.now())
  dialogRef.value?.open()
}

const props = reactive<CnPage.Props>({
  params: {},
  action: getUnitList,
  search: {
    items: [
      { label: '单位名称', prop: 'fullName', component: 'input' },
      { label: '单位性质', prop: 'unitNature', component: 'select', dict: 'UNIT_NATURE' },
      { label: '单位类型', prop: 'unitType', component: 'select', dict: 'UNIT_TYPE' }
    ]
  },
  toolbar: {
    items: [{ label: '新增', type: 'primary', onClick: () => saveUnit() }]
  },
  table: {
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { label: '单位名称', prop: 'fullName' },
      { label: '用户数', prop: 'unitCount' },
      { label: '单位性质', prop: 'unitNature', dict: 'UNIT_NATURE' },
      { label: '单位类', prop: 'orgType', dict: 'ORG_TYPE' },
      { label: '单位类型', prop: 'unitType', dict: 'UNIT_TYPE' },
      { label: '上级单位', prop: 'parentName' },
      { label: '创建时间', prop: 'createTime' },
      {
        label: '操作',
        prop: 'action',
        buttons: [
          { label: '编辑', type: 'warning', onClick: ({ row }) => saveUnit('edit', row) },
          {
            label: '删除',
            type: 'danger',
            onClick: ({ row }) => {
              useDelete({
                action: () => delUnit(row.id!.toString()),
                success: () => (props.refresh = Date.now())
              })
            }
          }
        ]
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.tree_label {
  align-items: center;
  display: flex;
  width: 100%;
}
.tree_auth {
  margin-left: 10px;
}
</style>
