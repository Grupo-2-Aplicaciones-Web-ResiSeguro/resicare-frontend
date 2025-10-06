<template>
  <div class="container">
    <header class="page-header">
      <button class="back-btn" @click="$router.push('/reminders')">← Back</button>
      <h1>Nuevo Recordatorio</h1>
    </header>

    <reminder-form />
  </div>
</template>

<script setup>
import ReminderForm from '../components/reminder-form.component.vue'
</script>

<style scoped>
.container {
  padding: 1.5rem;
  max-width: 700px;
  margin: 0 auto;
  color: var(--color-text, #fff);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.back-btn {
  background: none;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0;
}

.back-btn:hover {
  text-decoration: underline;
}

h1 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}
</style>

