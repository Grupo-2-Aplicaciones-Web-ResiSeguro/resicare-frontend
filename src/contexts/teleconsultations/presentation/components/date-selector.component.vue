<template>
  <div class="form-group">
    <label for="date">{{ t('teleconsultations.date') }}</label>
    <pv-date-picker
      id="date"
      v-model="localValue"
      class="form-control"
      :placeholder="t('teleconsultations.selectTime')"
      date-format="yy-mm-dd"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
