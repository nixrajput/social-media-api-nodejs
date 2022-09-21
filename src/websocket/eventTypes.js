const eventTypes = {
    SEND_MESSAGE: "send-message",
    GET_UNDELIVERED_MESSAGES: "get-undelivered-messages",
    GET_ALL_MESSAGES: "get-all-messages",
    MESSAGE_SENT: "message-sent",
    MESSAGE_RECEIVED: "message-received",
    MESSAGE_DELIVERED: "message-delivered",
    MESSAGE_READ: "message-read",
    MESSAGE_DELETED: "message-deleted",
    MESSAGE_UPDATED: "message-updated",
    MESSAGE_ERROR: "message-error",

    GET_ALL_CONVERSATIONS: "get-all-conversations",

    SAVE_PUBLIC_KEY: "save-public-key",
    GET_PUBLIC_KEY: "get-public-key",


    /// CHAT EVENTS
    GET_CHATS: "get-chats",
    CHATS_RECEIVED: "chats-received",
    CHAT_ERROR: "chat-error",
    GET_CHAT_MESSAGES: "get-chat-messages",
    CHAT_MESSAGES_RECEIVED: "chat-messages-received",
    CHAT_MESSAGE_SENT: "chat-message-sent",
    CHAT_MESSAGE_RECEIVED: "chat-message-received",
    CHAT_MESSAGE_DELIVERED: "chat-message-delivered",
    CHAT_MESSAGE_READ: "chat-message-read",
    CHAT_MESSAGE_DELETED: "chat-message-deleted",
    CHAT_MESSAGE_UPDATED: "chat-message-updated",
    CHAT_MESSAGE_ERROR: "chat-message-error",
};

export default eventTypes;