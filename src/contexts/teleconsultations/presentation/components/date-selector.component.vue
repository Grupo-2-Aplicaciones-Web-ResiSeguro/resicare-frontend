<template>
  <div class="form-group">
    <label for="date">{{ t('teleconsultations.date') }}</label>
    <pv-date-picker
      id="date"
      v-model="localValue"
      class="form-control"
      :placeholder="t('teleconsultations.selectTime')"
      date-format="yy-mm-dd"
      :minDate="minDate"
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

// minDate = hoy (inicio del día)
const minDate = computed(() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})

function parseToDate(v) {
  if (!v) return null
  if (v instanceof Date) return v
  // aceptar strings tipo "YYYY-MM-DD" o ISO
  const parsed = new Date(v)
  return isNaN(parsed.getTime()) ? null : parsed
}

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
    if (chosen < minDate.value) {
      chosen = new Date(minDate.value)
    }
    emit('update:modelValue', formatDateToYYYYMMDD(chosen))
  }
})
</script>
