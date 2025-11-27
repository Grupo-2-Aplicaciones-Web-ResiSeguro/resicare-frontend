<template>
  <div class="form-group">
    <label
        id="description-label"
        for="description"
    >
      {{ $t('claims.briefDescription') }}
    </label>
    <pv-textarea
        id="description"
        v-model="localValue"
        class="form-control"
        :placeholder="$t('claims.descriptionPlaceholder')"
        rows="4"
        auto-resize
        :maxlength="500"
        aria-labelledby="description-label"
        aria-required="true"
        aria-describedby="description-hint"
    />
    <span
        id="description-hint"
        class="hint-text"
    >
      {{ $t('claims.descriptionHint') }} ({{ localValue.length }}/500)
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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