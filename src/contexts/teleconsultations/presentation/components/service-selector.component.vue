<template>
  <div class="form-group">
    <label
        id="service-label"
        for="service"
    >
      {{ t('teleconsultations.service') }}
    </label>
    <pv-dropdown
        id="service"
        v-model="localValue"
        :options="serviceOptions"
        option-label="label"
        option-value="value"
        :placeholder="t('teleconsultations.selectService')"
        class="form-control"
        aria-labelledby="service-label"
        aria-required="true"
        aria-describedby="service-description"
        :aria-invalid="!localValue ? 'true' : 'false'"
    />
    <span
        id="service-description"
        class="sr-only"
    >
      {{ t('teleconsultations.serviceDescription') }}
    </span>
    <span
        v-if="!localValue"
        class="error-message"
        role="alert"
        aria-live="polite"
    >
      {{ t('teleconsultations.serviceRequired') }}
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
 * Available service options for teleconsultation.
 */
const serviceOptions = computed(() => [
  { label: t('teleconsultations.nutrition'), value: 'nutrition' },
  { label: t('teleconsultations.general'), value: 'general' },
  { label: t('teleconsultations.psychology'), value: 'psychology' }
])
</script>

<style scoped>
/* Visually hidden but accessible to screen readers */
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

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>