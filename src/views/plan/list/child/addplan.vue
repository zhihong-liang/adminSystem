<template>
  <CnDialog
    v-bind="dialogProps"
    :loading="formLoading"
    ref="dialogRef"
  >
    <template #matterHheme>
      <h3>事项主题</h3>
    </template>
    <template #matterList>
      <h3 v-if="isShowTree">事项列表</h3>
      <el-form :model="fromData" ref="fromDataRef" style="width: 100%">
        <el-form-item>
          <el-radio-group v-model="fromData.labelName" @change="tabClick(fromData.labelName)" style="margin-bottom: 30px">
            <el-radio-button
              v-for="(item, index) in themeList"
              :label="item.id"
              :key="index"
              >{{ item.labelName }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="7">
            <div v-if="isShowTree">
              <el-tree
                :key="labelId"
                :props="props"
                :load="loadNode"
                lazy
                @node-click="nodeClick"
              ></el-tree>
            </div>
          </el-col>
          <el-col :span="17">
            <div v-if="isShowTree">
              <div>
                <el-button type="primary" @click="selectionItems" :disabled="selectTm">选择事项</el-button>
                <el-button type="default" @click="deselect">取消选择</el-button>
              </div>
              <CnTable v-bind="tableProps"></CnTable>
            </div>
          </el-col>
          <el-col :span="24">
            <div style="width: 100%; background: #fcc"></div>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #footer v-if="isType === 'select'">
      <el-button type="primary" @click="handleSubmit('select')">确定</el-button>
    </template>
  </CnDialog>
  <SelectionItems ref="selectionItemsRef" @onHandleSubmit="onHandleSubmit"></SelectionItems>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import CnDialog from "@/components/cn-page/CnDialog.vue";
import CnTable from "@/components/cn-page/CnTable.vue";
import SelectionItems from "./selectionItems.vue";
import { type FromData } from "../../utils/type";
import {
  mattersThemeLabelList,
  mattersThemeMenuRelationList,
  addMattersProgramme,
  putMattersProgramme,
  mattersProgrammeRelationList,
  detMattersProgrammeRelation
} from "@/api/matter";
import { getMattersThemeInfoList } from "../../utils/index";

import { ElMessage, ElMessageBox } from "element-plus";
interface Tree {
  name: string;
  leaf?: boolean;
}

const isType = ref();
const themmNameList = ref([]);
const formLoading = ref(false);
const isShowTree = ref(false);
const labelId = ref();
const selectTm = ref(true);
const mattersMenuId = ref();
const selectionItemsRef = ref();
const selectData = ref()
const emits = defineEmits(["submit"]);

const props = {
  label: "menuName",
  children: "children",
  isLeaf: false,
  key: "id",
};
const fromData: FromData = reactive({
  labelName: "",
});
const dialogProps: CnPage.DialogProps = reactive({
  title: "新增",
  formProps: {
    model: {},
    items: [
      {
        label: "方案编号",
        prop: "programmeCode",
        component: "input",
        props: { disabled: true },
        visible: () => isType.value !== "add",
      },
      { label: "方案名称", prop: "programmeName", component: "input" },
      {
        label: "状态",
        prop: "status",
        component: "select",
        dict: "START_STOP",
        visible: () => isType.value !== "add",
      },
      { label: "备注", prop: "remark", component: "input" }, // props: { type: "textarea" }
      {
        label: "主题名称",
        prop: "themeId",
        component: "select",
        props: {
          options: themmNameList,
        },
      },
      {
        label: "关联事项数",
        prop: "mattersCount",
        component: "input",
        props: { disabled: true },
        visible: () => isType.value !== "add",
      },
      {
        label: "关联设备数",
        prop: "devCount",
        component: "input",
        props: { disabled: true },
        visible: () => isType.value !== "add",
      },
      {
        label: "创建人",
        prop: "createUser",
        component: "input",
        props: { disabled: true },
        visible: () => isType.value !== "add",
      },
      {
        label: "创建时间",
        prop: "createTime",
        component: "input",
        props: { disabled: true },
        visible: () => isType.value !== "add",
      },
      // {
      //   label: "",
      //   component: "slot",
      //   prop: "matterHheme",
      //   span: 24,
      //   visible: () => isType.value === "select",
      // },
      { label: "", component: "slot", prop: "matterList", span: 24 },
    ],
    colSpan: 24,
    rules: {
      programmeName: [{ required: true, message: "请输入方案名称" }],
      themeName: [{ required: true, message: "请选择主题" }],
    },
  },
});

const tableProps = reactive<CnPage.TableProps>({
  columns: [
    { type: "selection" },
    { label: "事项编号", prop: "matterCode" },
    { label: "事项名称", prop: "matterName" },
    { label: "事项别名", prop: "matterAlias" },
    { label: "事项进驻单位", prop: "entryUnitText" },
    { label: "办理类型", prop: "handleType", dict: "HANDLE_TYPE" },
    { label: "事项状态", prop: "matterStatus", dict: "MATTER_STATUS" },
  ],
  data: [],
  onSelect: (selection: any) => {
    selectData.value = selection
    // tableProps.data = selection;
  },
});
const dialogRef = ref();
const themeList: any = ref([]);
const loadNode = (node: any, resolve: (data: Tree[]) => void) => {
  if (isShowTree) {
    if (node.level === 0) {
      const paramsTm: any = {
        labelId: labelId.value, //data[0].id,
      };
      mattersThemeMenuRelationList(paramsTm).then((tree: any) => {
        const { code, data, message } = tree;
        return resolve(data);
      });
    } else {
      const paramsTm: any = {
        labelId: node.data.labelId,
        parentId: node.data.id,
      };
      mattersThemeMenuRelationList(paramsTm).then((tree: any) => {
        const { code, data, message } = tree;
        return resolve(data);
      });
    }
  }
};
const nodeClick = (node: any) => {
  selectTm.value = !node.mattersMenuId
  mattersMenuId.value = node.mattersMenuId
  const params = {
    programmeId: dialogProps.formProps!.model.id,
    labelId: node.labelId,
    themeId: node.themeId,
    mattersMenuId: node.mattersMenuId,
  };
  console.log(",,,", params);
  tableProps.data = []
  mattersProgrammeRelationList(params).then(res => {
    const {code, data} = res
    if (code === '200') {
      tableProps.data = data
    }
  })
};
const tabClick = (id: string) => {
  fromData.labelName = id
  labelId.value = id
  mattersMenuId.value = undefined
  const item = themeList.value.find((v: { id: string; }) => v.id === id)
  if (item) {
    nodeClick({
      themeId: item.themeId,
      labelId: id
    })
  }
}
const open = async (data: any, _type: string) => {
  dialogRef.value.open();
  themmNameList.value = await getMattersThemeInfoList().then((res) => {
    return res;
  });
  isType.value = _type;
  dialogProps.formProps!.disabled = false;
  if (_type == "add") {
    // 新增
    dialogProps.formProps!.model = {};
    dialogProps.formProps!.colSpan = 24;
    isShowTree.value = false;
    dialogProps.action = () => handleSubmit("add");
    dialogProps.title = "新增";
  } else if (_type === "edit") {
    const newData = JSON.parse(data)
    dialogProps.formProps!.model = newData;
    dialogProps.formProps!.colSpan = 12;
    isShowTree.value = false;
    dialogProps.action = () => handleSubmit("edit");
    dialogProps.title = "编辑";
  } else if (_type === "select") {
    const newData = JSON.parse(data)
    dialogProps.formProps!.model = newData;
    dialogProps.formProps!.colSpan = 12;
    dialogProps.formProps!.disabled = true;
    // dialogProps.action = () => handleSubmit("select");
    dialogProps.title = "选择事项";
    const params: any = {
      themeId: newData.themeId,
    };
    mattersThemeLabelList(params).then((res) => {
      const { code, data, message } = res;
      if (code == "200") {
        fromData.labelName = data[0].id;
        themeList.value = data;
        labelId.value = data[0].id;
        // console.log("id", data[0].id);
        isShowTree.value = true;

        nodeClick({
          themeId: newData.themeId,
          labelId: data[0].id,
        })
      }
    });
  }
};

const deselect = () => {
  console.log(selectData.value);
  if(selectData.value && selectData.value.length > 0) {
    const ids: any = []
    selectData.value.map((item: any) => {
      ids.push(item.id)
    })
    const params = {
      ids: ids.join(',')
    }
    ElMessageBox.confirm("确定要取消选择吗？", "提示", {
      type: "warning",
      closeOnClickModal: false,
      confirmButtonText: "确定",
    }).then(() => {
      detMattersProgrammeRelation(params.ids).then(res => {
        const { data, code } = res
        if (code === "200") {
          ids.map((i: any) => {
            tableProps.data = tableProps.data.filter((v: any) => v.id !== i)
          })
        }
      })
    });
  } else {
    ElMessage({
      type: "error",
      message: "请选择事项",
    });
    return
  }
}
const selectionItems = () => {
  // console.log(data);
  const params = {
    programmeId: dialogProps.formProps!.model.id,
    labelId: fromData.labelName,
    mattersMenuId: mattersMenuId.value,
    themeId: dialogProps.formProps!.model.themeId
  };
  selectionItemsRef.value.open(params);
};
function handleSubmit(action: "add" | "edit" | "select") {
  let params: any = {
    ...dialogProps.formProps!.model,
  };

  if (action === "add") {
    return addMattersProgramme(params).then(() => {
      emits("submit");
    });
  } else if (action === "edit") {
    return putMattersProgramme(params).then(() => {
      emits("submit");
    });
  } else if (action === "select") {
    dialogRef.value.close()
  }
  // return action === 'add' ? addMattersProgramme(params) : putMattersProgramme(params)
}
const onHandleSubmit = (data: any) => {
  tableProps.data = data
}

defineExpose({ open });
</script>

<style scoped lang="scss">
.matterdrv {
  height: 1px;
  width: 100%;
  margin-bottom: 15px;
  border-top: 1px solid rgb(204, 204, 204);
}
</style>
