<template>
  <section class="claim-detail-page">
    <header class="page-header">
      <h1>{{ t('claims.detailTitle') }}</h1>
      <button class="back-btn" type="button" @click="goBack">← {{ t('common.back') }}</button>
    </header>

    <!-- ✅ If viewing ALL -->
    <div v-if="isAll" class="all-claims">
      <div v-for="c in claims" :key="c.id" class="detail-card">
        <h2>{{ t('claims.number') }}: {{ c.number }}</h2>

        <div class="row">
          <img src="/images/NOTA.png" alt="nota" class="row-icon"/>
          <div class="label">{{ t('claims.number') }}</div>
          <div class="value">{{ c.number }}</div>
        </div>

        <div class="row">
          <img src="/images/RECLAMO.jpg" alt="reclamo" class="row-icon"/>
          <div class="label">{{ t('claims.type') }}</div>
          <div class="value">{{ c.type }}</div>
        </div>

        <div class="row">
          <img src="/images/check-green.png" alt="estado" class="row-icon"/>
          <div class="label">{{ t('claims.status') }}</div>
          <div class="value">{{ c.status }}</div>
        </div>

        <div class="row"><div class="label">{{ t('claims.incidentDate') }}</div><div class="value">{{ c.incidentDate }}</div></div>
        <div class="row"><div class="label">{{ t('claims.creationDate') }}</div><div class="value">{{ c.creationDate }}</div></div>
        <div class="row"><div class="label">{{ t('claims.description') }}</div><div class="value">{{ c.description }}</div></div>

        <div class="object-card">

          <img :src="c.objectRegistered?.image || '/images/placeholder.png'" alt="obj"/>
          <div class="obj-info">
            <div class="obj-title">{{ c.objectRegistered?.title }}</div>
            <div class="obj-sub">{{ c.objectRegistered?.subtitle }}</div>
          </div>
        </div>

        <div class="download-row">
          <button class="btn-primary" @click="downloadProof(c.id)">
            {{ t('claims.downloadProof') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ If viewing SINGLE -->
    <div v-else class="detail-card">
      <div class="row">
        <img src="/images/NOTA.png" alt="nota" class="row-icon"/>
        <div class="label">{{ t('claims.number') }}</div>
        <div class="value">{{ claim.number }}</div>
      </div>

      <div class="row">
        <img src="/images/RECLAMO.jpg" alt="reclamo" class="row-icon"/>
        <div class="label">{{ t('claims.type') }}</div>
        <div class="value">{{ claim.type }}</div>
      </div>

      <div class="row">
        <img src="/images/check-green.png" alt="estado" class="row-icon"/>
        <div class="label">{{ t('claims.status') }}</div>
        <div class="value">{{ claim.status }}</div>
      </div>

      <div class="row"><div class="label">{{ t('claims.incidentDate') }}</div><div class="value">{{ claim.incidentDate }}</div></div>
      <div class="row"><div class="label">{{ t('claims.creationDate') }}</div><div class="value">{{ claim.creationDate }}</div></div>
      <div class="row"><div class="label">{{ t('claims.description') }}</div><div class="value">{{ claim.description }}</div></div>

      <h3 class="section-title">{{ t('claims.objectRegistered') }}</h3>
      <div class="object-card">

        <img :src="claim.objectRegistered?.image || '/images/placeholder.png'" alt="obj"/>
        <div class="obj-info">
          <div class="obj-title">{{ claim.objectRegistered?.title }}</div>
          <div class="obj-sub">{{ claim.objectRegistered?.subtitle }}</div>
        </div>
      </div>

      <div class="download-row">
        <button class="btn-primary" @click="downloadProof(claim.id)">
          {{ t('claims.downloadProof') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * @summary Claim detail page.
 * Displays all information for a specific claim or for all claims together.
 * Allows downloading a proof as PDF (single or all).
 * @autor PARIONA LUCAS JOSE MANUEL - U202119257
 */
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ClaimApiService } from '@/contexts/claimsdetailslist/infraestructure/claim-api.service.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const claim = ref({})
const claims = ref([])
const service = new ClaimApiService()

const isAll = computed(() => route.params.id === 'all')

const load = async () => {
  try {
    if (isAll.value) {
      const res = await service.getAll()
      claims.value = res.data || []
    } else {
      const res = await service.getById(route.params.id)
      claim.value = res.data || {}
    }
  } catch (error) {
    console.error('Error loading claims:', error)
  }
}

onMounted(load)

const downloadProof = (id) => {
  router.push({ path: `/claims/${id}/download` })
}
const goBack = () => router.back()
</script>

<style scoped>
.detail-card {
  background: #fff;
  color: blue;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.row {
  display:flex;
  gap:1rem;
  align-items:center;
  padding:0.5rem 0;
  border-bottom:1px solid #f1f1f1;
}

.row-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.label {
  width:180px;
  color:blue;
}
.value { flex:1; }

.object-card {
  display:flex;
  gap:1rem;
  align-items:center;
  padding:1rem;
  background:#fafafa;
  border-radius:6px;
  margin-top:1rem;
}
.object-card img {
  width:180px;
  height:180px;
  object-fit:contain;
  background:#fff;
  border:1px solid #eee;
  border-radius:6px;
  padding:8px;
}
.obj-info .obj-title { font-weight:700; }

.download-row {
  text-align:center;
  margin-top:1.5rem;
}
.btn-primary {
  background:#163e76;
  color:#fff;
  border:none;
  padding:0.6rem 1.4rem;
  border-radius:8px;
  cursor:pointer;
}
h1 {
  color:blue;
}
</style>
