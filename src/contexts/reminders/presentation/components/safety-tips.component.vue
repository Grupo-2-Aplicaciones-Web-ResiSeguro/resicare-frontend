<template>
  <section>
    <h3>{{ t('reminders.safetyTips') }}</h3>
    <ul>
      <li>📞 {{ t('reminders.tip1') }}</li>
      <li>🏠 {{ t('reminders.tip2') }}</li>
      <li>🪖 {{ t('reminders.tip3') }}</li>
    </ul>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
h3 {
  margin-top: 2rem;
}
li {
  list-style: none;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

