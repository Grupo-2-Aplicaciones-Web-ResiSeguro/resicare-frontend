<template>
  <fieldset class="plan-selector">
    <legend id="plan-legend">{{ t('simulator.selectedPlan') }}</legend>
    <div
        class="plan-options"
        role="radiogroup"
        aria-labelledby="plan-legend"
        aria-required="true"
    >
      <label
          v-for="plan in planOptions"
          :key="plan.value"
          class="plan-option"
      >
        <input
            type="radio"
            name="plan"
            :value="plan.value"
            :checked="modelValue === plan.value"
            :aria-label="`${plan.label} plan`"
            @change="$emit('update:modelValue', plan.value)"
        />
        <span class="plan-label">{{ plan.label }}</span>
      </label>
    </div>
  </fieldset>
</template>

<script setup>
// English comment: plan selector for available insurance plans
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

// Available insurance plan options
const planOptions = computed(() => [
  { value: 'basico', label: t('simulator.basicPlan') },
  { value: 'premium', label: t('simulator.premiumPlan') }
])
</script>

<style scoped>
.plan-selector {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

legend {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.95rem;
  padding: 0 0.5rem;
}

.plan-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.plan-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.plan-option:hover {
  background: var(--color-background-soft);
  border-color: var(--vt-c-indigo);
}

.plan-option input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--vt-c-indigo);
}

.plan-label {
  font-size: 0.95rem;
  color: var(--color-text);
  font-weight: 500;
}
</style>