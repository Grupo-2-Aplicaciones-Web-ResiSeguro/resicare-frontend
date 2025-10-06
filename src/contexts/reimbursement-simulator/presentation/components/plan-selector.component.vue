<template>
  <div class="plan-selector">
    <label>{{ t('simulator.selectedPlan') }}</label>
    <div class="plan-display">
      <span>{{ modelValue || t('simulator.noPlanSelected') }}</span>
      <pv-button
        :label="t('simulator.change')"
        class="btn-change"
        @click="$emit('change')"
      />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['change'])
</script>

<style scoped>
.plan-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.95rem;
}

.plan-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.plan-display span {
  color: var(--color-text);
}

.btn-change {
  background: var(--vt-c-indigo);
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
}
</style>
