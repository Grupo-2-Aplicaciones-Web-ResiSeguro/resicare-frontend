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

    <pv-button class="add-btn" @click="$router.push('/reminders/new')" :label="t('reminders.addReminder')" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ReminderItem from './reminder-item.component.vue'
import { ReminderApiService } from '../../infrastructure/reminder-api.service.js'

const api = new ReminderApiService()

const { t } = useI18n()

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
    const userIdRaw = getCurrentUserId()
    if (!userIdRaw) {
      reminders.value = []
      loading.value = false
      return
    }
    const userIdNum = Number(userIdRaw)
    if (Number.isNaN(userIdNum)) {
      reminders.value = []
      loading.value = false
      return
    }

    const res = await api.getByUserId(userIdNum)
    const data = (res && res.data) ? res.data : []
    reminders.value = Array.isArray(data) ? data.filter(r => Number(r.userId) === userIdNum) : []
  } catch (e) {
    reminders.value = []
  }
  loading.value = false
}

async function deleteReminder(id) {
  if (!confirm(t('reminders.confirmDelete') || '¿Estás seguro de eliminar este recordatorio?')) return
  try {
    await api.delete(id)
  } catch (e) {
    alert(t('reminders.errors.deleteFailed') || 'Error eliminando recordatorio')
  } finally {
    await loadReminders()
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
