import getMessagesById from './getMessagesById.js';
import getAllLastMessages from './getAllLastMessages.js';

const chatController = {};

chatController.getMessagesById = getMessagesById;
chatController.getAllLastMessages = getAllLastMessages;

export default chatController;