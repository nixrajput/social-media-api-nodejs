import cloudinary from "cloudinary";
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
                type: 'error',
                message: ResponseMessages.CLIENT_NOT_CONNECTED,
            })
        );
        ws.close();
        return;
    }

    switch (type) {
        case eventTypes.SEND_MESSAGE:
            try {
                const {
                    message, receiverId,
                    mediaFile, replyTo, tempId,
                } = payload;

                if ((!message && !mediaFile) || !receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                if (receiverId === ws.userId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CANNOT_MESSAGE_YOURSELF
                    }));
                }

                if (mediaFile) {
                    if (!mediaFile.public_id) {
                        return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
                    }
                    if (!mediaFile.url) {
                        return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
                    }
                    if (!mediaFile.mediaType) {
                        return next(new ErrorHandler(ResponseMessages.MEDIA_TYPE_REQUIRED, 400));
                    }
                    if (mediaFile.mediaType === "video" && !mediaFile.thumbnail) {
                        return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_REQUIRED, 400));
                    }

                    if (mediaFile.mediaType === "video" && !mediaFile.thumbnail.public_id) {
                        return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_PUBLIC_ID_REQUIRED, 400));
                    }

                    if (mediaFile.mediaType === "video" && !mediaFile.thumbnail.url) {
                        return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_URL_REQUIRED, 400));
                    }
                }

                const chatMessage = await models.ChatMessage.create({
                    message: message,
                    sender: ws.userId,
                    receiver: receiverId,
                    mediaFile: mediaFile,
                    replyTo: replyTo,
                    tempId: tempId,
                });

                const chatMessageData = await utility.getChatData(chatMessage._id);

                const fcmToken = await models.FcmToken.findOne({ user: receiverId })
                    .select("token");

                if (fcmToken) {
                    let name = `${chatMessageData.sender.fname} ${chatMessageData.sender.lname}`;
                    await sendNotification(
                        fcmToken.token,
                        {
                            title: name,
                            body: name + " sent you a message.",
                            type: "Chats",
                            image: chatMessageData.sender.avatar.url,
                        }
                    );
                }

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'message',
                        message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                        data: chatMessageData
                    }));

                    chatMessage.delivered = true;
                    chatMessage.deliveredAt = Date.now();
                    await chatMessage.save();
                }

                const updatedChatMessageData = await utility.getChatData(chatMessage._id);

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'message',
                        message: ResponseMessages.CHAT_MESSAGE_SENT_SUCCESS,
                        data: updatedChatMessageData,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
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
                        type: 'error',
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
                            type: 'message',
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
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGES_NOT_RECEIVED,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.READ_MESSAGE:
            try {
                const { messageId } = payload;

                if (!messageId) {
                    return ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.INVALID_DATA
                        })
                    );
                }

                const message = await models.ChatMessage.findById(messageId);

                if (!message) {
                    return ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CHAT_MESSAGE_NOT_FOUND
                        })
                    );
                }

                if (message.receiver.toString() !== ws.userId.toString()) {
                    return ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.UNAUTHORIZED
                        })
                    );
                }

                if (message.seen) {
                    return ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.CHAT_MESSAGE_ALREADY_READ
                        })
                    );
                }

                message.seen = true;
                message.seenAt = Date.now();
                await message.save();

                const chatMessageData = await utility.getChatData(message._id);

                let senderId = message.sender.toHexString();

                const sender = wssClients.find(
                    (client) => client.userId === senderId
                );

                if (sender) {
                    sender.send(JSON.stringify({
                        success: true,
                        type: 'message',
                        message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                        data: chatMessageData
                    }));
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'message',
                        message: ResponseMessages.CHAT_MESSAGE_READ_SUCCESS,
                        data: chatMessageData,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_READ_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.DELETE_MESSAGE:
            try {
                const { messageId } = payload;

                if (!messageId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));

                }

                const message = await models.ChatMessage.findById(messageId);
                const receiverId = message.receiver.toHexString();

                if (!message) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_NOT_FOUND
                    }));
                }

                if (message.sender.toString() !== ws.userId.toString()) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.UNAUTHORIZED
                    }));
                }

                if (message.mediaFile && message.mediaFile.public_id && message.mediaFile.public_id !== '') {
                    let publicId = message.mediaFile.public_id;
                    let mediaType = message.mediaFile.mediaType;

                    if (mediaType === "video") {
                        let thumbnailPublicId = message.mediaFile.thumbnail.public_id;
                        if (thumbnailPublicId) {
                            await cloudinary.v2.uploader.destroy(thumbnailPublicId);
                        }
                        await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });
                    } else {
                        await cloudinary.v2.uploader.destroy(publicId);
                    }
                }

                await message.remove();

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'messageDelete',
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                        messageId: messageId,
                    }));
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        type: 'messageDelete',
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                        messageId: messageId,
                    })
                );
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.DELETE_MESSAGES:
            try {
                const { messageIds } = payload;

                if (!messageIds || messageIds.length === 0) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const messages = await models.ChatMessage.find({
                    _id: {
                        $in: messageIds
                    }
                });

                if (!messages || messages.length === 0) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_NOT_FOUND
                    }));
                }

                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i];
                    const receiverId = message.receiver.toHexString();

                    if (message.sender.toString() !== ws.userId.toString()) {
                        return ws.send(JSON.stringify({
                            success: false,
                            type: 'error',
                            message: ResponseMessages.UNAUTHORIZED
                        }));
                    }

                    if (message.mediaFile && message.mediaFile.public_id && message.mediaFile.public_id !== '') {
                        let publicId = message.mediaFile.public_id;
                        let mediaType = message.mediaFile.mediaType;

                        if (mediaType === "video") {
                            let thumbnailPublicId = message.mediaFile.thumbnail.public_id;
                            if (thumbnailPublicId) {
                                await cloudinary.v2.uploader.destroy(thumbnailPublicId);
                            }
                            await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });
                        } else {
                            await cloudinary.v2.uploader.destroy(publicId);
                        }
                    }

                    await message.remove();

                    const receiver = wssClients.find(
                        (client) => client.userId === receiverId
                    );

                    if (receiver) {
                        receiver.send(JSON.stringify({
                            success: true,
                            type: 'messageDelete',
                            message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                            messageId: message._id,
                        }));
                    }

                    client.send(
                        JSON.stringify({
                            success: true,
                            type: 'messageDelete',
                            message: ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS,
                            messageId: message._id,
                        })
                    );
                }
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_DELETE_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.MESSAGE_TYPING:
            try {
                const { receiverId, status } = payload;

                if (!receiverId || !status) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                const receiver = wssClients.find(
                    (client) => client.userId === receiverId
                );

                if (receiver) {
                    receiver.send(JSON.stringify({
                        success: true,
                        type: 'messageTyping',
                        message: ResponseMessages.CHAT_MESSAGE_TYPING,
                        data: {
                            senderId: ws.userId,
                            status: status
                        }
                    }));
                }
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.CHAT_MESSAGE_TYPING_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.GET_ONLINE_USERS:
            try {
                let currentUser = await models.User.findById(ws.userId)
                    .select("showOnlineStatus");

                if (currentUser.showOnlineStatus === false) {
                    return;
                }

                const onlineUsers = wssClients
                    .filter(client => client.userId !== ws.userId)
                    .map(client => client.userId);

                ws.send(JSON.stringify({
                    success: true,
                    type: 'onlineUsers',
                    message: ResponseMessages.ONLINE_USERS,
                    data: onlineUsers
                }));
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.ONLINE_USERS_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        case eventTypes.CHECK_ONLINE_USERS:
            try {
                const { userIds } = payload;

                if (!userIds || userIds.length === 0) {
                    return ws.send(JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                let currentUser = await models.User.findById(ws.userId)
                    .select("showOnlineStatus");

                if (currentUser.showOnlineStatus === false) {
                    return;
                }

                for (let i = 0; i < userIds.length; i++) {
                    const userId = userIds[i];

                    let user = await models.User.findById(userId)
                        .select("showOnlineStatus");

                    if (user.showOnlineStatus === true) {
                        let onlineUser = wssClients.find(
                            (client) => client.userId === userId
                        );

                        if (onlineUser) {
                            client.send(
                                JSON.stringify({
                                    success: true,
                                    type: 'onlineStatus',
                                    message: "user online",
                                    data: {
                                        userId: userId,
                                        status: "online",
                                    },
                                })
                            );
                        }
                    }
                }

            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
                        message: ResponseMessages.ONLINE_USERS_FAILURE,
                    })
                );

                console.log(err);
            }
            break;

        default:
            ws.send(
                JSON.stringify({
                    success: false,
                    type: 'error',
                    message: ResponseMessages.INVALID_ACTION,
                })
            );
            break;
    }
};

export default wsController;