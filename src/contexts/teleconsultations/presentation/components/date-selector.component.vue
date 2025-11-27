<template>
  <div class="form-group">
    <label
        id="date-label"
        for="date"
    >
      {{ t('teleconsultations.date') }}
    </label>
    <pv-date-picker
        id="date"
        v-model="localValue"
        class="form-control"
        :placeholder="t('teleconsultations.selectTime')"
        date-format="yy-mm-dd"
        :minDate="minDate"
        aria-labelledby="date-label"
        aria-required="true"
        aria-describedby="date-description"
        :aria-invalid="!localValue ? 'true' : 'false'"
    />
    <span
        id="date-description"
        class="sr-only"
    >
      {{ t('teleconsultations.dateDescription') }}
    </span>
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

/**
 * Minimum selectable date (today at midnight)
 * Prevents users from selecting past dates for appointments
 */
const minDate = computed(() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})

/**
 * @param {string|Date} v - Date value to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
function parseToDate(v) {
  if (!v) return null
  if (v instanceof Date) return v
  const parsed = new Date(v)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Formats Date object to YYYY-MM-DD string
 * @param {Date} d - Date to format
 * @returns {string} Formatted date string or empty string
 */
function formatDateToYYYYMMDD(d) {
  if (!(d instanceof Date) || isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const localValue = computed({
  get: () => {
    return parseToDate(props.modelValue)
  },
  set: (val) => {
    let chosen = parseToDate(val)
    if (!chosen) {
      emit('update:modelValue', '')
      return
    }
    // Enforce minimum date constraint
    if (chosen < minDate.value) {
      chosen = new Date(minDate.value)
    }
    emit('update:modelValue', formatDateToYYYYMMDD(chosen))
  }
})
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