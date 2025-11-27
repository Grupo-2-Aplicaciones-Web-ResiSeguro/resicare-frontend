<template>
  <div class="form-actions">
    <pv-button
        type="submit"
        class="btn-primary"
        @click="handleSubmit"
        :disabled="!isValid"
        :aria-disabled="!isValid ? 'true' : 'false'"
        aria-label="Submit teleconsultation appointment"
    >
      {{ t('teleconsultations.submit') }}
    </pv-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  consultation: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['submit'])

const isValid = computed(() => {
  return !!(
      props.consultation.service &&
      props.consultation.date &&
      props.consultation.time
  )
})

function handleSubmit() {
  if (isValid.value) {
    emit('submit', props.consultation)
  }
}
</script>

<style scoped>
.btn-primary {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 6px;
  background: var(--vt-c-indigo);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--vt-c-indigo-dark);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>