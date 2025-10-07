<template>
  <section class="my-claims-page">
    <header class="page-header">
      <button class="back-btn" type="button" @click="goBack">
        ← {{ $t('common.back') }}
      </button>
      <h1>{{ $t('myclaims.title') }}</h1>
    </header>

    <div v-if="loading" class="loading"> </div>

    <div v-else>
      <div v-if="claims.length > 0" class="claims-list">
        <div v-for="claim in claims" :key="claim.id" class="claim-card">
          <h2>{{ claim.tipo }}</h2>
          <p><strong>Fecha del incidente:</strong> {{ claim.fechaIncidente }}</p>
          <p><strong>Descripción:</strong> {{ claim.descripcionBreve }}</p>
          <p><strong>Estado:</strong> {{ claim.estado }}</p>

          <button
            class="btn-outline mt-2"
            @click="toggleDetail(claim.id)"
          >
            {{ expandedClaimId === claim.id ? $t('common.hideDetail') : $t('myclaims.viewDetail') }}
          </button>

          <transition name="fade">
            <div
              v-if="expandedClaimId === claim.id"
              class="claim-detail mt-3 border-t pt-2 text-sm text-gray-700"
            >
              <p><strong>{{ $t('myclaims.claimNumber') }}:</strong> {{ claim.id }}</p>
              <p><strong>{{ $t('myclaims.claimType') }}:</strong> {{ claim.tipo }}</p>
              <p><strong>{{ $t('myclaims.startDate') }}:</strong> {{ claim.fechaIncidente }}</p>
              <p><strong>{{ $t('myclaims.descriptionTitle') }}:</strong> {{ claim.descripcionCompleta }}</p>
              <p><strong>{{ $t('myclaims.objectTitle') }}:</strong> {{ claim.objetoAsociado }}</p>
            </div>
          </transition>
        </div>
      </div>  

      <pv-message
        v-else
        severity="info"
        class="no-claims-message"
      >
        {{ $t('myclaims.noClaims') }}
      </pv-message>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MyClaimApiService } from '../../infraestructure/myclaim-api.service.js'

const router = useRouter()
const claims = ref([])
const loading = ref(true)
const expandedClaimId = ref(null)

async function loadClaims() {
  try {
    const data = await MyClaimApiService.fetchAll()
    console.log('Reclamos cargados:', data)
    claims.value = data
  } catch (error) {
    console.error('Error al obtener los reclamos:', error)
  } finally {
    loading.value = false
  }
}

function toggleDetail(id) {
  expandedClaimId.value = expandedClaimId.value === id ? null : id
}

function goBack() {
  router.back()
}

onMounted(() => {
  loadClaims()
})

</script>

<style scoped>
.my-claims-page {
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
}

.back-btn {
  background: none;
  border: none;
  color: var(--vt-c-indigo, #646cff);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.back-btn:hover {
  text-decoration: underline;
}

.claims-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.claim-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.claim-card h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.loading {
  text-align: center;
  color: #777;
}

.no-claims-message {
  text-align: center;
  margin-top: 2rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.btn-outline {
  border: 1px solid #16a34a;
  color: #16a34a;
  background: transparent;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: #16a34a;
  color: white;
}

.claim-detail {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 0.5rem;
}

</style>
