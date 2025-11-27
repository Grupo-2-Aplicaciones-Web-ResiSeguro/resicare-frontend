<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="app-title">{{ t('iam.common.appName') }}</h1>

      <form
          @submit.prevent="onSubmit"
          class="register-form"
          aria-label="Registration form"
      >
        <div class="form-group">
          <label id="nombre-label" for="nombre" class="sr-only">
            {{ t('iam.register.namePlaceholder') }}
          </label>
          <pv-input-text
              id="nombre"
              v-model="nombre"
              :placeholder="t('iam.register.namePlaceholder')"
              class="input"
              required
              :maxlength="80"
              :minlength="3"
              aria-labelledby="nombre-label"
              aria-required="true"
              :aria-invalid="errors.nombre ? 'true' : 'false'"
              aria-describedby="nombre-error"
          />
          <small
              v-if="errors.nombre"
              id="nombre-error"
              class="field-error"
              role="alert"
          >
            {{ errors.nombre }}
          </small>
        </div>

        <div class="form-group">
          <label id="correo-label" for="correo" class="sr-only">
            {{ t('iam.register.emailPlaceholder') }}
          </label>
          <pv-input-text
              id="correo"
              v-model="correo"
              :placeholder="t('iam.register.emailPlaceholder')"
              class="input"
              required
              type="email"
              autocomplete="email"
              aria-labelledby="correo-label"
              aria-required="true"
              :aria-invalid="errors.correo ? 'true' : 'false'"
              aria-describedby="correo-error"
          />
          <small
              v-if="errors.correo"
              id="correo-error"
              class="field-error"
              role="alert"
          >
            {{ errors.correo }}
          </small>
        </div>

        <div class="form-group">
          <label id="password-label" for="password" class="sr-only">
            {{ t('iam.register.passwordPlaceholder') }}
          </label>
          <pv-input-text
              id="password"
              v-model="password"
              type="password"
              :placeholder="t('iam.register.passwordPlaceholder')"
              class="input"
              required
              :minlength="8"
              autocomplete="new-password"
              aria-labelledby="password-label"
              aria-required="true"
              :aria-invalid="errors.password ? 'true' : 'false'"
              aria-describedby="password-error password-hint"
          />
          <span id="password-hint" class="hint-text">
            {{ t('iam.register.passwordHint') }}
          </span>
          <small
              v-if="errors.password"
              id="password-error"
              class="field-error"
              role="alert"
          >
            {{ errors.password }}
          </small>
        </div>

        <div class="form-group">
          <label id="telefono-label" for="telefono" class="sr-only">
            {{ t('iam.register.phonePlaceholder') }}
          </label>
          <pv-input-text
              id="telefono"
              v-model="telefono"
              :placeholder="t('iam.register.phonePlaceholder')"
              class="input"
              :maxlength="20"
              pattern="^[0-9+()\s-]*$"
              type="tel"
              autocomplete="tel"
              aria-labelledby="telefono-label"
              :aria-invalid="errors.telefono ? 'true' : 'false'"
              aria-describedby="telefono-error"
          />
          <small
              v-if="errors.telefono"
              id="telefono-error"
              class="field-error"
              role="alert"
          >
            {{ errors.telefono }}
          </small>
        </div>

        <div class="form-group">
          <label id="edad-label" for="edad" class="sr-only">
            {{ t('iam.register.agePlaceholder') }}
          </label>
          <pv-input-number
              id="edad"
              v-model="edad"
              :placeholder="t('iam.register.agePlaceholder')"
              class="input"
              :min="0"
              :max="120"
              aria-labelledby="edad-label"
              :aria-invalid="errors.edad ? 'true' : 'false'"
              aria-describedby="edad-error"
          />
          <small
              v-if="errors.edad"
              id="edad-error"
              class="field-error"
              role="alert"
          >
            {{ errors.edad }}
          </small>
        </div>

        <div class="form-group">
          <label id="residencia-label" for="residencia" class="sr-only">
            {{ t('iam.register.residencePlaceholder') }}
          </label>
          <pv-input-text
              id="residencia"
              v-model="residencia"
              :placeholder="t('iam.register.residencePlaceholder')"
              class="input"
              :maxlength="120"
              aria-labelledby="residencia-label"
              :aria-invalid="errors.residencia ? 'true' : 'false'"
              aria-describedby="residencia-error"
          />
          <small
              v-if="errors.residencia"
              id="residencia-error"
              class="field-error"
              role="alert"
          >
            {{ errors.residencia }}
          </small>
        </div>

        <div class="form-group">
          <label id="genero-label" for="genero" class="sr-only">
            {{ t('iam.register.genderPlaceholder') }}
          </label>
          <pv-dropdown
              id="genero"
              v-model="genero"
              :options="generos"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('iam.register.genderPlaceholder')"
              class="input"
              aria-labelledby="genero-label"
              aria-required="true"
              :aria-invalid="errors.genero ? 'true' : 'false'"
              aria-describedby="genero-error"
          />
          <small
              v-if="errors.genero"
              id="genero-error"
              class="field-error"
              role="alert"
          >
            {{ errors.genero }}
          </small>
        </div>

        <div class="form-group">
          <label id="nivel-label" for="nivelInstruccion" class="sr-only">
            {{ t('iam.register.educationPlaceholder') }}
          </label>
          <pv-dropdown
              id="nivelInstruccion"
              v-model="nivelInstruccion"
              :options="nivelOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('iam.register.educationPlaceholder')"
              class="input"
              aria-labelledby="nivel-label"
              aria-required="true"
              :aria-invalid="errors.nivelInstruccion ? 'true' : 'false'"
              aria-describedby="nivel-error"
          />
          <small
              v-if="errors.nivelInstruccion"
              id="nivel-error"
              class="field-error"
              role="alert"
          >
            {{ errors.nivelInstruccion }}
          </small>
        </div>

        <pv-button
            type="submit"
            :label="t('iam.register.submit')"
            class="w-full mb-2"
            :disabled="submitting"
            :aria-disabled="submitting ? 'true' : 'false'"
            aria-label="Submit registration form"
        />

        <pv-button
            :label="t('iam.register.haveAccount')"
            class="w-full p-button-outlined"
            aria-label="Go to login page"
            @click="goLogin"
        />

        <pv-message
            v-if="message"
            severity="info"
            :closable="false"
            role="status"
            aria-live="polite"
        >
          {{ message }}
        </pv-message>

        <pv-message
            v-if="globalError"
            severity="error"
            :closable="false"
            role="alert"
            aria-live="assertive"
        >
          {{ globalError }}
        </pv-message>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../application/auth.service.js'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const auth = new AuthService()
