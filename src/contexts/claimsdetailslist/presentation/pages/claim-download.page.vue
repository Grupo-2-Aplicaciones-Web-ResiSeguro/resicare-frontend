<template>
  <section class="claim-download-page">
    <header class="page-header">
      <h1>{{ t('claims.downloadTitle') }}</h1>
      <button class="back-btn" type="button" @click="goBack">
        ← {{ t('common.back') }}
      </button>
    </header>

    <div class="download-card">
      <p>{{ t('claims.pdfDownloaded') }}</p>
      <button class="btn-primary" v-if="pdfUrl" @click="openPdf">
        {{ t('claims.viewPdf') }}
      </button>
    </div>


    <div
        ref="printable"
        class="printable"
        style="width:800px; padding:20px; background:white; display:none;"
    >
      <h2>{{ t('claims.proofTitle') }}</h2>
      <div><strong>{{ t('claims.number') }}:</strong> {{ claim.number }}</div>
      <div><strong>{{ t('claims.type') }}:</strong> {{ claim.type }}</div>
      <div><strong>{{ t('claims.status') }}:</strong> {{ claim.status }}</div>
      <div><strong>{{ t('claims.incidentDate') }}:</strong> {{ claim.incidentDate }}</div>
      <div><strong>{{ t('claims.creationDate') }}:</strong> {{ claim.creationDate }}</div>
      <div><strong>{{ t('claims.description') }}:</strong> {{ claim.description }}</div>

      <div style="margin-top:12px;">
        <img
            :src="claim.objectRegistered?.image || '/images/id.png'"
            style="width:240px;height:auto;"
            alt="object"
        />
        <div>{{ claim.objectRegistered?.title }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * @summary Claim download page.
 * Generates a PDF automatically from claim data (client-side) and offers to view it.
 * Uses html2canvas + jsPDF to turn a DOM node into a downloadable PDF.
 * @author PARIONA LUCAS JOSE MANUEL - U202119257
 */

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ClaimApiService } from '@/contexts/claimsdetailslist/infraestructure/claim-api.service.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const service = new ClaimApiService()
const claim = ref({})
const printable = ref(null)
const pdfUrl = ref(null)

const load = async () => {
  try {
    const res = await service.getById(route.params.id)
    claim.value = res.data || {}
  } catch (err) {
    console.error('Error loading claim:', err)
  }
}

onMounted(async () => {
  await load()

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

const openPdf = () => {
  if (pdfUrl.value) window.open(pdfUrl.value, '_blank')
}

const goBack = () => router.back()
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: var(--vt-c-indigo, #163E76);
  cursor: pointer;
  font-size: 0.95rem;
}

.download-card {
  background: #fff;
  color: blue;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.btn-primary {
  background: #163E76;
  color: #fff;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #1e4f95;
}

.printable {
  background: #fff;
  color: black;
}

h1 {

  color:blue;
}
</style>
