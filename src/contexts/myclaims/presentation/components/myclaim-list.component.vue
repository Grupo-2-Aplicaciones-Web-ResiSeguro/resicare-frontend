<template>
  <div class="myclaim-list">
    <h2 class="text-xl font-semibold mb-4">{{ $t('myclaims.title') }}</h2>

    <div v-if="claims.length === 0" class="text-center text-gray-500">
      {{ $t('myclaims.noClaims') }}
    </div>

    <div v-else class="claims-grid">
      <div
        v-for="claim in claims"
        :key="claim.id"
        class="claim-card"
      >
        <img
          :src="claim.image || '/images/default-claim.jpg'"
          alt="imagen del reclamo"
          class="claim-image"
        />

        <div class="claim-info">
          <p class="text-sm text-gray-600">
            {{ $t('myclaims.claim') }}: {{ claim.description }}
          </p>
          <p class="text-blue-600 font-semibold">
            {{ claim.status }}
          </p>
        </div>

        <button
          class="btn-outline mt-2"
          @click="goToDetail(claim.id)"
        >
          {{ $t('myclaims.viewDetail') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  claims: {
    type: Array,
    required: true
  }
})

const router = useRouter()

const goToDetail = (id) => {
  router.push(`/myclaims/${id}`)
}
</script>

<style scoped>
.myclaim-list {
  padding: 1rem;
}

.claims-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.claim-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: white;
  width: 240px;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.claim-card:hover {
  background-color: #f9fafb;
}

.claim-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
}

.btn-outline {
  border: 1px solid #16a34a;
  color: #16a34a;
  background: transparent;
  border-radius: 6px;
  padding: 0.4rem;
  font-size: 0.9rem;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-outline:hover {
  background-color: #16a34a;
  color: white;
}
</style>

