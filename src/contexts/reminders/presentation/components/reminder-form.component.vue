<template>
  <form @submit.prevent="saveReminder" class="reminder-form">
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
            :aria-pressed="type === t"
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

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="infoMessage" class="info-message">{{ infoMessage }}</p>

    <button type="submit" class="save-btn">Guardar Recordatorio</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { Reminder } from '../../domain/reminder.entity.js';
import { ReminderStorageService } from '../../infrastructure/reminder-storage.service.js';
import { useRouter } from 'vue-router';
import { http } from '@/shared-kernel/infrastructure/http/http.js'; // <-- importar http

const router = useRouter();
const title = ref('');
const type = ref('');
const date = ref('');
const time = ref('');
const notes = ref('');
const types = ['medicación', 'chequeo', 'pago', 'prevención', 'seguridad'];
const errorMessage = ref('');
const infoMessage = ref('');

function createId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch (e) {}
  return `r-${Date.now()}`;
}

function validate() {
  if (!title.value || !type.value || !date.value || !time.value) {
    errorMessage.value = 'Por favor completa todos los campos obligatorios.';
    return false;
  }
  // basic date/time sanity check
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date.value)) {
    errorMessage.value = 'Formato de fecha inválido.';
    return false;
  }
  if (!/^\d{2}:\d{2}$/.test(time.value)) {
    errorMessage.value = 'Formato de hora inválido.';
    return false;
  }
  errorMessage.value = '';
  return true;
}

async function saveReminder() {
  if (!validate()) return;

  const id = createId();
  const reminderObj = new Reminder({
    id,
    title: title.value.trim(),
    type: type.value,
    date: date.value,
    time: time.value,
    notes: notes.value.trim(),
    createdAt: new Date().toISOString()
  });

  // Guardar en localStorage
  ReminderStorageService.create(reminderObj);

  // Guardar en backend (json-server)
  try {
    await http.post('/reminders', reminderObj);
  } catch (e) {
    // Si falla, igual lo tienes en localStorage, pero muestra error si quieres
    errorMessage.value = 'No se pudo guardar en el servidor, solo local.';
  }

  infoMessage.value = 'Recordatorio creado.';
  // pequeño delay para ver el mensaje y luego navegar
  setTimeout(() => {
    router.push('/reminders');
  }, 250);
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
.error-message {
  color: #c53030;
  margin-bottom: 0.5rem;
}
.info-message {
  color: #16a34a;
  margin-bottom: 0.5rem;
}
</style>
