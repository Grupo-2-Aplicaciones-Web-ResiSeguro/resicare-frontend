<template>
  <div class="form-group">
    <label for="time">{{ t('teleconsultations.time') }}</label>
    <pv-dropdown
      id="time"
      v-model="localValue"
      :options="timeOptions"
      option-label="label"
      option-value="value"
      :placeholder="t('teleconsultations.selectTime')"
      class="form-control"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const timeOptions = [
  { label: '09:00', value: '09:00' },
  { label: '11:00', value: '11:00' },
  { label: '14:00', value: '14:00' },
  { label: '16:00', value: '16:00' }
]
</script>
