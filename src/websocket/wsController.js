import ResponseMessages from "../contants/responseMessages.js";
import models from "../models/index.js";
import utility from "../utils/utility.js";
import eventTypes from "./eventTypes.js";
import { sendNotification } from "../firebase/index.js";

const wsController = async (ws, message, wssClients, req) => {
    const { type, payload } = JSON.parse(message);

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

    switch (type) {
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

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    const chatMessageData = await utility.getChatData(chatMessage._id);
                    const fcmToken = await models.User.findOne({ _id: receiverId }, { fcmToken: 1 });

                    if (fcmToken) {
                        sendNotification(
                            fcmToken,
                            "New Message",
                            "You have received a new message",
                            "chat",
                            chatMessageData,
                        );
                    }

                    receiver.send(JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                        data: chatMessageData
                    }));

                    chatMessage.delivered = true;
                    chatMessage.deliveredAt = Date.now();
                    await chatMessage.save();
                }

                const chatMessageData = await utility.getChatData(chatMessage._id);

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

                console.log(err);
            }
            break;

        case eventTypes.GET_UNDELIVERED_MESSAGES:
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
                }).sort({ createdAt: -1 });

                let totalMessages = messages.length;

                if (totalMessages > 0) {

                    for (let i = 0; i < totalMessages; i++) {
                        const chatMessageData = await utility.getChatData(messages[i]._id);
                        client.send(JSON.stringify({
                            success: true,
                            message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                            data: chatMessageData
                        }));

                        messages[i].delivered = true;
                        messages[i].deliveredAt = Date.now();
                        await messages[i].save();
                    }
                }
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGES_NOT_RECEIVED,
                    })
                );

                console.log(err);
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

                if (message.seen) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGE_ALREADY_READ
                    }));
                }

                message.seen = true;
                message.seenAt = Date.now();
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

                console.log(err);
            }
            break;

        case eventTypes.MESSAGE_DELETED:
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

                if (message.sender.toString() !== ws.userId.toString()) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.UNAUTHORIZED
                    }));
                }

                if (message.deleted) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGE_ALREADY_DELETED
                    }));
                }

                message.deleted = true;
                message.deletedAt = Date.now();
                await message.save();

                client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_FAILURE,
                    })
                );

                console.log(err);
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

export default wsController;