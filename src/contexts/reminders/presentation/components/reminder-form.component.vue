<template>
  <form @submit.prevent="saveReminder" class="reminder-form">
    <div class="form-group">
      <label>{{ t('reminders.form.name') }}</label>
      <input v-model="title" required :placeholder="t('reminders.form.placeholderName')" />
    </div>

    <div class="form-group">
      <label>{{ t('reminders.form.type') }}</label>
      <div class="types">
        <button
            v-for="tItem in types"
            :key="tItem"
            type="button"
            :class="{ active: type === tItem }"
            @click="type = tItem"
            :aria-pressed="type === tItem"
        >
          {{ t(`reminders.types.${tItem}`) }}
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>{{ t('reminders.form.date') }}</label>
      <input type="date" v-model="date" required />
    </div>

    <div class="form-group">
      <label>{{ t('reminders.form.time') }}</label>
      <input type="time" v-model="time" required />
    </div>

    <div class="form-group">
      <label>{{ t('reminders.form.notes') }}</label>
      <textarea v-model="notes" :placeholder="t('reminders.form.placeholderNotes')"></textarea>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="infoMessage" class="info-message">{{ infoMessage }}</p>

    <button type="submit" class="save-btn">{{ t('reminders.form.save') }}</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Reminder } from '../../domain/reminder.entity.js'
import { ReminderStorageService } from '../../infrastructure/reminder-storage.service.js'
import { useRouter } from 'vue-router'
import { http } from '@/shared-kernel/infrastructure/http/http.js'

const router = useRouter()
const { t } = useI18n()

const title = ref('')
const type = ref('')
const date = ref('')
const time = ref('')
const notes = ref('')
const types = ['medicación', 'chequeo', 'pago', 'prevención', 'seguridad']
const errorMessage = ref('')
const infoMessage = ref('')

function createId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch (e) {}
  return `r-${Date.now()}`
}

function validate() {
  if (!title.value || !type.value || !date.value || !time.value) {
    errorMessage.value = t('reminders.errors.requiredFields')
    return false
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date.value)) {
    errorMessage.value = t('reminders.errors.invalidDate')
    return false
  }
  if (!/^\d{2}:\d{2}$/.test(time.value)) {
    errorMessage.value = t('reminders.errors.invalidTime')
    return false
  }
  errorMessage.value = ''
  return true
}

async function saveReminder() {
  if (!validate()) return

  const id = createId()
  const reminderObj = new Reminder({
    id,
    title: title.value.trim(),
    type: type.value,
    date: date.value,
    time: time.value,
    notes: notes.value.trim(),
    createdAt: new Date().toISOString(),
  })

  ReminderStorageService.create(reminderObj)

  try {
    await http.post('/reminders', reminderObj)
  } catch (e) {
    errorMessage.value = t('reminders.errors.serverSave')
  }

  infoMessage.value = t('reminders.messages.created')
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
