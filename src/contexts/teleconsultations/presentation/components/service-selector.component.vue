<template>
  <div class="form-group">
    <label for="service">{{ t('teleconsultations.service') }}</label>
    <pv-dropdown
      id="service"
      v-model="localValue"
      :options="serviceOptions"
      option-label="label"
      option-value="value"
      :placeholder="t('teleconsultations.selectService')"
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

const serviceOptions = computed(() => [
  { label: t('teleconsultations.nutrition'), value: 'nutrition' },
  { label: t('teleconsultations.general'), value: 'general' },
  { label: t('teleconsultations.psychology'), value: 'psychology' }
])
</script>
