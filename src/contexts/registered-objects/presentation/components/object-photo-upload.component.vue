<template>
  <div class="photo-upload-section">
    <div class="upload-area" @click="triggerFileInput">
      <div v-if="!previewUrl" class="upload-placeholder">
        <i class="pi pi-camera upload-icon"></i>
        <p class="upload-text">{{ $t('registerObject.uploadPhotoPrompt') }}</p>
      </div>

      <div v-else class="photo-preview">
        <img :src="previewUrl" :alt="$t('registerObject.objectPhoto')" class="preview-image" />
        <div class="photo-overlay">
          <pv-button
            icon="pi pi-times"
            severity="danger"
            rounded
            @click.stop="removePhoto"
          />
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="file-input"
        @change="handleFileSelect"
      />
    </div>
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

watch(() => props.modelValue, (newValue) => {
  previewUrl.value = newValue
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona un archivo de imagen válido')
    return
  }

  const maxSize = 5 * 1024 * 1024
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

  event.target.value = ''
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

.upload-area:hover {
  border-color: #9ca3af;
  background: #f3f4f6;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
}

.upload-icon {
  font-size: 3rem;
  color: #6366f1;
}

.upload-text {
  margin: 0;
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
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

.photo-preview:hover .photo-overlay {
  opacity: 1;
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
