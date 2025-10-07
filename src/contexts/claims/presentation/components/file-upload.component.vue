<template>
  <div class="file-upload-section">
    <label class="section-label">{{ $t('claims.attachPhotos') }}</label>

    <div class="upload-area">
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx"
        class="file-input"
        @change="handleFileSelect"
      />

      <pv-button
        :label="$t('claims.selectFiles')"
        icon="pi pi-upload"
        severity="secondary"
        outlined
        @click="triggerFileInput"
      />

      <p class="upload-hint">{{ $t('claims.uploadHint') }}</p>
    </div>

    <div v-if="fileList.length > 0" class="file-list">
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="file-item"
      >
        <div class="file-info">
          <i :class="getFileIcon(file.type)" class="file-icon"></i>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>

        <div class="file-actions">
          <pv-button
            v-if="isImage(file.type)"
            icon="pi pi-eye"
            severity="info"
            text
            rounded
            @click="previewFile(file, index)"
          />
          <pv-button
            icon="pi pi-times"
            severity="danger"
            text
            rounded
            @click="removeFile(index)"
          />
        </div>
      </div>
    </div>

    <pv-dialog
      v-model:visible="showPreview"
      :header="previewFileName"
      :modal="true"
      :style="{ width: '80vw', maxWidth: '800px' }"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        :alt="previewFileName"
        class="preview-image"
      />
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const fileList = ref([...props.modelValue])
const showPreview = ref(false)
const previewUrl = ref('')
const previewFileName = ref('')

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    if (file.size > props.maxFileSize) {
      alert(`El archivo ${file.name} excede el tamaño máximo permitido de ${formatFileSize(props.maxFileSize)}`)
      return
    }

    if (fileList.value.length >= props.maxFiles) {
      alert(`Solo puedes subir un máximo de ${props.maxFiles} archivos`)
      return
    }

    fileList.value.push(file)
  })

  emit('update:modelValue', fileList.value)

  event.target.value = ''
}

const removeFile = (index) => {
  fileList.value.splice(index, 1)
  emit('update:modelValue', fileList.value)
}

const previewFile = (file, index) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
    previewFileName.value = file.name
    showPreview.value = true
  }
  reader.readAsDataURL(file)
}

const isImage = (fileType) => {
  return fileType.startsWith('image/')
}

const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return 'pi pi-image'
  if (fileType.includes('pdf')) return 'pi pi-file-pdf'
  if (fileType.includes('word') || fileType.includes('document')) return 'pi pi-file-word'
  return 'pi pi-file'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped>
.file-upload-section {
  margin-bottom: 1.5rem;
}

.section-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #9ca3af;
  background: #f3f4f6;
}

.file-input {
  display: none;
}

.upload-hint {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.file-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s;
}

.file-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 1.5rem;
  color: #6366f1;
  flex-shrink: 0;
}

.file-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 0.8rem;
  color: #6b7280;
}

.file-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
}

@media (max-width: 640px) {
  .upload-area {
    padding: 1rem;
  }

  .file-item {
    padding: 0.5rem 0.75rem;
  }

  .file-name {
    font-size: 0.85rem;
  }
}
</style>
