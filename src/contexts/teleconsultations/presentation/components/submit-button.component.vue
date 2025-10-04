<template>
  <div class="form-actions">
    <pv-button type="button" class="btn-primary" @click="$emit('submit', consultation)">
      {{ t('teleconsultations.submit') }}
    </pv-button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  consultation: {
    type: Object,
    required: true
  }
})
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
}
</style>
