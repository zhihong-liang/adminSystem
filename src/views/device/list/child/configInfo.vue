<template>
  <CnForm ref="basisRef" v-bind="configForm" :value="configForm.model">
    <template #matList>
      <h3>事项列表</h3>
    </template>
  </CnForm>
  <CnPage v-bind="configTable"></CnPage>
</template>
<script lang="ts" setup>
import { reactive, ref, watchEffect, computed } from "vue";
import CnForm from "@/components/cn-page/CnForm.vue";
import CnPage from "@/components/cn-page/CnPage.vue";
// import CnTable from "@/components/cn-page/CnTable.vue";
import { mattersProgrammeRelationList } from "@/api/device";
import { devGroupListUtils, mattersProgrammeListPageUtils } from "../../utils/index";
const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
});
const basisRef = ref();
const mattersList: any = ref([]);
const gupList: any = ref([]);
const configForm: any = reactive({
  labelWidth: 120,
  colSpan: 12,
  model: {},
  disabled: props.model.type === "view" ? true : false,
  rules: {
    groupId: [{ required: true, message: "请选择设备分组" }],
    programmeId: [{ required: true, message: "请选择方案名称" }],
  },
  items: [
    {
      label: "设备分组",
      prop: "groupId",
      component: "select",
      span: 24,
      props: { options: gupList },
    },
    {
      label: "方案名称",
      prop: "programmeId",
      component: "select",
      props: {
        options: mattersList,
        onChange: () => {
          mattersList.value.map((item: any) => {
            if (item.id === configForm.model.programmeId) {
              configForm.model.themeName = item.themeName;
              props.model.programmeId = item.id;
              configTable.refresh = new Date().getTime()
            }
          });
        },
      },
    },
    {
      label: "事项主题名称",
      prop: "themeName",
      component: "input",
      props: {
        disabled: true,
      },
    },
    {
      component: "slot",
      prop: "matList",
      span: 24,
    },
  ],
});

const configTable = reactive<CnPage.Props>({
  params: {
    programmeId: computed(() => props.model.programmeId) ,
  },
  action: mattersProgrammeRelationList,
  table: {
    rowKey: "id",
    columns: [
      { label: "事项编号", prop: "matterCode" },
      { label: "事项别名", prop: "matterAlias" },
      { label: "事项名称", prop: "matterName" },
      { label: "业务部门", prop: "remark" },
      { label: "系统覆盖范围", prop: "remark" },
      { label: "办理类型", prop: "handleType", dict: "HANDLE_TYPE" },
      { label: "事项状态", prop: "matterStatus", dict: "MATTER_STATUS" },
    ],
  },
  pagination: true,
});

const validateForm = () => {
  return basisRef.value.formRef.validate((valid: boolean) => {
    if (valid) {
      return true;
    } else {
      return false;
    }
  });
};
const getFormData = () => {
  return configForm.model;
};
defineExpose({ validateForm, getFormData });

watchEffect(async () => {
  if (props.model) {
    configForm.model = props.model;
    mattersList.value = await mattersProgrammeListPageUtils().then((res) => {
      return res;
    });
    gupList.value = await devGroupListUtils().then((res) => {
      return res;
    });
    mattersList.value.map((item: any) => {
      if (item.id === props.model.programmeId) {
        configForm.model.themeName = item.themeName;
      }
    });
  }
});
</script>
<style lang="scss" scoped>
.refuse-bottom {
  border-bottom: 1px solid #cdd0d6;
  div,
  span {
    color: var(--gray9);
  }
}
</style>
