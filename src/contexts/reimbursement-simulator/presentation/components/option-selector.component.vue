<template>
  <fieldset class="option-selector">
    <legend :id="legendId">{{ legend }}</legend>
    <div
        :class="['options-container', { 'radio-style': radioStyle }]"
        role="radiogroup"
        :aria-labelledby="legendId"
        aria-required="true"
    >
      <!-- Button style (default) -->
      <template v-if="!radioStyle">
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="option-button"
            :class="{ active: modelValue === option.value }"
            role="radio"
            :aria-checked="modelValue === option.value ? 'true' : 'false'"
            :aria-label="option.label"
            @click="$emit('update:modelValue', option.value)"
        >
          {{ option.label }}
        </button>
      </template>

      <!-- Radio style -->
      <template v-else>
        <label
            v-for="option in options"
            :key="option.value"
            class="option-radio"
        >
          <input
              type="radio"
              :name="legendId"
              :value="option.value"
              :checked="modelValue === option.value"
              :aria-label="option.label"
              @change="$emit('update:modelValue', option.value)"
          />
          <span>{{ option.label }}</span>
        </label>
      </template>
    </div>
  </fieldset>
</template>

<script setup>
// English comment: generic option selector; supports button style and radio style
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  legend: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(opt => opt.value && opt.label)
    }
  },
  radioStyle: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const legendId = computed(() => {
  // generate stable id for accessibility
  return `legend-${props.legend.toLowerCase().replace(/\s+/g, '-')}`
})
</script>

<style scoped>
.option-selector {
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

.options-container {
  margin-top: 0.5rem;
}

/* Button style layout */
.options-container:not(.radio-style) {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.option-button {
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

.option-button:hover {
  border-color: var(--vt-c-indigo);
  color: var(--vt-c-indigo);
}

.option-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.option-button.active {
  background: var(--vt-c-indigo);
  color: white;
  border-color: var(--vt-c-indigo);
}

/* Radio style layout */
.options-container.radio-style {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-radio {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.option-radio:hover {
  background: var(--color-background-soft);
  border-color: var(--vt-c-indigo);
}

.option-radio input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--vt-c-indigo);
}

.option-radio span {
  font-size: 0.95rem;
  color: var(--color-text);
}
</style>