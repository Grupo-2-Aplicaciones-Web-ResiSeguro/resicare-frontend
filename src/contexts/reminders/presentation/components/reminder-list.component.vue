<template>
  <section>
    <h3>{{ t('reminders.activeReminders') }}</h3>

    <div v-if="loading" class="text-gray-500">
      {{ t('reminders.loading') || 'Cargando recordatorios...' }}
    </div>

    <div v-else-if="reminders.length">
      <reminder-item
          v-for="r in reminders"
          :key="r.id"
          :reminder="r"
          @delete="deleteReminder"
      />
    </div>

    <p v-else>{{ t('reminders.noReminders') }}</p>

    <button class="add-btn" @click="$router.push('/reminders/new')">
      {{ t('reminders.addReminder') }}
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ReminderItem from './reminder-item.component.vue'
import { ReminderStorageService } from '../../infrastructure/reminder-storage.service.js'
import { http } from '@/shared-kernel/infrastructure/http/http.js'

const { t } = useI18n() // ✅ Importante: define t() para las traducciones

const reminders = ref([])
const loading = ref(true)

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
    if (token.split('.').length === 3) {
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

async function loadReminders() {
  loading.value = true
  try {
    const res = await http.get('/reminders')
    const userId = getCurrentUserId()
    reminders.value = res.data.filter(r => r.userId && String(r.userId) === String(userId))
  } catch (e) {
    const userId = getCurrentUserId()
    reminders.value = ReminderStorageService.getAll().filter(r => r.userId && String(r.userId) === String(userId))
  }
  loading.value = false
}

function deleteReminder(id) {
  if (confirm(t('reminders.confirmDelete') || '¿Estás seguro de eliminar este recordatorio?')) {
    http.delete(`/reminders/${id}`).catch(() => {})
    ReminderStorageService.delete(id)
    loadReminders()
  }
}

onMounted(loadReminders)
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
