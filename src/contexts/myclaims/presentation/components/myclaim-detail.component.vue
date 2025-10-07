<template>
  <div class="myclaim-detail">
    <button class="back-btn" @click="goBack">
      ← {{ $t('common.back') }}
    </button>

    <h2 class="page-title">{{ $t('myclaims.detailTitle') }}</h2>

    <div v-if="claim" class="claim-container">
      <!-- Información principal -->
      <section class="info-section">
        <h3 class="section-title">{{ $t('myclaims.infoTitle') }}</h3>

        <div class="info-grid">
          <div class="info-item">
            <label>{{ $t('myclaims.claimNumber') }}</label>
            <p>{{ claim.number }}</p>
          </div>

          <div class="info-item">
            <label>{{ $t('myclaims.claimType') }}</label>
            <p>{{ claim.type }}</p>
          </div>

          <div class="info-item">
            <label>{{ $t('myclaims.currentStatus') }}</label>
            <p class="text-blue-700 font-semibold">{{ claim.status }}</p>
          </div>

          <div class="info-item">
            <label>{{ $t('myclaims.startDate') }}</label>
            <p>{{ claim.startDate }}</p>
          </div>
        </div>
      </section>

      <!-- Descripción -->
      <section class="description-section">
        <h3 class="section-title">
          {{ $t('myclaims.incidentDescription') }}
        </h3>
        <p>{{ claim.description }}</p>
      </section>

      <!-- Objeto asociado -->
      <section class="object-section">
        <h3 class="section-title">{{ $t('myclaims.associatedObject') }}</h3>
        <div class="object-card">
          <img
            :src="claim.image || '/images/default-claim.jpg'"
            alt="Imagen del objeto"
            class="object-image"
          />
          <div class="object-info">
            <p class="text-sm text-gray-600">{{ claim.objectType }}</p>
            <p class="font-medium">{{ claim.objectName }}</p>
          </div>
        </div>
      </section>

      <!-- Botón de soporte -->
      <div class="support-btn-container">
        <button class="support-btn" @click="contactSupport">
          {{ $t('myclaims.contactSupport') }}
        </button>
      </div>
    </div>

    <div v-else class="text-center text-gray-500">
      {{ $t('myclaims.loading') }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MyClaimApiService } from '@/modules/myclaims/infrastructure/myclaim-api.service.js'

const route = useRoute()
const router = useRouter()
const claim = ref(null)

onMounted(async () => {
  try {
    const id = route.params.id
    claim.value = await MyClaimApiService.fetchById(id)
  } catch (error) {
    console.error('Error al cargar el reclamo:', error)
  }
})

const goBack = () => {
  router.push('/myclaims')
}

const contactSupport = () => {
  alert('Se abrirá un canal de contacto con soporte próximamente.')
}
</script>

<style scoped>
.myclaim-detail {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
}

.back-btn {
  color: #2563eb;
  font-weight: 500;
  margin-bottom: 1rem;
  cursor: pointer;
  background: none;
  border: none;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-title {
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
}

.info-item label {
  font-size: 0.85rem;
  color: #6b7280;
  display: block;
}

.info-item p {
  font-weight: 500;
  color: #111827;
}

.description-section {
  margin-top: 1.5rem;
}

.object-section {
  margin-top: 1.5rem;
}

.object-card {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.object-image {
  width: 150px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.support-btn-container {
  text-align: center;
  margin-top: 2rem;
}

.support-btn {
  background-color: #16a34a;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.support-btn:hover {
  background-color: #15803d;
}
</style>
