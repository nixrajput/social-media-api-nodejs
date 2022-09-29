import ResponseMessages from "../contants/responseMessages.js";
import models from "../models/index.js";
import utility from "../utils/utility.js";
import eventTypes from "./eventTypes.js";
import mongoose from 'mongoose';

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

        case eventTypes.GET_MESSAGE_BY_ID:
            try {
                const loggedInUserId = ws.userId;
                const { userId } = payload;

                if (!loggedInUserId || !userId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                let currentPage = parseInt(payload?.page) || 1;
                let limit = parseInt(payload?.limit) || 10;

                let totalMessages = await models.ChatMessage.countDocuments({
                    $or: [
                        { $and: [{ sender: userId }, { receiver: loggedInUserId }] },
                        { $and: [{ sender: loggedInUserId }, { receiver: userId }] },
                    ],
                });
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

                const messages = await models.ChatMessage.find({
                    $or: [
                        { $and: [{ sender: userId }, { receiver: loggedInUserId }] },
                        { $and: [{ sender: loggedInUserId }, { receiver: userId }] },
                    ],
                }).select("_id").sort({ createdAt: -1 })
                    .skip(skip).limit(limit);

                const results = await Promise.all(
                    messages.map(async (message) => {
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

        case eventTypes.GET_ALL_CONVERSATIONS:
            try {
                const receiverId = ws.userId;

                if (!receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                let currentPage = parseInt(payload?.page) || 1;
                let limit = parseInt(payload?.limit) || 10;

                let totalMessages = await models.ChatMessage.aggregate([
                    {
                        $match: {
                            $or: [
                                { "sender": mongoose.Types.ObjectId(`${receiverId}`) },
                                { "receiver": mongoose.Types.ObjectId(`${receiverId}`) },
                            ]
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    {
                        $group: {
                            "_id": { $setUnion: [["$sender", "$receiver"]] },
                            "message": { $first: "$$ROOT._id" }
                        }
                    },
                ]).exec();

                //console.log(totalMessages.length);

                let totalPages = Math.ceil(totalMessages.length / limit);

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

                const filteredMessages = totalMessages.slice(skip, skip + limit);

                const results = await Promise.all(
                    filteredMessages.map(async (message) => {
                        return await utility.getChatData(message.message);
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