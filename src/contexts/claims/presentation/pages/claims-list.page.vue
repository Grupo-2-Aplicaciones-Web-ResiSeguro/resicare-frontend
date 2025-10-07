<template>
  <section class="claims-list-page">
    <header class="page-header">
      <button class="back-btn" type="button" @click="goBack">
        ← {{ $t('common.back') }}
      </button>
      <h1>{{ $t('claims.title') || 'My Claims' }}</h1>
    </header>

    <div v-if="loading" class="loading">
      {{ $t('common.loading') || 'Loading' }}...
    </div>

    <div v-else>
      <div v-if="claims.length > 0" class="claims-list">
        <div v-for="claim in claims" :key="claim.id" class="claim-card">
          <div class="claim-header">
            <div class="claim-left">
              <div class="icon">
                <img src="/images/id.png" alt="claim-icon" />
              </div>
              <div class="claim-info">
                <div class="claim-number">{{ claim.number }}</div>
                <div class="claim-type">{{ getTypeLabel(claim.type) }}</div>
              </div>
            </div>
            <div class="claim-right">
              <span class="claim-status" :class="`status-${claim.status}`">
                {{ getStatusLabel(claim.status) }}
              </span>
            </div>
          </div>

          <div class="claim-body">
            <p><strong>{{ $t('claims.incidentDate') }}:</strong> {{ formatDate(claim.incidentDate) }}</p>
            <p><strong>{{ $t('claims.description') }}:</strong> {{ claim.description }}</p>
          </div>

          <div class="claim-actions">
            <pv-button
              :label="$t('claims.viewDetails') || 'View Details'"
              icon="pi pi-eye"
              class="btn-outline"
              @click="viewDetails(claim.id)"
            />
          </div>
        </div>
      </div>

      <pv-message v-else severity="info" class="no-claims-message">
        {{ $t('myclaims.noClaims') || 'No claims found' }}
      </pv-message>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ClaimApiService } from '../../infraestructure/claim-api.service.js'
import { ClaimAssembler } from '../../Domain/claim.assembler.js'

const { t } = useI18n()
const router = useRouter()
const claims = ref([])
const loading = ref(true)
const api = new ClaimApiService()

async function loadClaims() {
  try {
    const userId = localStorage.getItem('accessToken_v1') || '1'
    const response = await api.getByUserId(userId)

    if (response.status === 200) {
      claims.value = ClaimAssembler.toEntitiesFromResponse(response)
    }
  } catch (error) {
    console.error('Error loading claims:', error)
  } finally {
    loading.value = false
  }
}

function viewDetails(id) {
  router.push({ path: `/claims/${id}` })
}

function goBack() {
  router.back()
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function getTypeLabel(type) {
  const types = {
    accident: t('claims.accident') || 'Accident',
    theft: t('claims.theft') || 'Theft',
    loss: t('claims.loss') || 'Loss',
    damage: t('claims.damage') || 'Damage'
  }
  return types[type] || type
}

function getStatusLabel(status) {
  const statuses = {
    pending: t('claims.statusPending') || 'Pending',
    in_review: t('claims.statusInReview') || 'In Review',
    approved: t('claims.statusApproved') || 'Approved',
    rejected: t('claims.statusRejected') || 'Rejected'
  }
  return statuses[status] || status
}

onMounted(() => {
  loadClaims()
})
</script>

<style scoped>
.claims-list-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  margin: 0.5rem 0;
  text-align: center;
  color: var(--vt-c-indigo);
}

.back-btn {
  background: none;
  border: none;
  color: var(--vt-c-indigo);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.5rem;
}

.back-btn:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #777;
}

.claims-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.claim-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1.25rem;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.claim-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.claim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.claim-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
}

.claim-info .claim-number {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--vt-c-indigo);
}

.claim-info .claim-type {
  font-size: 0.9rem;
  color: #666;
}

.claim-status {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-in_review {
  background: #d1ecf1;
  color: #0c5460;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.claim-body {
  margin-bottom: 1rem;
}

.claim-body p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.claim-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-outline {
  border: 1px solid var(--vt-c-indigo);
  color: var(--vt-c-indigo);
  background: transparent;
}

.btn-outline:hover {
  background: var(--vt-c-indigo);
  color: white;
}

.no-claims-message {
  text-align: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .claims-list-page {
    padding: 1rem;
  }

  .claim-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .claim-right {
    align-self: flex-start;
  }
}
</style>
