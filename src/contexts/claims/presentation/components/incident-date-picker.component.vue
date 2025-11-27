<template>
  <div class="form-group">
    <label
        id="incident-date-label"
        for="incident-date"
    >
      {{ $t('claims.incidentDate') }}
    </label>
    <pv-date-picker
        id="incident-date"
        v-model="localValue"
        class="form-control"
        :placeholder="$t('claims.selectDate')"
        date-format="yy-mm-dd"
        :max-date="new Date()"
        aria-labelledby="incident-date-label"
        aria-required="true"
        aria-describedby="incident-date-hint"
    />
    <span
        id="incident-date-hint"
        class="hint-text"
    >
      {{ $t('claims.incidentDateHint') }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.form-control {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.hint-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>