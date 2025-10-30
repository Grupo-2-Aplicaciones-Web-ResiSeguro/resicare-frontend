<template>
  <div class="conversation-list">
    <div class="list-header">
      <h3>{{ t('chat.conversations') }}</h3>
      <pv-button
        v-if="showRefreshButton"
        icon="pi pi-refresh"
        text
        rounded
        @click="$emit('refresh')"
        :loading="loading"
      />
    </div>

    <div v-if="loading && conversations.length === 0" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>{{ t('chat.loadingConversations') }}</p>
    </div>

    <div v-else-if="conversations.length === 0" class="empty-state">
      <i class="pi pi-inbox" style="font-size: 3rem; color: #ccc"></i>
      <p>{{ t('chat.noConversations') }}</p>
    </div>

    <div v-else class="conversations-container">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        :class="[
          'conversation-item',
          { 'active': conversation.id === selectedConversationId },
          { 'has-unread': conversation.hasUnreadMessages() }
        ]"
        @click="$emit('select-conversation', conversation)"
      >
        <div class="conversation-info">
          <div class="conversation-header">
            <h4 class="client-name">{{ conversation.clientName }}</h4>
            <span class="timestamp">{{ conversation.getLastActivityTime() }}</span>
          </div>

          <div class="conversation-details">
            <p class="last-message">
              {{ conversation.getLastMessagePreview(40) }}
            </p>
            <div class="meta-info">
              <span class="claim-id">
                <i class="pi pi-file"></i>
                {{ t('chat.claim') }}: #{{ conversation.claimId }}
              </span>
            </div>
          </div>
        </div>

        <div class="conversation-badges">
          <span
            v-if="conversation.hasUnreadMessages()"
            class="unread-badge"
          >
            {{ conversation.unreadCount }}
          </span>
          <span
            :class="['status-indicator', `status-${conversation.status}`]"
            :title="getStatusLabel(conversation.status)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  conversations: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedConversationId: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  showRefreshButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select-conversation', 'refresh'])

function getStatusLabel(status) {
  const statusLabels = {
    active: t('chat.status.active'),
    pending: t('chat.status.pending'),
    closed: t('chat.status.closed')
  }
  return statusLabels[status] || status
}
</script>

<style scoped>
.conversation-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border, #e5e7eb);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  background: var(--vt-c-indigo, #2c3e50);
  color: white;
}

.list-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #666;
  padding: 2rem;
}

.conversations-container {
  flex: 1;
  overflow-y: auto;
  background: var(--vt-c-white-soft, #f8f8f8);
}

.conversation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  margin-bottom: 1px;
}

.conversation-item:hover {
  background: var(--vt-c-white-mute, #f2f2f2);
}

.conversation-item.active {
  background: #e0f2f1;
  border-left: 4px solid hsla(160, 100%, 37%, 1);
  padding-left: calc(1.5rem - 4px);
}

.conversation-item.has-unread {
  background: #fff9e6;
  border-left: 3px solid #fbbf24;
  padding-left: calc(1.5rem - 3px);
}

.conversation-item.has-unread:hover {
  background: #fef3c7;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.client-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vt-c-text-light-1, #2c3e50);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timestamp {
  font-size: 0.75rem;
  color: #999;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.conversation-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.last-message {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.claim-id {
  font-size: 0.75rem;
  color: #999;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.conversation-badges {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
}

.unread-badge {
  background: #ef4444;
  color: white;
  border-radius: 50%;
  min-width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.status-active {
  background: #22c55e;
}

.status-pending {
  background: #f59e0b;
}

.status-closed {
  background: #9ca3af;
}

/* Scrollbar styling */
.conversations-container::-webkit-scrollbar {
  width: 6px;
}

.conversations-container::-webkit-scrollbar-track {
  background: var(--vt-c-white-mute, #f2f2f2);
}

.conversations-container::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 3px;
}

.conversations-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}

@media (max-width: 768px) {
  .list-header {
    padding: 0.75rem 1rem;
  }

  .list-header h3 {
    font-size: 1.125rem;
  }

  .conversation-item {
    padding: 0.75rem 1rem;
  }

  .client-name {
    font-size: 0.9375rem;
  }

  .last-message {
    font-size: 0.8125rem;
  }
}
</style>
