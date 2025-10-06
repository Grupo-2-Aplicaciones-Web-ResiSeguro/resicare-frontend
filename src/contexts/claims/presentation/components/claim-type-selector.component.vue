<template>
  <div class="form-group">
    <label for="claim-type">{{ $t('claims.claimType') }}</label>
    <div class="type-buttons">
      <pv-button
        v-for="type in claimTypes"
        :key="type.value"
        :label="type.label"
        :class="['type-button', { 'p-button-outlined': localValue !== type.value }]"
        :severity="localValue === type.value ? 'primary' : 'secondary'"
        @click="selectType(type.value)"
      />
    </div>
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

const claimTypes = computed(() => [
  { label: t('claims.accident'), value: 'accidente' },
  { label: t('claims.theft'), value: 'robo' },
  { label: t('claims.loss'), value: 'perdida' },
  { label: t('claims.damage'), value: 'danos' }
])

const selectType = (value) => {
  localValue.value = value
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.type-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-button {
  flex: 1;
  min-width: 100px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
</style>
