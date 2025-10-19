<template>
  <section class="profile-page">
    <header class="page-header">
      <!-- usar mismo estilo/back-btn que reminders.page.vue y navegar a /home -->
      <pv-button icon="pi pi-arrow-left" class="back-btn" @click="$router.push('/home')" :label="t('common.back')" />
      <h1 class="page-title">{{ t('iam.profile.viewTitle') || t('iam.common.appName') }}</h1>
    </header>

    <div v-if="loading" class="loading">{{ t('iam.profile.loading') || 'Cargando perfil...' }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <profile-view :profile="profile" @edit="goToEdit" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ProfileApiService } from '@/contexts/profiles/infraestructure/profile-api.service.js'
import { ProfileAssembler } from '@/contexts/profiles/Domain/profile.assembler.js'
import ProfileView from '../components/profile-view.component.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const api = new ProfileApiService()

const profile = ref(null)
const loading = ref(true)
const error = ref(null)

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

onMounted(async () => {
  loading.value = true
  try {
    const paramId = route.params.userId
    const userId = paramId || getCurrentUserId()
    if (!userId) {
      error.value = t('iam.profile.notFound') || 'Perfil no encontrado'
      return
    }
    const resp = await api.getByUserId(userId)
    const data = resp?.data ?? resp
    const resource = Array.isArray(data) ? data[0] : data
    if (!resource) {
      error.value = t('iam.profile.notFound') || 'Perfil no encontrado'
      return
    }
    profile.value = ProfileAssembler.toEntityFromResource ? ProfileAssembler.toEntityFromResource(resource) : resource
  } catch (e) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})

function goToEdit() {
  const id = route.params.userId || getCurrentUserId() || ''
  router.push({ path: `/profile/${id}/edit` })
}
</script>

<style scoped>
.profile-page {
  max-width: 980px;
  margin: 18px auto;
  padding: 12px;
}
.page-header {
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:16px;
  padding:8px 0;
  border-bottom: 1px solid rgba(15,23,42,0.04);
}
.page-title { margin:0; font-size:1.25rem; font-weight:700; color:#0f172a; }
.loading { color:#64748b; padding:12px; }
.error { color:#c53030; padding:12px; }
/* estilo igual al usado en reminders.page.vue */
.back-btn {
  background: none;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0;
}
.back-btn:hover { text-decoration: underline; }
</style>
