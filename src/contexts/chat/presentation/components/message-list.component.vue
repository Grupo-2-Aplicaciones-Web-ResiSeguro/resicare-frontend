<template>
  <div class="message-list" ref="messageContainer">
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>{{ t('chat.loadingMessages') }}</p>
    </div>

    <div v-else-if="messages.length === 0" class="empty-state">
      <i class="pi pi-comments" style="font-size: 3rem; color: #ccc"></i>
      <p>{{ t('chat.noMessages') }}</p>
      <p class="hint">{{ t('chat.startConversation') }}</p>
    </div>

    <div v-else class="messages-container">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'message-item',
          message.isFromAdviser() ? 'message-adviser' : 'message-client'
        ]"
      >
        <div class="message-bubble">
          <div class="message-header">
            <span class="sender-name">{{ message.senderName }}</span>
            <span class="message-time">{{ message.getFormattedTime() }}</span>
          </div>
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const messageContainer = ref(null)

watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

defineExpose({
  scrollToBottom
})
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: var(--vt-c-white-soft, #f8f8f8);
  display: flex;
  flex-direction: column;
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.empty-state .hint {
  font-size: 0.875rem;
  color: #999;
  margin-top: 0.5rem;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message-item {
  display: flex;
}

.message-client {
  justify-content: flex-end;
}

.message-adviser {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.message-client .message-bubble {
  background: var(--vt-c-indigo, #2c3e50);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-adviser .message-bubble {
  background: white;
  color: var(--vt-c-text-light-1, #2c3e50);
  border: 1px solid var(--color-border, #e5e7eb);
  border-bottom-left-radius: 0.25rem;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.85;
}

.sender-name {
  font-weight: 600;
}

.message-time {
  margin-left: 0.5rem;
}

.message-content {
  font-size: 0.9375rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: var(--vt-c-white-mute, #f2f2f2);
}

.message-list::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}

@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
  }

  .message-list {
    padding: 0.75rem;
  }
}
</style>
