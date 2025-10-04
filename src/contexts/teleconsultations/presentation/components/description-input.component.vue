<template>
  <div class="form-group">
    <label for="description">{{ t('teleconsultations.description') }}</label>
    <pv-input-text
      id="description"
      v-model="localValue"
      class="form-control"

      textarea
      rows="4"
    />
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
