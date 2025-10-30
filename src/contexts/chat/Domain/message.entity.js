export class Message {
  /**
   * @param {string} id - Unique message identifier
   * @param {string} conversationId - ID of the conversation this message belongs to
   * @param {string} senderId - ID of the user who sent the message
   * @param {string} senderName - Name of the sender
   * @param {string} senderRole - Role of sender ('cliente' or 'adviser')
   * @param {string} content - Message text content
   * @param {Date} timestamp - When the message was sent
   * @param {boolean} isRead - Whether the message has been read
   */
  constructor({
    id,
    conversationId,
    senderId,
    senderName,
    senderRole,
    content,
    timestamp,
    isRead = false
  }) {
    this.id = id
    this.conversationId = conversationId
    this.senderId = senderId
    this.senderName = senderName
    this.senderRole = senderRole
    this.content = content
    this.timestamp = timestamp instanceof Date ? timestamp : new Date(timestamp)
    this.isRead = isRead
  }

  /**
   * Check if message was sent by adviser
   * @returns {boolean}
   */
  isFromAdviser() {
    return this.senderRole === 'adviser'
  }

  /**
   * Check if message was sent by client
   * @returns {boolean}
   */
  isFromClient() {
    return this.senderRole === 'cliente'
  }

  /**
   * Format timestamp for display
   * @returns {string}
   */
  getFormattedTime() {
    return this.timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Format full date and time
   * @returns {string}
   */
  getFormattedDateTime() {
    return this.timestamp.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
