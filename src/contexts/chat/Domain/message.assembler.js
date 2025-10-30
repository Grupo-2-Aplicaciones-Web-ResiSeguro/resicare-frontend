import { Message } from './message.entity.js'

export class MessageAssembler {
  /**
   * Convert API response to Message entity
   * @param {Object} data - Raw API response object
   * @returns {Message}
   */
  static toEntity(data) {
    return new Message({
      id: data.id,
      conversationId: data.conversationId,
      senderId: data.senderId,
      senderName: data.senderName,
      senderRole: data.senderRole,
      content: data.content,
      timestamp: data.timestamp,
      isRead: data.isRead || false
    })
  }

  /**
   * Convert array of API responses to Message entities
   * @param {Array} dataArray - Array of raw API response objects
   * @returns {Array<Message>}
   */
  static toEntities(dataArray) {
    if (!Array.isArray(dataArray)) {
      return []
    }
    return dataArray.map(data => this.toEntity(data))
  }

  /**
   * Convert API response object to Message entities
   * Handles both single objects and arrays
   * @param {Object|Array} response - API response (can be {data: []} or direct array)
   * @returns {Array<Message>}
   */
  static toEntitiesFromResponse(response) {
    if (response && response.data) {
      return this.toEntities(response.data)
    }
    return this.toEntities(response)
  }

  /**
   * Convert Message entity to API request format
   * @param {Message} message - Message entity
   * @returns {Object}
   */
  static toApiFormat(message) {
    return {
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.senderName,
      senderRole: message.senderRole,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
      isRead: message.isRead
    }
  }

  /**
   * Create a new message object for API request (without ID)
   * @param {Object} params - Message parameters
   * @returns {Object}
   */
  static createNewMessage({ conversationId, senderId, senderName, senderRole, content }) {
    return {
      conversationId,
      senderId,
      senderName,
      senderRole,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    }
  }
}