const { t } = useI18n()

const nombre = ref('')
const correo = ref('')
const password = ref('')
const telefono = ref('')
const edad = ref(null)
const residencia = ref('')
const genero = ref('')
const nivelInstruccion = ref(null)
const message = ref('')
const globalError = ref('')
const submitting = ref(false)

const errors = ref({
  nombre: '',
  correo: '',
  password: '',
  telefono: '',
  edad: '',
  residencia: '',
  genero: '',
  nivelInstruccion: ''
})

const generos = computed(() => [
  { label: t('iam.register.gender.male'), value: 'Masculino' },
  { label: t('iam.register.gender.female'), value: 'Femenino' },
  { label: t('iam.register.gender.other'), value: 'Otro' }
])

const nivelOptions = computed(() => [
  { label: t('iam.education.preUniversitario'), value: 'Preuniversitario' },
  { label: t('iam.education.universitario'), value: 'Universitario' },
  { label: t('iam.education.postgrado'), value: 'Postgrado' }
])

function clearErrors() {
  Object.keys(errors.value).forEach(k => errors.value[k] = '')
  globalError.value = ''
}

function validateEmail(v) {
  if (!v) return false
  const re = /^\S+@\S+\.\S+$/
  return re.test(String(v).toLowerCase())
}

/**
 * Validates all form fields before submission.
 * Returns true if all validations pass.
 */
function validate() {
  clearErrors()
  let ok = true

  if (!nombre.value || String(nombre.value).trim().length < 3) {
    errors.value.nombre = t('iam.register.validation.name', { default: 'El nombre debe tener al menos 3 caracteres' })
    ok = false
  }
  if (!correo.value || !validateEmail(correo.value)) {
    errors.value.correo = t('iam.register.validation.email', { default: 'Correo inválido' })
    ok = false
  }
  if (!password.value || String(password.value).length < 8) {
    errors.value.password = t('iam.register.validation.password', { default: 'La contraseña debe tener al menos 8 caracteres' })
    ok = false
  }
  if (telefono.value && !/^[0-9+()\s-]{4,20}$/.test(String(telefono.value))) {
    errors.value.telefono = t('iam.register.validation.phone', { default: 'Teléfono inválido' })
    ok = false
  }
  if (edad.value != null && (isNaN(edad.value) || edad.value < 0 || edad.value > 120)) {
    errors.value.edad = t('iam.register.validation.age', { default: 'Edad inválida' })
    ok = false
  }
  if (residencia.value && String(residencia.value).length > 120) {
    errors.value.residencia = t('iam.register.validation.residence', { default: 'Residencia demasiado larga' })
    ok = false
  }
  if (!genero.value) {
    errors.value.genero = t('iam.register.validation.gender', { default: 'Selecciona un género' })
    ok = false
  }
  if (!nivelInstruccion.value) {
    errors.value.nivelInstruccion = t('iam.register.validation.education', { default: 'Selecciona nivel de instrucción' })
    ok = false
  }
  return ok
}

/**
 * Submits registration form with backend validation.
 * Redirects to login on success.
 */
async function onSubmit() {
  clearErrors()
  if (!validate()) {
    globalError.value = t('iam.register.validation.fixErrors', { default: 'Corrige los errores del formulario' })
    return
  }

  submitting.value = true
  const form = {
    nombre: String(nombre.value).trim(),
    correo: String(correo.value).trim(),
    password: password.value,
    telefono: telefono.value ? String(telefono.value).trim() : '',
    edad: edad.value != null ? Number(edad.value) : null,
    residencia: residencia.value ? String(residencia.value).trim() : '',
    genero: genero.value,
    nivelInstruccion: nivelInstruccion.value
  }

  try {
    const res = await auth.register(form)
    if (res && (res.status === 201 || res.status === 200)) {
      message.value = t('iam.register.success')
      setTimeout(() => router.push('/login'), 1200)
    } else if (res && res.status === 404) {
      globalError.value = t('iam.register.endpoint404')
    } else if (res && res.error) {
      globalError.value = t('iam.register.errorWithMsg', { msg: res.error })
    } else {
      globalError.value = t('iam.register.genericError')
    }
  } catch (err) {
    globalError.value = t('iam.register.connectionError', { msg: err?.message || err })
  } finally {
    submitting.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
}

.register-card {
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input {
  width: 100%;
}

.hint-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.field-error {
  color: #c53030;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>