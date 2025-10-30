export class Conversation {
  /**
   * @param {string} id - Unique conversation identifier
   * @param {string} claimId - ID of the associated claim
   * @param {string} clientId - ID of the client user
   * @param {string} clientName - Name of the client
   * @param {string|null} adviserId - ID of the assigned adviser (null if unassigned)
   * @param {string|null} adviserName - Name of the assigned adviser
   * @param {string} status - Conversation status ('active', 'closed', 'pending')
   * @param {Date} createdAt - When the conversation was created
   * @param {Date} updatedAt - Last activity timestamp
   * @param {number} unreadCount - Number of unread messages
   * @param {string|null} lastMessageContent - Preview of last message
   * @param {Date|null} lastMessageAt - Timestamp of last message
   */
  constructor({
    id,
    claimId,
    clientId,
    clientName,
    adviserId = null,
    adviserName = null,
    status = 'pending',
    createdAt,
    updatedAt,
    unreadCount = 0,
    lastMessageContent = null,
    lastMessageAt = null
  }) {
    this.id = id
    this.claimId = claimId
    this.clientId = clientId
    this.clientName = clientName
    this.adviserId = adviserId
    this.adviserName = adviserName
    this.status = status
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt)
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt)
    this.unreadCount = unreadCount
    this.lastMessageContent = lastMessageContent
    this.lastMessageAt = lastMessageAt ? (lastMessageAt instanceof Date ? lastMessageAt : new Date(lastMessageAt)) : null
  }

  /**
   * Check if conversation is active
   * @returns {boolean}
   */
  isActive() {
    return this.status === 'active'
  }

  /**
   * Check if conversation is closed
   * @returns {boolean}
   */
  isClosed() {
    return this.status === 'closed'
  }

  /**
   * Check if conversation is pending adviser assignment
   * @returns {boolean}
   */
  isPending() {
    return this.status === 'pending'
  }

  /**
   * Check if conversation has unread messages
   * @returns {boolean}
   */
  hasUnreadMessages() {
    return this.unreadCount > 0
  }

  /**
   * Check if adviser is assigned
   * @returns {boolean}
   */
  hasAdviser() {
    return this.adviserId !== null
  }

  /**
   * Get formatted last activity time
   * @returns {string}
   */
  getLastActivityTime() {
    const date = this.lastMessageAt || this.updatedAt
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  /**
   * Get preview of last message (truncated)
   * @param {number} maxLength - Maximum characters to show
   * @returns {string}
   */
  getLastMessagePreview(maxLength = 50) {
    if (!this.lastMessageContent) return 'Sin mensajes'

    if (this.lastMessageContent.length <= maxLength) {
      return this.lastMessageContent
    }

    return this.lastMessageContent.substring(0, maxLength) + '...'
  }
}
