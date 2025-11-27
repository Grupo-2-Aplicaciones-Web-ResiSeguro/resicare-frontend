<template>
  <div class="photo-upload-section">
    <label
        id="photo-upload-label"
        class="section-label"
    >
      {{ $t('registerObject.objectPhoto') }}
    </label>

    <div
        class="upload-area"
        role="button"
        tabindex="0"
        :aria-label="previewUrl ? $t('registerObject.changePhoto') : $t('registerObject.uploadPhotoPrompt')"
        @click="triggerFileInput"
        @keydown.enter="triggerFileInput"
        @keydown.space.prevent="triggerFileInput"
    >
      <div v-if="!previewUrl" class="upload-placeholder">
        <i class="pi pi-camera upload-icon" aria-hidden="true"></i>
        <p class="upload-text">{{ $t('registerObject.uploadPhotoPrompt') }}</p>
        <span class="upload-hint">{{ $t('registerObject.photoHint') }}</span>
      </div>

      <div v-else class="photo-preview">
        <img
            :src="previewUrl"
            :alt="$t('registerObject.objectPhotoAlt')"
            class="preview-image"
        />
        <div class="photo-overlay">
          <pv-button
              icon="pi pi-times"
              severity="danger"
              rounded
              :aria-label="$t('registerObject.removePhoto')"
              @click.stop="removePhoto"
          />
        </div>
      </div>

      <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="file-input"
          aria-labelledby="photo-upload-label"
          aria-describedby="photo-upload-hint"
          @change="handleFileSelect"
      />
    </div>

    <span
        id="photo-upload-hint"
        class="sr-only"
    >
      {{ $t('registerObject.photoAccessibilityHint') }}
    </span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const previewUrl = ref(props.modelValue)

// Sync preview when modelValue changes externally
watch(() => props.modelValue, (newValue) => {
  previewUrl.value = newValue
})

const triggerFileInput = () => {
  fileInput.value.click()
}

/**
 * Validates and converts selected image to base64.
 * Enforces image type and 5MB size limit.
 */
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona un archivo de imagen válido')
    return
  }

  const maxSize = 5 * 1024 * 1024 // 5MB limit
  if (file.size > maxSize) {
    alert('La imagen no debe superar los 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
    emit('update:modelValue', e.target.result)
  }
  reader.readAsDataURL(file)

  event.target.value = '' // Reset input for re-selection
}

const removePhoto = () => {
  previewUrl.value = ''
  emit('update:modelValue', '')
}
</script>

<style scoped>
.photo-upload-section {
  margin-bottom: 1.5rem;
}

.section-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.upload-area {
  position: relative;
  width: 100%;
  height: 250px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.upload-area:hover,
.upload-area:focus {
  border-color: #9ca3af;
  background: #f3f4f6;
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 3rem;
  color: #6366f1;
}

.upload-text {
  margin: 0;
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
}

.upload-hint {
  font-size: 0.875rem;
  color: #6b7280;
}

.file-input {
  display: none;
}

.photo-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.photo-preview:hover .photo-overlay,
.photo-preview:focus-within .photo-overlay {
  opacity: 1;
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

@media (max-width: 640px) {
  .upload-area {
    height: 200px;
  }

  .upload-icon {
    font-size: 2.5rem;
  }

  .upload-text {
    font-size: 0.9rem;
  }
}
</style>