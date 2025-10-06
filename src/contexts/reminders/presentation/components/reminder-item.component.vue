<template>
  <div class="reminder-item">
    <div class="icon" aria-hidden="true">{{ emoji }}</div>

    <div class="details">
      <p class="title">{{ reminder.title }}</p>
      <p class="subtitle">{{ formattedDate }}</p>
      <p v-if="reminder.notes" class="notes">{{ reminder.notes }}</p>
    </div>

    <button class="delete-btn" @click="$emit('delete', reminder.id)" aria-label="Eliminar recordatorio">
      🗑️
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ reminder: Object });

const emoji = computed(() => {
  const map = {
    medicación: "💊",
    chequeo: "🩺",
    pago: "💰",
    prevención: "🛡️",
    seguridad: "🚨"
  };
  return map[props.reminder.type] || "🗓️";
});

const formattedDate = computed(() => {
  if (!props.reminder.date) return '';
  const t = props.reminder.time || '';
  return `${props.reminder.date}${t ? ' – ' + t : ''}`;
});
</script>

<style scoped>
.reminder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
.icon {
  font-size: 1.6rem;
}
.details {
  flex-grow: 1;
}
.title {
  font-weight: 600;
}
.subtitle {
  color: #666;
  font-size: 0.9rem;
}
.notes {
  color: #444;
  font-size: 0.95rem;
  margin-top: 2px;
  white-space: pre-line;
}
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #c53030;
}
.delete-btn:hover {
  transform: scale(1.1);
}
</style>
