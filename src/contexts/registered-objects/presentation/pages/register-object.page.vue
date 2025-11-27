<template>
  <section class="register-object-page">
    <header class="page-header">
      <button
          class="back-btn"
          type="button"
          aria-label="Go back to previous page"
          @click="goBack"
      >
        ← {{ $t('common.back') }}
      </button>
      <h1>{{ $t('registerObject.title') }}</h1>
    </header>

    <form
        class="form-container"
        @submit.prevent="onSubmit"
    >
      <object-type-selector v-model="registeredObject.tipo" />

      <div class="form-group">
        <label
            id="object-name-label"
            for="object-name"
        >
          {{ $t('registerObject.objectName') }}
        </label>
        <pv-input-text
            id="object-name"
            v-model="registeredObject.nombre"
            :placeholder="$t('registerObject.namePlaceholder')"
            class="form-control"
            aria-labelledby="object-name-label"
            aria-required="true"
            :maxlength="100"
        />
      </div>

      <div class="form-group">
        <label
            id="description-label"
            for="description"
        >
          {{ $t('registerObject.briefDescription') }}
        </label>
        <pv-textarea
            id="description"
            v-model="registeredObject.descripcionBreve"
            :placeholder="$t('registerObject.descriptionPlaceholder')"
            rows="3"
            auto-resize
            class="form-control"
            aria-labelledby="description-label"
            aria-required="true"
            :maxlength="500"
        />
      </div>

      <div class="form-group">
        <label
            id="price-label"
            for="price"
        >
          {{ $t('registerObject.price') }}
        </label>
        <pv-input-number
            id="price"
            v-model="registeredObject.precio"
            :placeholder="$t('registerObject.pricePlaceholder')"
            mode="currency"
            currency="USD"
            locale="en-US"
            class="form-control"
            aria-labelledby="price-label"
            aria-describedby="price-hint"
            :min="0"
            :max="1000000"
        />
        <span id="price-hint" class="hint-text">
          {{ $t('registerObject.priceHint') }}
        </span>
      </div>

      <div class="form-group">
        <label
            id="serial-label"
            for="serial"
        >
          {{ $t('registerObject.serialNumber') }}
        </label>
        <pv-input-text
            id="serial"
            v-model="registeredObject.numeroSerie"
            :placeholder="$t('registerObject.serialPlaceholder')"
            class="form-control"
            aria-labelledby="serial-label"
            aria-describedby="serial-hint"
        />
        <span id="serial-hint" class="hint-text">
          {{ $t('registerObject.serialHint') }}
        </span>
      </div>

      <object-photo-upload v-model="registeredObject.foto" />

      <div class="action-buttons">
        <pv-button
            type="submit"
            :label="$t('registerObject.addToList')"
            icon="pi pi-plus"
            severity="primary"
            class="submit-btn"
            :disabled="!isFormValid"
            :aria-disabled="!isFormValid ? 'true' : 'false'"
            aria-label="Register new object"
        />
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ObjectTypeSelector from '../components/object-type-selector.component.vue'
import ObjectPhotoUpload from '../components/object-photo-upload.component.vue'
import { RegisteredObjectApiService } from '../../infraestructure/registered-object-api.service.js'
import { RegisteredObjectAssembler } from '../../Domain/registered-object.assembler.js'

const { t } = useI18n()
const router = useRouter()
const api = new RegisteredObjectApiService()

const registeredObject = reactive({
  tipo: '',
  nombre: '',
  descripcionBreve: '',
  precio: 0,
  numeroSerie: '',
  foto: ''
})

const userObjects = ref([])

const isFormValid = computed(() => {
  return registeredObject.tipo &&
      registeredObject.nombre &&
      registeredObject.descripcionBreve
})

/**
 * Extracts user ID from JWT token or localStorage.
 * Supports multiple authentication token formats.
 */
function getCurrentUserId() {
  try {
    const currentUserRaw = localStorage.getItem('currentUser')
    if (currentUserRaw) {
      try {
        const parsed = JSON.parse(currentUserRaw)
        const candidate = parsed.id ?? parsed.userId ?? parsed.sub ?? parsed.uid ?? null
        if (candidate) return String(candidate)
      } catch {}
    }

    const token = localStorage.getItem('accessToken_v1')
    if (!token) return null

    if (token.split('.').length === 3) {
      try {
        const payloadB64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const pad = payloadB64.length % 4
        const padded = pad ? payloadB64 + '='.repeat(4 - pad) : payloadB64
        const payloadJson = decodeURIComponent(
            Array.prototype.map.call(atob(padded), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        )
        const payload = JSON.parse(payloadJson)
        const candidate = payload.sub ?? payload.id ?? payload.userId ?? payload.uid ?? null
        if (candidate) return String(candidate)
      } catch {}
    }
    return String(token)
  } catch {
    return null
  }
}

async function loadUserObjects() {
  const userId = getCurrentUserId()
  if (!userId) return
  const response = await api.getByUserId(userId)
  userObjects.value = response.data
}

onMounted(() => {
  loadUserObjects()
})

/**
 * Submits object registration with backend validation.
 * Resets form and reloads user objects on success.
 */
async function onSubmit() {
  if (!isFormValid.value) {
    alert(t('registerObject.pleaseCompleteForm'))
    return
  }

  try {
    const resource = RegisteredObjectAssembler.toResourceFromEntity(registeredObject)
    resource.userId = getCurrentUserId()
    await api.create(resource)

    alert(t('registerObject.objectRegisteredSuccess'))

    // Reset form fields
    registeredObject.tipo = ''
    registeredObject.nombre = ''
    registeredObject.descripcionBreve = ''
    registeredObject.precio = 0
    registeredObject.numeroSerie = ''
    registeredObject.foto = ''

    await loadUserObjects()
    router.back()
  } catch (error) {
    // Handle backend validation errors
    if (error.response && error.response.data) {
      const errorData = error.response.data
      alert(errorData.message || t('registerObject.objectRegisteredError'))
    } else {
      alert(t('registerObject.objectRegisteredError'))
    }
    console.error('Error registering object:', error)
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.register-object-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  margin: 0.5rem 0;
  text-align: center;
}

.back-btn {
  background: none;
  border: none;
  color: var(--vt-c-indigo, #646cff);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.5rem;
}

.back-btn:hover {
  text-decoration: underline;
}

.back-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-control {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.hint-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .register-object-page {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }
}
</style>