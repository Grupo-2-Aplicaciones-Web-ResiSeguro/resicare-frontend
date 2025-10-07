<template>
  <div class="insured-objects">
    <h3>{{ t('simulator.chooseRegisteredObject') }}</h3>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="object-select"
    >
      <option value="" disabled>{{ t('simulator.objectPlaceholder') }}</option>
      <option
        v-for="obj in registeredObjects"
        :key="obj"
        :value="obj"
      >
        {{ obj }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  registeredObjects: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.insured-objects {
  margin-top: 1.5rem;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.object-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  color: var(--color-text);
}
</style>
