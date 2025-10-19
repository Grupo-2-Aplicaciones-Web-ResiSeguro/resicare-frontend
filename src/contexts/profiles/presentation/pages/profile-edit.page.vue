<template>
  <section class="profile-edit-page">
    <header class="page-header">
      <!-- usar mismo estilo/back-btn que reminders.page.vue y navegar a /home -->
      <pv-button icon="pi pi-arrow-left" class="back-btn" @click="$router.push('/profile')" :label="t('common.back')" />
      <h1>{{ t('iam.profile.editTitle') || 'Editar perfil' }}</h1>
    </header>

    <div v-if="loading">{{ t('iam.profile.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <profile-form :initialProfile="profile" @saved="onSaved" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProfileForm from '../components/profile-form.component.vue'
import { ProfileApiService } from '@/contexts/profiles/infraestructure/profile-api.service.js'
import { ProfileAssembler } from '@/contexts/profiles/Domain/profile.assembler.js'

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

    // intentar getByUserId y fallback a getById
    let resp
    try {
      resp = typeof api.getByUserId === 'function' ? await api.getByUserId(userId) : await api.getById(userId)
    } catch (e) {
      resp = await api.getById(userId)
    }

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

function onSaved() {
  const id = route.params.userId || getCurrentUserId() || ''
  router.push({ path: `/profile/${id}` })
}
</script>

<style scoped>
.profile-edit-page{ max-width:720px; margin:0 auto; padding:1rem; }
.page-header{ display:flex; gap:1rem; align-items:center; margin-bottom:1rem; }
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
.error{ color:#c53030; }
</style>
