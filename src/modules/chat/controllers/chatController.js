import ResponseMessages from "../../../contants/responseMessages.js";
import models from "../../../models/index.js";
import utility from "../../../utils/utility.js";
import eventTypes from "../constants/eventTypes.js";

const chatController = async (ws, message, wssClients) => {
    const { action, payload } = JSON.parse(message);

    const client = wssClients.find((client) => client.userId === ws.userId);

    if (!client) {
        ws.send(
            JSON.stringify({
                success: false,
                message: ResponseMessages.CLIENT_NOT_CONNECTED,
            })
        );
        ws.close();
        return;
    }

    switch (action) {
        case eventTypes.SEND_MESSAGE:
            try {
                const { message, type, receiverId } = payload;

                if (!message || !type || !receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const chatMessage = await models.ChatMessage.create({
                    message,
                    type,
                    sender: ws.userId,
                    receiver: receiverId,
                });

                const chatMessageData = await utility.getChatData(chatMessage._id);

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                        data: chatMessageData
                    }));

                    chatMessage.delivered = true;
                    chatMessage.deliveredAt = Date.now();
                    await chatMessage.save();
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGE_SENT_SUCCESS,
                        data: chatMessageData,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGE_NOT_SENT,
                    })
                );
            }
            break;

        case eventTypes.GET_MESSAGES:
            try {
                const receiverId = ws.userId;

                if (!receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const messages = await models.ChatMessage.find({
                    receiver: receiverId,
                    delivered: false,
                });

                const chatMessages = await Promise.all(
                    messages.map(async (message) => {
                        return await utility.getChatData(message._id);
                    })
                );

                client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGES_RECEIVED,
                        count: chatMessages.length,
                        data: chatMessages,
                    })
                );

                messages.forEach(async (message) => {
                    message.delivered = true;
                    message.deliveredAt = Date.now();
                    await message.save();
                });
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGES_NOT_RECEIVED,
                    })
                );
            }
            break;

        case eventTypes.MESSAGE_READ:
            try {
                const { messageId } = payload;

                if (!messageId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const message = await models.ChatMessage.findById(messageId);

                if (!message) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGE_NOT_FOUND
                    }));
                }

                if (message.receiver.toString() !== ws.userId.toString()) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.UNAUTHORIZED
                    }));
                }

                if (message.read) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGE_ALREADY_READ
                    }));
                }

                message.read = true;
                message.readAt = Date.now();
                await message.save();

                client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGE_READ_SUCCESS,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGE_READ_FAILURE,
                    })
                );
            }
            break;

        default:
            ws.send(
                JSON.stringify({
                    success: false,
                    message: ResponseMessages.INVALID_ACTION,
                })
            );
            break;
    }
};

export default chatController;