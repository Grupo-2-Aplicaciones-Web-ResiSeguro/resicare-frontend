<script setup lang="ts">
defineProps<{
  scheduled: Array<any>,
  loading: boolean,
  error: string | null,
  formatService: (key: string) => string,
  formatDateTime: (date: string, time: string) => string
}>()
</script>

<template>
  <div v-if="loading" class="status">Cargando consultas agendadas...</div>
  <div v-else-if="error" class="status error">Error: {{ error }}</div>
  <div v-else>
    <div v-if="scheduled.length">
      <ul class="consultation-list">
        <li v-for="c in scheduled" :key="c.id" class="consultation-item">
          <div class="left">
            <div class="service">{{ formatService(c.service) }}</div>
            <div class="datetime">{{ formatDateTime(c.date, c.time) }}</div>
          </div>
          <div class="right">
            <p class="description">{{ c.description || '-' }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="no-items">
      No hay consultas agendadas.
    </div>
  </div>
</template>

<style scoped>
.status {
  text-align: center;
  color: #6b7280;
  margin: 1rem 0;
}
.status.error {
  color: #c53030;
}
.consultation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.consultation-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--card-bg, #fff);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  align-items: center;
}
.consultation-item .left {
  display: flex;
  flex-direction: column;
}
.service {
  font-weight: 600;
  color: var(--color-heading, #111827);
}
.datetime {
  color: #6b7280;
  font-size: 0.95rem;
}
.description {
  color: #374151;
  text-align: right;
  max-width: 420px;
  word-break: break-word;
}
.no-items {
  text-align: center;
  color: #6b7280;
  padding: 1rem 0;
}
</style>