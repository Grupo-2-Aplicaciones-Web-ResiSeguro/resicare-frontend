<template>
  <div class="form-group">
    <label
        id="time-label"
        for="time"
    >
      {{ t('teleconsultations.time') }}
    </label>
    <pv-dropdown
        id="time"
        v-model="localValue"
        :options="timeOptions"
        option-label="label"
        option-value="value"
        :placeholder="t('teleconsultations.selectTime')"
        class="form-control"
        aria-labelledby="time-label"
        aria-required="true"
        aria-describedby="time-description"
        :aria-invalid="!localValue ? 'true' : 'false'"
    />
    <span
        id="time-description"
        class="sr-only"
    >
      {{ t('teleconsultations.timeDescription') }}
    </span>
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

/**
 * Available appointment time slots.
 * Limited to specific hours per business requirements.
 * Hours: 9 AM, 11 AM, 2 PM, 4 PM
 */
const timeOptions = [
  { label: '09:00', value: '09:00' },
  { label: '11:00', value: '11:00' },
  { label: '14:00', value: '14:00' },
  { label: '16:00', value: '16:00' }
]
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>