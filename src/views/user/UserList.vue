<template>
  <CnPage v-bind="props" />
  <CnDialog v-bind="dialogProps" ref="dialogRef">
    <template #add>
      <el-button type="success" @click="addAuth">增加授权</el-button>
    </template>

    <template #authSlot>
      <el-form :model="model" ref="authRef">
        <div v-for="(item, index) in model.authList" :key="index">
          <div>授权{{index + 1}}<span v-if="index !== 0" style="float: right;color:red;cursor:pointer;" @click="delAuth(index)">删除</span></div>
          <el-row :gutter="20" class="aublock">
            <el-col :span="12">
              <el-form-item label="单位类型" :prop="'authList.' + index + '.unitType'" :rules="{ required: true, message: '请选择单位类型', trigger: 'change'}" style="margin-bottom: 18px">
                <el-select clearable filterable placeholder="请选择" v-model="item.unitType" @change="(val: string) => changeUnit(val, index, 'change')">
                  <el-option v-for="option in unitTypeList" :key="option.id" :label="option.unitTypeName" :value="option.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位" :prop="'authList.' + index + '.unitId'" :rules="{ required: true, message: '请选择单位', trigger: 'change'}" style="margin-bottom: 18px">
                <el-select clearable filterable placeholder="请选择" v-model="item.unitId" @change="getPermit($event, index)">
                  <el-option v-for="option in unitList" :key="option.id" :label="option.fullName" :value="option.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色" :prop="'authList.' + index + '.roleId'" :rules="{ required: true, message: '请选择角色', trigger: 'change'}" style="margin-bottom: 18px">
                <el-select clearable filterable placeholder="请选择" v-model="item.roleId" @change="(val: string) => changeRole(val, index)">
                  <el-option v-for="option in RoleList" :key="option.id" :label="option.name" :value="option.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="岗位" style="margin-bottom: 18px">
                <el-select clearable filterable placeholder="请选择" v-model="item.postId">
                  <el-option v-for="option in postList" :key="option.id" :label="option.name" :value="option.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div>功能权限</div>
              <el-tree
                :data="item.limitsList"
                :props="defaultProps"
                node-key="id"
                @node-click="handleNodeClick"
                show-checkbox
                :default-checked-keys="item.checkedKeys"
                class="defTreecs"
              />
            </el-col>
            <el-col :span="24">
              <div>数据权限</div>
              <el-tree
                v-model="item.areaCode"
                :key="item.areaCode"
                :data="item.division"
                node-key="value"
                :default-checked-keys="item.areaCode"
                show-checkbox
                check-strictly
                style="width: 100%"
                @check-change="(data: Division2, checked: boolean)=>handleCheckChange(data,checked, index)"
              >
                <template #default="{ node, data }">
                  <div class="tree_label">
                    {{ node.label }}
                    <div v-if="item.areaCode.includes(data.value)" class="tree_auth" @click.stop>
                      <CnDict
                        v-model="item.authData[data.value]"
                        component="checkbox"
                        dict="DATA_PERMISSION_POLICY"
                      />
                    </div>
                  </div>
                </template>
              </el-tree>
            </el-col>
          </el-row>
        </div>
      </el-form>

    </template>
    <template v-slot:footer="slotProp">
      <el-button @click="dialogRef?.close()">{{dialogProps.title === "查看用户" ? "关闭" : "取消"}}</el-button>
      <el-button v-if="dialogProps.title !== '查看用户'" type="primary" :loading="setLoading" @click="handleSubmit(slotProp)">提交</el-button>
    </template>
  </CnDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import CnPage from '@/components/cn-page/CnPage.vue'
import CnDialog from '@/components/cn-page/CnDialog.vue'
import {
  getUserList,
  addUserInfor,
  getDeptpostList,
  getUnitTypeList,
  getUnitList,
  getRoleList,
  getRoleDetail,
  getUnitDetail,
  getUserDetail,
  editUserInfor,
  type Unit
} from '@/api/admin'
import useDivision, { type Division2 } from '@/hooks/useDivision'

const handleCheckChange = (data: Division2, checked: boolean, index: number) => {
  if (checked) {
    model.authList[index].areaCode.push(data.value)
  } else {
    model.authList[index].areaCode = model.authList[index].areaCode.filter((v) => v !== data.value)
  }
}

interface Tree {
  name: string
  childList?: Tree[],
  disabled: boolean
}
interface AuthTs {
  postId: number
  roleId: number
  unitId: string
  areaCode: string[]
  authData: Record<string, string[]>
}

const defaultProps = {
  children: 'childList',
  label: 'name',
  disabled: 'disabled'
}
const handleNodeClick = (data: Tree) => {
  console.log(data)
}
const model = reactive<{
  authList: any[]
}
>({
  authList:[]
})
const authRef = ref();
const setLoading = ref(false)

const addAuth = () => {
  model.authList.push({
    unitType: "",
  })
}

