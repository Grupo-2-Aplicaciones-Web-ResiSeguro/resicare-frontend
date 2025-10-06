<template>
  <div class="payment-frequency">
    <h3>{{ t('simulator.paymentFrequency') }}</h3>
    <div class="frequency-options">
      <label class="frequency-option">
        <input
          type="radio"
          name="frequency"
          value="monthly"
          :checked="modelValue === 'monthly'"
          @change="$emit('update:modelValue', 'monthly')"
        />
        <span>{{ t('simulator.monthly') }}</span>
      </label>

      <label class="frequency-option">
        <input
          type="radio"
          name="frequency"
          value="annual"
          :checked="modelValue === 'annual'"
          @change="$emit('update:modelValue', 'annual')"
        />
        <span>{{ t('simulator.annual') }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: String,
    default: 'monthly'
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.payment-frequency {
  margin-top: 1.5rem;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.frequency-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.frequency-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
}

.frequency-option input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--vt-c-indigo);
}

.frequency-option span {
  font-size: 0.95rem;
  color: var(--color-text);
}
</style>
