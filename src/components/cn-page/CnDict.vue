<template>
  <CnReadonly v-if="!component || props.readonly" v-model="label" />
  <CnSelect v-else-if="component === 'select'" v-model="value" :options="dictionary" />
  <CnCheckbox v-else-if="component === 'checkbox'" v-model="value" :options="dictionary" />
  <CnRadio v-else-if="component === 'radio'" v-model="value" :options="dictionary" />
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import useDictionary from '@/hooks/useDictionary'
import CnSelect from './CnSelect.vue'
import CnCheckbox from './CnCheckbox.vue'
import CnRadio from './CnRadio.vue'
import CnReadonly from './CnReadonly.vue'

const props = defineProps(['modelValue', 'dict', 'component', 'separator', 'readonly'])

const emits = defineEmits(['update:model-value'])

const dictionary = useDictionary(props.dict)
const label = ref()
watchEffect(() => {
  if (!props.component || props.readonly) {
    label.value = props.modelValue ? useDictionary(props.dict, props.modelValue, props.separator).value : '--'
  }
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:model-value', val)
  }
})
</script>