const delAuth = (index: number) => {
  model.authList.splice(index, 1)
}

// 查询岗位
const postList = ref([] as any)
const queryPostList = () => {
  getDeptpostList({
    page: 1,
    size: 999,
    obj: {}
  }).then((res) => {
    postList.value = res.rows
  })
}

// 查询单位类型
const unitTypeList = ref([] as any)
const queryUnitList = () => {
  getUnitTypeList({
    page: 1,
    size: 999,
    obj: {}
  }).then((res) => {
    unitTypeList.value = res.rows
  })
}

// 查询单位
const unitList = ref([] as any)
function changeUnit(val: string, index: number, type: string) {
  if(type !== 'detail'){
    model.authList[index].unitId = ""
    model.authList[index].areaCode = []
    model.authList[index].division = []
    model.authList[index].authData = {}
  }
  getUnitList({
    page:1,
    size:999,
    obj: {
      unitType: val
    }
  }).then((res) => {
    unitList.value = res.rows
  })
}

// 获取数据权限
const getPermit = (val: number, index: number) => {
  getUnitDetail(val).then((res) => {
    model.authList[index].permiObj = res.data

    const code = [
    model.authList[index].permiObj.villageCode,
    model.authList[index].permiObj.streetCode,
    model.authList[index].permiObj.districtCode,
    model.authList[index].permiObj.cityCode,
    model.authList[index].permiObj.provinceCode
    ]
    const idx = code.findIndex(Boolean)
    console.log("idx", idx, code[idx])
    if (code[idx]) {
      model.authList[index].areaCode = [code[idx] as string]
      model.authList[index].division = useDivision(code[idx] as string).value
    } else {
      model.authList[index].areaCode = []
      model.authList[index].division = []
    }

    const permissions = model.authList[index].permiObj.permissions as Unit['permissions']
    if (permissions) {
      model.authList[index].areaCode = permissions.map((v) => v.regionCode)
      model.authList[index].authData = permissions.reduce(
        (acc, cur) => {
          acc[cur.regionCode] = cur.dataPermissionPolicy?.split(',')
          return acc
        },
        {} as Record<string, string[]>
      )
    }
  })
}

// 查询角色
const RoleList = ref([] as any)
const queryRoleList = () => {
  getRoleList({
    page: 1,
    size: 999,
    obj: {}
  }).then((res) => {
    RoleList.value = res.rows
  })
}

const arrChild = (arr: any) => {
  arr.forEach((e: Tree[]) => {
    e.disabled = true
    if (e.childList?.length) {
      arrChild(e.childList)
    }
  });
  return arr
}

const changeRole = (val: string, index: number) => {
  model.authList[index].limitsList = []
  getRoleDetail(val).then((res) => {
    model.authList[index].limitsList = arrChild(res.data.menuList)
    model.authList[index].checkedKeys = res.data.menuIds
  })
}

function operateUser(type = 'add', data = {}) {
  queryPostList();
  queryUnitList();
  queryRoleList();

  model.authList = []
  dialogProps.formProps.disabled = false
  if (type === 'look') dialogProps.formProps.disabled = true

  dialogProps.title = type === 'add' ? '新增用户' : (type === 'edit' ? '编辑用户': '查看用户')
  
  const detailApi = data.id? getUserDetail(data.id) : Promise.resolve()
  if (type) {
    detailApi.then((res) => {
      dialogProps.formProps!.model = res?.data || {}
      // 数据权限回显
      model.authList = res?.data.roleAuthList || [{}]
      if (type !== 'add') {
        model.authList.forEach((e: any, ind: number) => {
          changeUnit(e.unitType, ind, "detail")
          changeRole(e.roleId, ind)

          const code = [ e.villageCode,e.streetCode,e.districtCode,e.cityCode,e.provinceCode ]
          const idx = code.findIndex(Boolean)
          e.authData = {}
          if (code[idx]) {
            e.areaCode = [code[idx] as string]
            e.division = useDivision(code[idx] as string).value
          } else {
            e.areaCode = []
            e.division = []
          }

          const permissions = e.userAuthDataList as Unit['permissions']
          if (permissions) {
            e.areaCode = permissions.map((v) => v.regionCode)
            e.authData = permissions.reduce(
              (acc, cur) => {
                acc[cur.regionCode] = cur.dataPermissionPolicy?.split(',')
                return acc
              },
              {} as Record<string, string[]>
            )
          }
        });
      }
    }) 
  }

  dialogProps.onSuccess = () => (props.refresh = Date.now())
  dialogRef.value?.open()
}

