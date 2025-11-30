<template>
  <!-- English comment: selector for user's registered objects -->
  <div class="insured-objects">
    <label id="object-label" for="object-select">
      {{ t('simulator.chooseRegisteredObject') }}
    </label>

    <div
        v-if="loading"
        class="loading-state"
        role="status"
        aria-live="polite"
    >
      {{ t('common.loading') }}...
    </div>

    <select
        v-else
        id="object-select"
        :value="modelValue"
        class="object-select"
        aria-labelledby="object-label"
        aria-required="true"
        :aria-invalid="!modelValue ? 'true' : 'false'"
        :aria-describedby="registeredObjects.length === 0 ? 'object-help' : null"
        :disabled="registeredObjects.length === 0"
        @change="onChange"
    >
      <option value="" disabled>
        {{ registeredObjects.length === 0 ? t('simulator.noObjectsFound') : t('simulator.objectPlaceholder') }}
      </option>
      <option
          v-for="obj in registeredObjects"
          :key="obj.id"
          :value="obj.id"
      >
        {{ obj.nombre }}
      </option>
    </select>

    <p
        v-if="!loading && registeredObjects.length === 0"
        id="object-help"
        class="help-text"
        role="alert"
    >
      {{ t('simulator.registerObjectPrompt') }} <a href="/register-object">{{ t('simulator.registerNow') }}</a>
    </p>
  </div>
</template>

<script setup>
// English comment: component emits numeric id of the selected registered object
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  registeredObjects: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

function onChange(e) {
  // Ensure we emit a Number when an id is selected, or empty string when cleared
  const raw = e.target.value
  const val = raw === '' ? '' : Number(raw)
  emit('update:modelValue', val)
}
</script>

<style scoped>
.insured-objects {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.95rem;
}

.loading-state {
  padding: 0.75rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: #f9fafb;
}

.object-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  color: var(--color-text);
  cursor: pointer;
}

.object-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}

.object-select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: var(--vt-c-indigo);
}

.help-text {
  font-size: 0.875rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

.help-text a {
  color: var(--vt-c-indigo);
  text-decoration: underline;
}
</style>