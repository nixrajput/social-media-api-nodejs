import ResponseMessages from "../contants/responseMessages.js";
import models from "../models/index.js";
import utility from "../utils/utility.js";
import eventTypes from "./eventTypes.js";

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
                const { message, iv, type, receiverId } = payload;

                if (!message || !iv || !type || !receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const chatMessage = await models.ChatMessage.create({
                    message,
                    iv,
                    type,
                    sender: ws.userId,
                    receiver: receiverId,
                });

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    const chatMessageData = await utility.getChatData(chatMessage._id);
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

                let currentPage = parseInt(payload.page) || 1;
                let limit = parseInt(payload.limit) || 2;

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
                let totalPages = Math.ceil(totalMessages / limit);

                if (currentPage < 1) {
                    currentPage = 1;
                }

                if (currentPage > totalPages) {
                    currentPage = totalPages;
                }

                let skip = (currentPage - 1) * limit;

                let hasPrevPage = false;
                let prevPage = null;
                let hasNextPage = false;
                let nextPage = null;

                if (currentPage < totalPages) {
                    nextPage = currentPage + 1;
                    hasNextPage = true;
                }

                if (currentPage > 1) {
                    prevPage = currentPage - 1;
                    hasPrevPage = true;
                }

                const slicedMessages = messages.slice(skip, skip + limit);

                const results = await Promise.all(
                    slicedMessages.map(async (message) => {
                        return await utility.getChatData(message._id);
                    })
                );

                client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGES_RECEIVED,
                        currentPage,
                        totalPages,
                        limit,
                        hasPrevPage,
                        prevPage,
                        hasNextPage,
                        nextPage,
                        results,
                    })
                );

                slicedMessages.forEach(async (message) => {
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

                console.log(err);
            }
            break;

        case eventTypes.GET_ALL_MESSAGES:
            try {
                const receiverId = ws.userId;

                let currentPage = parseInt(payload.page) || 1;
                let limit = parseInt(payload.limit) || 2;

                console.log(req.url);

                if (!receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const messages = await models.ChatMessage.find({
                    receiver: receiverId,
                }).select("_id").sort({ createdAt: -1 });

                let totalMessages = messages.length;
                let totalPages = Math.ceil(totalMessages / limit);

                if (currentPage < 1) {
                    currentPage = 1;
                }

                if (currentPage > totalPages) {
                    currentPage = totalPages;
                }

                let skip = (currentPage - 1) * limit;

                let hasPrevPage = false;
                let prevPage = null;
                let hasNextPage = false;
                let nextPage = null;

                if (currentPage < totalPages) {
                    nextPage = currentPage + 1;
                    hasNextPage = true;
                }

                if (currentPage > 1) {
                    prevPage = currentPage - 1;
                    hasPrevPage = true;
                }

                const slicedMessages = messages.slice(skip, skip + limit);

                const results = await Promise.all(
                    slicedMessages.map(async (message) => {
                        return await utility.getChatData(message._id);
                    })
                );

                client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGES_RECEIVED,
                        currentPage,
                        totalPages,
                        limit,
                        hasPrevPage,
                        prevPage,
                        hasNextPage,
                        nextPage,
                        results,
                    })
                );
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

        case eventTypes.SAVE_PUBLIC_KEY:
            try {
                const { publicKey } = payload;

                if (!publicKey) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const user = await models.User.findById(ws.userId);

                if (!user) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.USER_NOT_FOUND
                    }));
                }

                user.publicKey = publicKey;
                await user.save();

                client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.PUBLIC_KEY_SAVED,
                    })
                );

            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        message: ResponseMessages.PUBLIC_KEY_NOT_SAVED,
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