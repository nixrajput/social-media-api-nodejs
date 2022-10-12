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
                message: ResponseMessages.CLIENT_NOT_CONNECTED,
            })
        );
        ws.close();
        return;
    }

    switch (type) {
        case eventTypes.SEND_MESSAGE:
            try {
                const { message, type, receiverId, mediaFiles, replyTo } = payload;

                if (!message || !type || !receiverId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.INVALID_DATA
                    }));
                }

                if (receiverId === ws.userId) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: ResponseMessages.CANNOT_MESSAGE_YOURSELF
                    }));
                }

                if (mediaFiles && mediaFiles.length > 0) {
                    for (let i = 0; i < mediaFiles.length; i++) {
                        if (!mediaFiles[i].public_id) {
                            return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
                        }
                        if (!mediaFiles[i].url) {
                            return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
                        }
                        if (!mediaFiles[i].mediaType) {
                            return next(new ErrorHandler(ResponseMessages.MEDIA_TYPE_REQUIRED, 400));
                        }
                        if (mediaFiles[i].mediaType === "video" && !mediaFiles[i].thumbnail) {
                            return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_REQUIRED, 400));
                        }

                        if (mediaFiles[i].mediaType === "video" && !mediaFiles[i].thumbnail.public_id) {
                            return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_PUBLIC_ID_REQUIRED, 400));
                        }

                        if (mediaFiles[i].mediaType === "video" && !mediaFiles[i].thumbnail.url) {
                            return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_URL_REQUIRED, 400));
                        }
                    }
                }

                const chatMessage = await models.ChatMessage.create({
                    message: message,
                    type: type,
                    sender: ws.userId,
                    receiver: receiverId,
                    mediaFiles: mediaFiles,
                    replyTo: replyTo,
                });

                const chatMessageData = await utility.getChatData(chatMessage._id);

                const fcmToken = await models.User.findOne(
                    { _id: receiverId },
                    { fcmToken: 1 }
                );

                if (fcmToken.fcmToken) {
                    await sendNotification(
                        fcmToken.fcmToken,
                        {
                            title: "New Message",
                            body: chatMessageData.sender.uname + " sent you a message.",
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
                        message: ResponseMessages.CHAT_MESSAGE_SENT_SUCCESS,
                        data: updatedChatMessageData,
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
                const { messageId, senderId } = payload;

                if (!messageId || !senderId) {
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

                const chatMessageData = await utility.getChatData(message._id);

                const sender = wssClients.find(
                    (client) => client.userId === senderId
                );

                if (sender) {
                    sender.send(JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                        data: chatMessageData
                    }));
                }

                client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGE_READ_SUCCESS,
                        data: chatMessageData,
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

                if (message.mediaFiles && message.mediaFiles.length > 0) {
                    for (let i = 0; i < message.mediaFiles.length; i++) {
                        let publicId = message.mediaFiles[i].public_id;
                        let mediaType = message.mediaFiles[i].mediaType;

                        if (mediaType === "video") {
                            let thumbnailPublicId = message.mediaFiles[i].thumbnail.public_id;
                            if (thumbnailPublicId) {
                                await cloudinary.v2.uploader.destroy(thumbnailPublicId);
                            }
                            await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });
                        } else {
                            await cloudinary.v2.uploader.destroy(publicId);
                        }
                    }
                }

                await message.remove();

                // if (message.deleted) {
                //     return ws.send(JSON.stringify({
                //         success: false,
                //         message: ResponseMessages.CHAT_MESSAGE_ALREADY_DELETED
                //     }));
                // }

                // message.deleted = true;
                // message.deletedAt = Date.now();
                // await message.save();

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