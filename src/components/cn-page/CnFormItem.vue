<script lang="ts" setup>
import CnDict from './CnDict.vue'
import CnInput from './CnInput.vue'
import CnSelect from './CnSelect.vue'
import CnCheckbox from './CnCheckbox.vue'
import CnRadio from './CnRadio.vue'
import CnDatePicker from './CnDatePicker.vue'
import CnCascader from './CnCascader.vue'
import CnReadonly from './CnReadonly.vue'

defineProps(['component', 'dict', 'readonly'])
</script>

<template>
  <CnDict v-if="dict" :component="component" :dict="dict" />
  <CnReadonly v-else-if="readonly || !component" />
  <CnInput v-else-if="component === 'input'" />
  <CnSelect v-else-if="component === 'select'" />
  <CnCheckbox v-else-if="component === 'checkbox'" />
  <CnRadio v-else-if="component === 'radio'" />
  <CnDatePicker v-else-if="component === 'datepicker'" />
  <CnCascader v-else-if="component === 'cascader'" />
</template>
