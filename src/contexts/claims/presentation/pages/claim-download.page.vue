<template>
  <section class="claim-download-page">
    <header class="page-header">
      <button class="back-btn" type="button" @click="goBack">
        ← {{ t('common.back') }}
      </button>
      <h1>{{ t('claims.downloadTitle') || 'Download Claim' }}</h1>
    </header>

    <div class="download-card">
      <p>{{ t('claims.pdfDownloaded') || 'PDF generated successfully!' }}</p>
      <pv-button
        v-if="pdfUrl"
        :label="t('claims.viewPdf') || 'View PDF'"
        icon="pi pi-file-pdf"
        class="btn-primary"
        @click="openPdf"
      />
    </div>

    <div
      ref="printable"
      class="printable"
      style="width:800px; padding:20px; background:white; display:none;"
    >
      <h2>{{ t('claims.proofTitle') || 'Claim Proof' }}</h2>
      <div><strong>{{ t('claims.number') }}:</strong> {{ claim.number }}</div>
      <div><strong>{{ t('claims.type') }}:</strong> {{ getTypeLabel(claim.type) }}</div>
      <div><strong>{{ t('claims.status') }}:</strong> {{ getStatusLabel(claim.status) }}</div>
      <div><strong>{{ t('claims.incidentDate') }}:</strong> {{ formatDate(claim.incidentDate) }}</div>
      <div><strong>{{ t('claims.creationDate') }}:</strong> {{ formatDate(claim.creationDate) }}</div>
      <div><strong>{{ t('claims.description') }}:</strong> {{ claim.description }}</div>

      <div style="margin-top:12px;">
        <img
          :src="getObjectImage(claim.objectRegistered)"
          style="width:240px;height:auto;"
          alt="object"
        />
        <div>{{ getObjectTitle(claim.objectRegistered) }}</div>
      </div>
    </div>
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
const api = new ClaimApiService()
const claim = ref({})
const printable = ref(null)
const pdfUrl = ref(null)

async function loadClaim() {
  try {
    const response = await api.getById(route.params.id)
    if (response.status === 200) {
      claim.value = ClaimAssembler.toEntityFromResource(response.data)
    }
  } catch (err) {
    console.error('Error loading claim:', err)
  }
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
  if (!obj) return '/images/id.png'
  if (typeof obj === 'object' && obj.image) return obj.image
  return '/images/id.png'
}

function getObjectTitle(obj) {
  if (!obj) return 'N/A'
  if (typeof obj === 'object' && obj.name) return obj.name
  if (typeof obj === 'string') return obj
  return `Object ID: ${obj}`
}

onMounted(async () => {
  await loadClaim()

  try {
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).jsPDF

    printable.value.style.display = 'block'
    await new Promise((r) => setTimeout(r, 300))

    const canvas = await html2canvas(printable.value, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'pt', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    const blob = pdf.output('blob')
    pdfUrl.value = URL.createObjectURL(blob)

    pdf.save(`claim-${claim.value.number || claim.value.id}.pdf`)
  } catch (err) {
    console.error('PDF generation failed:', err)
  } finally {
    printable.value.style.display = 'none'
  }
})

function openPdf() {
  if (pdfUrl.value) window.open(pdfUrl.value, '_blank')
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.claim-download-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  margin: 0.5rem 0;
  color: var(--vt-c-indigo);
}

.back-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--vt-c-indigo);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.5rem;
}

.back-btn:hover {
  text-decoration: underline;
}

.download-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.download-card p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
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

.printable {
  background: #fff;
  color: black;
}

.printable h2 {
  margin-bottom: 1rem;
  color: var(--vt-c-indigo);
}

.printable div {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .claim-download-page {
    padding: 1rem;
  }
}
</style>
