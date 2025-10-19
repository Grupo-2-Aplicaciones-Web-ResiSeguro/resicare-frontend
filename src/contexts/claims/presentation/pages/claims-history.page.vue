<template>
  <section class="claims-history-page">
    <header class="page-header">
      <pv-button class="back-btn" icon="pi pi-arrow-left" :label="t('common.back')" @click="$router.push('/home')" />
      <h1>{{ t('claims.historyTitle') }}</h1>
    </header>

    <div v-if="loading" class="loading">{{ t('common.loading') }}...</div>

    <div v-else>
      <div v-if="claims.length" class="claims-list">
        <div v-for="c in claims" :key="c.id" class="claim-card">
          <div class="claim-header">
            <div class="claim-left">
              <div class="claim-info">
                <div class="claim-number">{{ c.number || c.id }}</div>
                <div class="claim-type">{{ getTypeLabel(c.type) }}</div>
              </div>
            </div>
            <div class="claim-right">
              <span class="claim-status" :class="`status-${c.status}`">{{ getStatusLabel(c.status) }}</span>
            </div>
          </div>

          <div class="claim-body">
            <p><strong>{{ t('claims.incidentDate') }}:</strong> {{ formatDate(c.incidentDate) }}</p>
            <p><strong>{{ t('claims.description') }}:</strong> {{ c.description }}</p>
          </div>

          <div class="claim-actions">
            <pv-button :label="t('claims.viewDetails')" icon="pi pi-eye" class="btn-outline" @click="viewDetails(c.id)" />
            <div class="rating" v-if="c.status === 'approved' || c.status === 'rejected'">
              <span v-for="n in 5" :key="n" class="star" :class="{ active: (c.rating||0) >= n }" @click="rate(c, n)">★</span>
            </div>
          </div>
        </div>
      </div>

      <pv-message v-else severity="info">{{ t('claims.historyEmpty') }}</pv-message>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ClaimApiService } from '../../infraestructure/claim-api.service.js'
import { ClaimAssembler } from '../../Domain/claim.assembler.js'

const { t } = useI18n()
const router = useRouter()
const api = new ClaimApiService()

const claims = ref([])
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
    const token = localStorage.getItem('accessToken_v1') || localStorage.getItem('token')
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
    return null
  } catch {
    return null
  }
}

async function loadHistory() {
  loading.value = true
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      claims.value = []
      loading.value = false
      return
    }
    const resp = await api.getByUserId(userId)
    if (resp && resp.status >= 200 && resp.status < 300) {
      const all = ClaimAssembler.toEntitiesFromResponse(resp)
      claims.value = (all || []).filter(c => c.status === 'approved' || c.status === 'rejected')
    } else {
      claims.value = []
    }
  } catch (e) {
    console.error('Error loading history:', e)
    claims.value = []
  } finally {
    loading.value = false
  }
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString()
}

function getTypeLabel(type) {
  const types = {
    accident: t('claims.accident'),
    theft: t('claims.theft'),
    loss: t('claims.loss'),
    damage: t('claims.damage')
  }
  return types[type] || type
}

function getStatusLabel(status) {
  const statuses = {
    pending: t('claims.statusPending'),
    in_review: t('claims.statusInReview'),
    approved: t('claims.statusApproved'),
    rejected: t('claims.statusRejected')
  }
  return statuses[status] || status
}

function viewDetails(id) {
  router.push({ path: `/claims/${id}` })
}

async function rate(claim, value) {
  try {
    await api.rate(claim.id, value)
    // actualizar rating localmente para reflejar cambio
    claim.rating = value
    alert(t('claims.ratingSaved'))
  } catch (e) {
    console.error('Error rating claim', e)
    alert(t('claims.ratingFailed'))
  }
}

onMounted(loadHistory)
</script>

<style scoped>
/* estilos básicos reusados de claims-list */
.claims-history-page { max-width: 900px; margin: 0 auto; padding: 1.5rem; }
.page-header { margin-bottom: 1.5rem; display:flex; align-items:center; gap:1rem; }
.page-header h1 { font-size:1.5rem; color:var(--vt-c-indigo); margin:0; }

.claim-card { border:1px solid #ddd; border-radius:10px; padding:1rem; margin-bottom:1rem; background:#fff; }
.claim-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; }
.claim-number { font-weight:700; color:var(--vt-c-indigo); }
.claim-status { padding:0.25rem 0.5rem; border-radius:12px; font-weight:600; }
.rating .star { cursor:pointer; font-size:1.2rem; color:#ddd; margin-left:6px; }
.rating .star.active { color: #f59e0b; }
</style>
