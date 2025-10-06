<template>
  <section>
    <h3>Recordatorios Activos</h3>

    <div v-if="loading" class="text-gray-500">Cargando recordatorios...</div>

    <div v-else-if="reminders.length">
      <reminder-item
          v-for="r in reminders"
          :key="r.id"
          :reminder="r"
          @delete="deleteReminder"
      />
    </div>

    <p v-else>No tienes recordatorios activos.</p>

    <button class="add-btn" @click="$router.push('/reminders/new')">
      Agregar recordatorio
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ReminderItem from './reminder-item.component.vue';
import { ReminderStorageService } from '../../infrastructure/reminder-storage.service.js';
import { http } from '@/shared-kernel/infrastructure/http/http.js';

const reminders = ref([]);
const loading = ref(true);

async function loadReminders() {
  loading.value = true;
  try {
    const res = await http.get('/reminders');
    reminders.value = res.data;
  } catch (e) {
    reminders.value = ReminderStorageService.getAll();
  }
  loading.value = false;
}

function deleteReminder(id) {
  if (confirm('¿Estás seguro de eliminar este recordatorio?')) {
    http.delete(`/reminders/${id}`).catch(() => {});
    ReminderStorageService.delete(id);
    loadReminders();
  }
}

onMounted(loadReminders);
</script>

<style scoped>
h3 {
  margin-bottom: 0.5rem;
}
.add-btn {
  margin-top: 1rem;
  width: 100%;
  background-color: #1e3a8a;
  color: white;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
</style>
