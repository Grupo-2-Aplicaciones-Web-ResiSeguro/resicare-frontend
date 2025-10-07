<template>
  <section class="my-claims-page">
    <header class="page-header">
      <button class="back-btn" type="button" @click="goBack">
        ← {{ $t('common.back') }}
      </button>
      <h1>{{ $t('myclaims.title') }}</h1>
    </header>

    <!-- Estado -->
    <div v-if="loading" class="loading">
      {{ $t('myclaims.loading') }}
    </div>

    <!-- Lista de reclamos -->
    <div v-else>
      <div v-if="claims.length > 0" class="claims-list">
        <div
          v-for="claim in claims"
          :key="claim.id"
          class="claim-card"
        >
          <h2>{{ claim.tipo }}</h2>
          <p><strong>Fecha del incidente:</strong> {{ claim.fechaIncidente }}</p>
          <p><strong>Descripción:</strong> {{ claim.descripcionBreve }}</p>
          <p><strong>Estado:</strong> {{ claim.estado || $t('myclaims.status.pending') }}</p>

          <button
            class="detail-btn"
            @click="toggleDetail(claim)"
          >
            {{ selectedClaim?.id === claim.id ? 'Ocultar detalle' : $t('myclaims.viewDetail') }}
          </button>

          <!-- Detalle desplegable -->
          <div
            v-if="selectedClaim?.id === claim.id"
            class="claim-detail"
          >
            <h3>{{ $t('myclaims.detailTitle') }}</h3>
            <p><strong>{{ $t('myclaims.claimNumber') }}:</strong> {{ claim.id }}</p>
            <p><strong>{{ $t('myclaims.claimType') }}:</strong> {{ claim.tipo }}</p>
            <p><strong>{{ $t('myclaims.startDate') }}:</strong> {{ claim.fechaIncidente }}</p>
            <p><strong>{{ $t('myclaims.descriptionTitle') }}:</strong> {{ claim.descripcionBreve }}</p>
            <p><strong>{{ $t('myclaims.objectTitle') }}:</strong> {{ claim.objetoAsociado || 'N/A' }}</p>
            <p><strong>{{ $t('myclaims.statusTitle') }}:</strong> {{ claim.estado }}</p>
          </div>
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
// Datos de prueba temporales (solo para probar interfaz)
const demoClaims = [
  {
    id: 1,
    tipo: 'Robo de pertenencias',
    fechaIncidente: '2025-10-05',
    descripcionBreve: 'Me robaron mi bolso en el estacionamiento',
    estado: 'Pendiente',
    objetoAsociado: 'Bolso negro'
  },
  {
    id: 2,
    tipo: 'Daño en producto entregado',
    fechaIncidente: '2025-09-20',
    descripcionBreve: 'El paquete llegó roto',
    estado: 'Aprobado',
    objetoAsociado: 'Caja de herramientas'
  }
]

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MyClaimApiService } from '../../infraestructure/myclaim-api.service.js'

const router = useRouter()
const api = new MyClaimApiService()

const claims = ref([])
const loading = ref(true)
const selectedClaim = ref(null)

async function loadClaims() {
  try {
    const data = await api.getAll()
    claims.value = Array.isArray(data) && data.length > 0 ? data : demoClaims
  } catch (error) {
    console.error('Error al obtener los reclamos:', error)
    claims.value = demoClaims // usa datos de prueba
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function toggleDetail(claim) {
  if (selectedClaim.value?.id === claim.id) {
    selectedClaim.value = null
  } else {
    selectedClaim.value = claim
  }
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

.back-btn {
  background: none;
  border: none;
  color: var(--vt-c-indigo, #646cff);
  font-size: 1rem;
  cursor: pointer;
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

.detail-btn {
  margin-top: 0.5rem;
  background-color: transparent;
  border: 1px solid #16a34a;
  color: #16a34a;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.detail-btn:hover {
  background-color: #16a34a;
  color: white;
}

.claim-detail {
  margin-top: 0.8rem;
  padding: 0.8rem;
  border-top: 1px solid #ccc;
  background: #f9fafb;
  border-radius: 8px;
}
</style>
