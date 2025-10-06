<template>
  <div class="form-group">
    <label for="description">{{ $t('claims.briefDescription') }}</label>
    <pv-textarea
      id="description"
      v-model="localValue"
      class="form-control"
      :placeholder="$t('claims.descriptionPlaceholder')"
      rows="4"
      auto-resize
    />
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
</style>
