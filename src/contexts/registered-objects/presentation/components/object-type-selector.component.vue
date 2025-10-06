<template>
  <div class="form-group">
    <label for="object-type">{{ $t('registerObject.objectType') }}</label>
    <div class="type-buttons">
      <pv-button
        v-for="type in objectTypes"
        :key="type.value"
        :label="type.label"
        :class="['type-button', { 'p-button-outlined': localValue !== type.value }]"
        :severity="localValue === type.value ? 'primary' : 'secondary'"
        @click="selectType(type.value)"
      />
    </div>
    <p class="help-text">{{ $t('registerObject.selectObjectType') }}</p>
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

const objectTypes = computed(() => [
  { label: t('registerObject.electronic'), value: 'electronico' },
  { label: t('registerObject.suitcase'), value: 'maleta' },
  { label: t('registerObject.books'), value: 'libros' },
  { label: t('registerObject.supplies'), value: 'utiles' },
  { label: t('registerObject.others'), value: 'otros' }
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

.help-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