const handleSubmit = (val: any) => {
  const valid1 = val.ref.formRef.validate();
  const valid2 = authRef.value.validate()
  Promise.all([valid1, valid2]).then(() => {
    setLoading.value = true
    const params = dialogProps.formProps!.model || {}
    const apiName = dialogProps.title === '新增用户' ? addUserInfor : editUserInfor
    const roleAuthList: any[] = []
    model.authList.forEach((v: AuthTs, i:number) => {
      roleAuthList.push({
        postId: v.postId,
        roleId: v.roleId,
        unitId: v.unitId,
        userAuthDataList: []
      })
      for (let item of v.areaCode) {
        if (v.authData[item]) {
          roleAuthList[i].userAuthDataList.push({
            regionCode: item,
            dataPermissionPolicy: v.authData[item].join(','),
            unitId: v.unitId,
            status: '1'
          })
        }
      }
    });
    apiName({
      ...params,
      userName: params.phone,
      roleAuthList: roleAuthList
    }).then((res) => {
      props.refresh = Date.now()
      dialogRef.value?.close()
    }).finally(() => {
      setLoading.value = false
    })
  })
}

const dialogRef = ref<InstanceType<typeof CnDialog>>()
const dialogProps = reactive<CnPage.DialogProps>({
  title: '新增用户',
  formProps: {
    model: { position: [] },
    items: [
      { label: '基本信息', component: 'subtitle', span: 24 },
      { label: '用户编号', prop: 'userNo', component: 'input' },
      { label: '用户名称', prop: 'name', component: 'input' },
      { label: '登录手机号', prop: 'phone', component: 'input' },
      { label: '联系电话', prop: 'telephone', component: 'input' },
      { label: '电子邮箱', prop: 'email', span: 24, component: 'input' },
      {
        label: '状态',
        prop: 'status',
        span: 24,
        component: 'radio',
        dict: 'USER_STATUS'
        // props: {
        //   options: [
        //     { label: '启用', value: '1' },
        //     { label: '禁用', value: '0' }
        //   ]
        // }
      },
      { label: '授权信息', component: 'subtitle', span: 24 },
      {
        prop: 'auth',
        component: 'group',
        props: {
          children: [
            { label: '单位类型', prop: 'type', component: 'select' },
            { label: '单位', prop: 'unit', component: 'select' },
            { label: '角色', prop: 'role', component: 'select' },
            { label: '岗位', prop: 'position', component: 'input' },
            { label: '功能权限', prop: 'porperty', component: 'select' },
            { label: '数据权限', prop: 'data', component: 'select' }
          ]
        }
      },
      { prop: 'add', component: 'slot', span: 24 },
      { prop: 'authSlot', component: 'slot', span: 24 },
    ],
    colSpan: 12,
    rules: {
      userNo: [{ required: true, message: '请输入用户编号'}],
      name: [{ required: true, message: '请输入用户名称'}],
      phone: [{ required: true, message: '请输入登录手机号'}],
      telephone: [{ required: true, message: '请输入联系电话'}],
      status: [{ required: true, message: '请选择状态'}],
    }
  },
  onSubmit: () => {
    console.log({ ...dialogProps.formProps?.model })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, 2000)
    })
  }
})

const props: CnPage.Props = reactive({
  params: {},
  action: getUserList,
  search: {
    items: [
      { label: '用户名称', prop: 'name', component: 'input' },
      { label: '登录手机号', prop: 'phone', component: 'input' }
    ]
  },
  toolbar: {
    items: [
      {
        label: '新增',
        type: 'primary',
        // onClick: () => {
        //   dialogRef.value?.open()
        // },
          onClick: () => operateUser()
      }
    ]
  },
  table: {
    columns: [
      { type: 'index', label: '序号', width: 60 },
      { prop: 'userNo', label: '用户编号' },
      { prop: 'name', label: '用户名称' },
      { prop: 'phone', label: '登录手机号' },
      { prop: 'unitName', label: '单位名称' },
      { prop: 'unitLevel', label: '单位层级', dict: 'UNIT_LEVEL' },
      { prop: 'unitType', label: '类型', minWidth: 100 },
      { prop: 'postName', label: '岗位' },
      { prop: 'status', label: '状态', dict: 'USER_STATUS' },
      { prop: 'createTime', label: '创建时间', width: 170 },
      {
        prop: 'action',
        label: '操作',
        buttons: [
          { label: '查看', type: 'primary', onClick: ({row}) => operateUser('look', row) },
          { label: '编辑', type: 'warning', onClick: ({row}) => operateUser('edit', row) }
        ]
      }
    ]
  }
})

</script>

<style lang="scss" scoped>
.add-auth {
  margin-top: -120px;
  text-align: right;
  width: 100%;
}
.aublock {
  background-color: #f8f8f8;
  border: 1px dashed #eee;
  padding: 15px 15px 25px;
  margin-bottom: 15px;
}

.tree_label {
  align-items: center;
  display: flex;
  width: 100%;
}
.tree_auth {
  margin-left: 10px;
}
// :deep(.defTreecs .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner ){
//   background-color: #409eff;
//   border-color: #409eff;
// }
// :deep(.defTreecs .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner::before) {
//   background-color: #409eff;
//   border-color: #409eff;
// }
// :deep(.defTreecs .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
//   border-color: #fff;
// }
</style>
