<template>
  <form @submit.prevent="saveReminder" class="reminder-form">
    <div class="form-group">
      <label>{{ t('reminders.form.name') }}</label>
      <pv-input-text v-model="title" required :placeholder="t('reminders.form.placeholderName')" />
    </div>

    <div class="form-group">
      <label>{{ t('reminders.form.type') }}</label>
      <div class="types">
        <pv-button
          v-for="tItem in types"
          :key="tItem"
          type="button"
          :class="{ active: type === tItem }"
          @click="type = tItem"
          :aria-pressed="type === tItem"
          :label="t(`reminders.types.${tItem}`)"
        />
      </div>
    </div>

    <div class="form-group">
      <label>{{ t('reminders.form.date') }}</label>
      <pv-date-picker v-model="date" :minDate="minDate" :showIcon="true" :placeholder="t('reminders.form.placeholderDate')" />
    </div>

    <div class="form-group">
      <label>{{ t('reminders.form.time') }}</label>
      <pv-input-text type="time" v-model="time" required />
    </div>

    <div class="form-group">
      <label>{{ t('reminders.form.notes') }}</label>
      <pv-textarea v-model="notes" :placeholder="t('reminders.form.placeholderNotes')" />
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="infoMessage" class="info-message">{{ infoMessage }}</p>

    <pv-button type="submit" class="save-btn" :label="t('reminders.form.save')" />
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Reminder } from '../../Domain/reminder.entity.js'
import { ReminderApiService } from '../../infrastructure/reminder-api.service.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const title = ref('')
const type = ref('')
const date = ref(null)
const time = ref('')
const notes = ref('')
const types = ['medicación', 'chequeo', 'pago', 'prevención', 'seguridad']
const errorMessage = ref('')
const infoMessage = ref('')
const api = new ReminderApiService()

const minDate = computed(() => {
  const d = new Date()
  d.setHours(0,0,0,0)
  return d
})

function formatDateToYYYYMMDD(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function validate() {
  if (!title.value || !type.value || !date.value || !time.value) {
    errorMessage.value = t('reminders.errors.requiredFields') || 'Faltan campos requeridos'
    return false
  }

  // time validation HH:MM
  if (!/^\d{2}:\d{2}$/.test(time.value)) {
    errorMessage.value = t('reminders.errors.invalidTime') || 'Formato de hora inválido'
    return false
  }

  // Construir datetime con la fecha elegida y la hora
  try {
    const chosenDate = new Date(date.value)
    const [hh, mm] = time.value.split(':').map(n => parseInt(n, 10))
    chosenDate.setHours(hh, mm, 0, 0)

    const now = new Date()
    if (isNaN(chosenDate.getTime())) {
      errorMessage.value = t('reminders.errors.invalidDateTime') || 'Fecha u hora inválida'
      return false
    }
    if (chosenDate < now) {
      errorMessage.value = t('reminders.errors.pastDate') || 'No puedes crear recordatorios en el pasado'
      return false
    }
  } catch (e) {
    errorMessage.value = t('reminders.errors.invalidDateTime') || 'Fecha u hora inválida'
    return false
  }

  errorMessage.value = ''
  return true
}

function getCurrentUserId() {
  try {
    const currentUserRaw = localStorage.getItem('currentUser')
    if (currentUserRaw) {
      try {
        const parsed = JSON.parse(currentUserRaw)
        const candidate = parsed.id ?? parsed.userId ?? parsed.sub ?? parsed.uid ?? null
        if (candidate) return String(candidate)
      } catch {}
    }
    const token = localStorage.getItem('accessToken_v1')
    if (!token) return null
    if (token.split && token.split('.').length === 3) {
      try {
        const payloadB64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const pad = payloadB64.length % 4
        const padded = pad ? payloadB64 + '='.repeat(4 - pad) : payloadB64
        const payloadJson = decodeURIComponent(
            Array.prototype.map.call(atob(padded), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        )
        const payload = JSON.parse(payloadJson)
        const candidate = payload.sub ?? payload.id ?? payload.userId ?? payload.uid ?? null
        if (candidate) return String(candidate)
      } catch {}
    }
    return String(token)
  } catch {
    return null
  }
}

async function saveReminder() {
  if (!validate()) return

  const userIdRaw = getCurrentUserId()
  if (!userIdRaw) {
    errorMessage.value = t('reminders.errors.loginRequired') || 'Debes iniciar sesión para crear un recordatorio'
    return
  }

  const userIdNum = Number(userIdRaw)
  if (Number.isNaN(userIdNum)) {
    errorMessage.value = t('reminders.errors.invalidUserId') || 'UserId inválido'
    return
  }

  // No forzar id en cliente: omitimos id para que json-server genere un id numérico
  const dateStr = formatDateToYYYYMMDD(new Date(date.value))

  const reminderObj = {
    // id: omitido a propósito para que DB asigne id numérico
    title: title.value.trim(),
    type: type.value,
    date: dateStr,
    time: time.value,
    notes: notes.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: userIdNum // envío como número
  }

  try {
    await api.create(reminderObj)
  } catch (e) {
    errorMessage.value = t('reminders.errors.serverSave') || 'Error guardando en el servidor'
    return
  }

  infoMessage.value = t('reminders.messages.created') || 'Recordatorio creado'
  setTimeout(() => {
    router.push('/reminders')
  }, 250)
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

/* for native p-button (pv-button) inside .types: make them visible by default */
.types .p-button {
  margin-right: 8px;
  margin-top: 4px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 10px;
  background-color: #f8fafc;
  color: #0f172a;
  cursor: pointer;
  box-shadow: none;
}
.types .p-button:hover {
  background-color: #eef2ff;
}
.types .p-button.active {
  background-color: #16a34a !important;
  color: #ffffff !important;
  border-color: #16a34a !important;
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
