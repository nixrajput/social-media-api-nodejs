import ResponseMessages from "../../../contants/responseMessages.js";
import models from "../../../models/index.js";
import utility from "../../../utils/utility.js";

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

    if (action === "send") {

        const { message, type, receiver } = payload;

        if (!message || !type || !receiver) {
            return ws.send(JSON.stringify({
                success: false,
                message: ResponseMessages.INVALID_DATA
            }));
        }

        const sender = ws.userId;

        const chatMessage = await models.ChatMessage.create({
            message,
            type,
            sender,
            receiver,
        });

        if (chatMessage) {
            const chatMessageData = await utility.getChatData(chatMessage._id);

            const receiverClient = wssClients.find(
                (client) => client.userId === receiver
            );

            if (receiverClient) {
                receiverClient.send(JSON.stringify({
                    success: true,
                    message: ResponseMessages.CHAT_MESSAGE_RECEIVED,
                    data: chatMessageData
                }));
            }

            return client.send(
                JSON.stringify({
                    success: true,
                    message: ResponseMessages.CHAT_MESSAGE_SENT_SUCCESS,
                    data: chatMessageData,
                })
            );
        } else {
            return client.send(
                JSON.stringify({
                    success: false,
                    message: ResponseMessages.CHAT_MESSAGE_NOT_SENT,
                })
            );
        }
    }

    if (action === "read") {
        const { messageId, sender, receiver } = JSON.parse(payload);

        const chatMessage = await models.ChatMessage.findOne({
            _id: messageId,
            sender: receiver,
            receiver: sender,
        });

        if (chatMessage.read) {
            return client.send(
                JSON.stringify({
                    success: false,
                    message: ResponseMessages.CHAT_MESSAGE_ALREADY_READ,
                })
            );
        } else {
            chatMessage.read = true;
            chatMessage.readAt = Date.now();

            const updatedChatMessage = await chatMessage.save();

            if (updatedChatMessage) {
                const chatMessageData = await utility.getChatData(updatedChatMessage._id);

                return client.send(
                    JSON.stringify({
                        success: true,
                        message: ResponseMessages.CHAT_MESSAGE_READ_SUCCESS,
                        data: chatMessageData,
                    })
                );
            } else {
                return client.send(
                    JSON.stringify({
                        success: false,
                        message: ResponseMessages.CHAT_MESSAGE_READ_FAILURE,
                    })
                );
            }
        }
    }
};

export default chatController;