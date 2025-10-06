

<template>
  <form @submit.prevent="saveReminder">
    <div class="form-group">
      <label>Nombre del Recordatorio</label>
      <input v-model="title" required placeholder="Ej. Revisar botiquín" />
    </div>

    <div class="form-group">
      <label>Tipo de Recordatorio</label>
      <div class="types">
        <button
            v-for="t in types"
            :key="t"
            type="button"
            :class="{ active: type === t }"
            @click="type = t"
        >{{ t }}</button>
      </div>
    </div>

    <div class="form-group">
      <label>Fecha</label>
      <input type="date" v-model="date" required />
    </div>

    <div class="form-group">
      <label>Hora</label>
      <input type="time" v-model="time" required />
    </div>

    <div class="form-group">
      <label>Notas adicionales</label>
      <textarea v-model="notes" placeholder="Detalles adicionales..."></textarea>
    </div>

    <button type="submit" class="save-btn">Guardar Recordatorio</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { Reminder } from '../../Domain/reminder.entity.js';
import { ReminderStorageService } from '../../infrastructure/reminder-storage.service.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const title = ref('');
const type = ref('');
const date = ref('');
const time = ref('');
const notes = ref('');
const types = ['medicación', 'chequeo', 'pago', 'prevención', 'seguridad'];

function saveReminder() {
  if (!title.value || !type.value || !date.value || !time.value) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  const reminder = new Reminder(Date.now(), title.value, type.value, date.value, time.value, notes.value);
  ReminderStorageService.save(reminder);
  router.push('/reminders');
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.types button {
  margin-right: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  background: none;
  cursor: pointer;
}
.active {
  background-color: #16a34a;
  color: white;
}
.save-btn {
  width: 100%;
  padding: 10px;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
