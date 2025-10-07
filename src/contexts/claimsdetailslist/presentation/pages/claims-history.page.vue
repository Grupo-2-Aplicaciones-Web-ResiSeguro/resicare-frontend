<template>
  <section class="claims-history-page">
    <header class="page-header">
      <h1>{{ t('claims.title') }}</h1>
      <button class="back-btn" type="button" @click="goBack">← {{ t('common.back') }}</button>
    </header>

    <div class="claims-list">
      <h3 class="section-title">{{ t('claims.previous') }}</h3>

      <!-- Loading indicator -->
      <div v-if="loading" class="loading">
        {{ t('common.loading') }}...
      </div>

      <!--Claims list -->
      <ul v-else class="list">
        <li v-for="claim in claims" :key="claim.id" class="claim-item">
          <div class="claim-left">
            <div class="icon">

              <img
                  src="/images/id.png"
                  alt="claim-thumbnail"
              />
            </div>
            <div class="claim-text">
              <div class="claim-number">
                {{ t('claims.number') }}: {{ claim.number }}
              </div>
              <div class="claim-type">{{ claim.type }}</div>
            </div>
          </div>
          <div class="claim-right">
            <div class="claim-status">{{ claim.status }}</div>
            <div class="claim-actions">
              <button class="btn-primary" @click="viewDetails(claim.id)">
                {{ t('claims.viewDetails') }}
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div class="actions-row" v-if="claims.length">
        <button class="btn-wide" @click="goToAllDetails">
          {{ t('claims.viewDetailsBig') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * @summary Claims history page.
 * Renders list of claims and provides navigation to single or all claims detail.
 * @author PARIONA LUCAS JOSE MANUEL - U202119257
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ClaimApiService } from '@/contexts/claimsdetailslist/infraestructure/claim-api.service.js'

const { t } = useI18n()
const claims = ref([])
const loading = ref(true)
const service = new ClaimApiService()
const router = useRouter()

const load = async () => {
  try {
    const res = await service.getAll()
    claims.value = res.data || []
  } catch (error) {
    console.error('Error loading claims:', error)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const viewDetails = (id) => router.push({ path: `/claims/${id}` })
const goBack = () => router.back()
const goToAllDetails = () => router.push({ path: `/claims/all` })
</script>

<style scoped>
.claims-history-page {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  font-size: 0.95rem;
}

.claims-list {
  background: #fff;
  color: blue;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.list {
  list-style: none;
  color: blue;
  padding: 0;
  margin: 0;
}

.claim-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  color: blue;
}

.claim-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: blue;
}

.icon img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
}

.claim-text .claim-number {
  font-weight: 600;
}

.claim-right {
  text-align: right;
}

.btn-primary {
  background: #163e76;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #1e4f95;
}

.btn-wide {
  background: #163e76;
  color: #fff;
  width: 60%;
  padding: 0.6rem;
  border-radius: 10px;
  margin: 1rem auto;
  display: block;
  border: none;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: blue;
}

h1 {
  color: blue;
}
</style>
