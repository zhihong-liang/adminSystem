<template>
  <CnSelect v-if="component === 'select'" v-model="value" :options="dictionary" />
  <CnCheckbox v-else-if="component === 'checkbox'" v-model="value" :options="dictionary" />
  <CnRadio v-else-if="component === 'radio'" v-model="value" :options="dictionary" />
  <CnReadonly v-else v-model="label" />
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import useDictionary from '@/hooks/useDictionary'
import CnSelect from './CnSelect.vue'
import CnCheckbox from './CnCheckbox.vue'
import CnRadio from './CnRadio.vue'
import CnReadonly from './CnReadonly.vue'

const props = defineProps(['modelValue', 'dict', 'component', 'separator'])

const emits = defineEmits(['update:model-value'])

const dictionary = useDictionary(props.dict)
const label = ref()
watchEffect(() => {
  if (!props.component) {
    label.value = useDictionary(props.dict, props.modelValue, props.separator).value
  }
})

const value = computed({
  get() {
    return String(props.modelValue || '')
  },
  set(val) {
    emits('update:model-value', val)
  }
})
</script>
