<template>
  <section class="claim-detail-page">
    <header class="page-header">
      <button class="back-btn" type="button" @click="goBack">← {{ t('common.back') }}</button>
      <h1>{{ t('claims.detailTitle') || 'Claim Details' }}</h1>
    </header>

    <div v-if="loading" class="loading">
      {{ t('common.loading') || 'Loading' }}...
    </div>

    <div v-else-if="claim.id" class="detail-card">
      <div class="row">
        <img src="/images/NOTA.png" alt="nota" class="row-icon"/>
        <div class="label">{{ t('claims.number') }}</div>
        <div class="value">{{ claim.number }}</div>
      </div>

      <div class="row">
        <img src="/images/RECLAMO.jpg" alt="reclamo" class="row-icon"/>
        <div class="label">{{ t('claims.type') }}</div>
        <div class="value">{{ getTypeLabel(claim.type) }}</div>
      </div>

      <div class="row">
        <img src="/images/check-green.png" alt="estado" class="row-icon"/>
        <div class="label">{{ t('claims.status') }}</div>
        <div class="value">{{ getStatusLabel(claim.status) }}</div>
      </div>

      <div class="row">
        <div class="label">{{ t('claims.incidentDate') }}</div>
        <div class="value">{{ formatDate(claim.incidentDate) }}</div>
      </div>

      <div class="row">
        <div class="label">{{ t('claims.creationDate') }}</div>
        <div class="value">{{ formatDate(claim.creationDate) }}</div>
      </div>

      <div class="row">
        <div class="label">{{ t('claims.description') }}</div>
        <div class="value">{{ claim.description }}</div>
      </div>

      <h3 class="section-title">{{ t('claims.objectRegistered') || 'Registered Object' }}</h3>
      <div class="object-card">
        <img :src="getObjectImage(claim.objectRegistered)" alt="obj"/>
        <div class="obj-info">
          <div class="obj-title">{{ getObjectTitle(claim.objectRegistered) }}</div>
          <div class="obj-sub">{{ getObjectSubtitle(claim.objectRegistered) }}</div>
        </div>
      </div>

      <div v-if="claim.documents && claim.documents.length > 0" class="documents-section">
        <h3 class="section-title">{{ t('claims.documents') || 'Documents' }}</h3>
        <div class="documents-list">
          <div v-for="(doc, idx) in claim.documents" :key="idx" class="document-item">
            📄 {{ doc.name || `Document ${idx + 1}` }}
          </div>
        </div>
      </div>

      <div class="download-row">
        <pv-button
          :label="t('claims.downloadProof') || 'Download Proof'"
          icon="pi pi-download"
          class="btn-primary"
          @click="downloadProof(claim.id)"
        />
      </div>
    </div>

    <pv-message v-else severity="error">
      {{ t('claims.notFound') || 'Claim not found' }}
    </pv-message>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ClaimApiService } from '../../infraestructure/claim-api.service.js'
import { ClaimAssembler } from '../../Domain/claim.assembler.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const claim = ref({})
const loading = ref(true)
const api = new ClaimApiService()

async function loadClaim() {
  try {
    const response = await api.getById(route.params.id)
    if (response.status === 200) {
      claim.value = ClaimAssembler.toEntityFromResource(response.data)
    }
  } catch (error) {
    console.error('Error loading claim:', error)
  } finally {
    loading.value = false
  }
}

function downloadProof(id) {
  router.push({ path: `/claims/${id}/download` })
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

function getObjectImage(obj) {
  if (!obj) return '/images/placeholder.png'
  if (typeof obj === 'object' && obj.image) return obj.image
  return '/images/placeholder.png'
}

function getObjectTitle(obj) {
  if (!obj) return 'N/A'
  if (typeof obj === 'object' && obj.name) return obj.name
  if (typeof obj === 'string') return obj
  return `Object ID: ${obj}`
}

function getObjectSubtitle(obj) {
  if (!obj) return ''
  if (typeof obj === 'object') {
    return obj.serialNumber ? `S/N: ${obj.serialNumber}` : ''
  }
  return ''
}

onMounted(() => {
  loadClaim()
})
</script>

<style scoped>
.claim-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.page-header h1 {
  font-size: 1.75rem;
  margin: 0.5rem 0;
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

.detail-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.row {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f1f1;
}

.row-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.label {
  min-width: 180px;
  font-weight: 600;
  color: #555;
}

.value {
  flex: 1;
  color: #333;
}

.section-title {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  color: var(--vt-c-indigo);
}

.object-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.object-card img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 8px;
}

.obj-info .obj-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.obj-info .obj-sub {
  color: #666;
  font-size: 0.9rem;
}

.documents-section {
  margin-top: 1.5rem;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.document-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid var(--vt-c-indigo);
}

.download-row {
  text-align: center;
  margin-top: 2rem;
}

.btn-primary {
  background: var(--vt-c-indigo);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .claim-detail-page {
    padding: 1rem;
  }

  .label {
    min-width: 120px;
    font-size: 0.9rem;
  }

  .object-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
