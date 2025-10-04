<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-title">404</h1>
      <h2 class="error-subtitle">{{ $t('notFound.title') }}</h2>
      <p class="error-description">{{ $t('notFound.description') }}</p>

      <div class="error-actions">
        <pv-button :label="$t('notFound.goHome')" icon="pi pi-home" @click="goHome" />
        <pv-button
          :label="$t('notFound.goBack')"
          icon="pi pi-arrow-left"
          @click="goBack"
          severity="secondary"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.not-found-content {
  max-width: 500px;
}

.error-title {
  font-size: 6rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 0;
}

.error-subtitle {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.error-description {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
