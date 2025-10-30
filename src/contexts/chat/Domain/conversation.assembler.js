import { Conversation } from './conversation.entity.js'
export class ConversationAssembler {
  /**
   * Convert API response to Conversation entity
   * @param {Object} data - Raw API response object
   * @returns {Conversation}
   */
  static toEntity(data) {
    return new Conversation({
      id: data.id,
      claimId: data.claimId,
      clientId: data.clientId,
      clientName: data.clientName,
      adviserId: data.adviserId || null,
      adviserName: data.adviserName || null,
      status: data.status || 'pending',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      unreadCount: data.unreadCount || 0,
      lastMessageContent: data.lastMessageContent || null,
      lastMessageAt: data.lastMessageAt || null
    })
  }

  /**
   * Convert array of API responses to Conversation entities
   * @param {Array} dataArray - Array of raw API response objects
   * @returns {Array<Conversation>}
   */
  static toEntities(dataArray) {
    if (!Array.isArray(dataArray)) {
      return []
    }
    return dataArray.map(data => this.toEntity(data))
  }

  /**
   * Convert API response object to Conversation entities
   * Handles both single objects and arrays
   * @param {Object|Array} response - API response (can be {data: []} or direct array)
   * @returns {Array<Conversation>}
   */
  static toEntitiesFromResponse(response) {
    if (response && response.data) {
      return this.toEntities(response.data)
    }
    return this.toEntities(response)
  }

  /**
   * Convert Conversation entity to API request format
   * @param {Conversation} conversation - Conversation entity
   * @returns {Object}
   */
  static toApiFormat(conversation) {
    return {
      claimId: conversation.claimId,
      clientId: conversation.clientId,
      clientName: conversation.clientName,
      adviserId: conversation.adviserId,
      adviserName: conversation.adviserName,
      status: conversation.status,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      unreadCount: conversation.unreadCount,
      lastMessageContent: conversation.lastMessageContent,
      lastMessageAt: conversation.lastMessageAt ? conversation.lastMessageAt.toISOString() : null
    }
  }

  /**
   * Create a new conversation object for API request (without ID)
   * @param {Object} params - Conversation parameters
   * @returns {Object}
   */
  static createNewConversation({ claimId, clientId, clientName }) {
    const now = new Date().toISOString()
    return {
      claimId,
      clientId,
      clientName,
      adviserId: null,
      adviserName: null,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      unreadCount: 0,
      lastMessageContent: null,
      lastMessageAt: null
    }
  }

  /**
   * Update conversation with new message metadata
   * @param {Conversation} conversation - Conversation entity
   * @param {string} messageContent - Content of the new message
   * @returns {Object} - Updated conversation data for API
   */
  static updateWithNewMessage(conversation, messageContent) {
    return {
      ...this.toApiFormat(conversation),
      lastMessageContent: messageContent,
      lastMessageAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}
