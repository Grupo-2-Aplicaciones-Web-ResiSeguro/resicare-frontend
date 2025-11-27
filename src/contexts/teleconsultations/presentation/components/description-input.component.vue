<template>
  <div class="form-group">
    <label
        id="description-label"
        for="description"
    >
      {{ t('teleconsultations.description') }}
    </label>
    <pv-input-text
        id="description"
        v-model="localValue"
        class="form-control"
        textarea
        rows="4"
        :placeholder="t('teleconsultations.descriptionPlaceholder')"
        aria-labelledby="description-label"
        aria-describedby="description-hint"
        :maxlength="500"
        :aria-invalid="localValue.length > 500 ? 'true' : 'false'"
    />
    <span
        id="description-hint"
        class="hint-text"
    >
      {{ t('teleconsultations.descriptionHint') }} ({{ localValue.length }}/500)
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
</script>

<style scoped>
.hint-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
  display: block;
}
</style>