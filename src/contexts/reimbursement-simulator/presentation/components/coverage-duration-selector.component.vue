<template>
  <div class="coverage-duration">
    <label>{{ t('simulator.coverageDuration') }}</label>
    <div class="duration-options">
      <button
        v-for="option in durationOptions"
        :key="option.value"
        type="button"
        class="duration-option"
        :class="{ active: modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const durationOptions = computed(() => [
  { value: '1mes', label: `1 ${t('simulator.month')}` },
  { value: '1semestre', label: `1 ${t('simulator.semester')}` },
  { value: '1año', label: `1 ${t('simulator.year')}` },
  { value: 'carrera', label: t('simulator.career') }
])
</script>

<style scoped>
.coverage-duration {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.95rem;
}

.duration-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.duration-option {
  flex: 1;
  min-width: fit-content;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.duration-option:hover {
  border-color: var(--vt-c-indigo);
  color: var(--vt-c-indigo);
}

.duration-option.active {
  background: var(--vt-c-indigo);
  color: white;
  border-color: var(--vt-c-indigo);
}
</style>
