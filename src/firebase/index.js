import admin from "firebase-admin";

const app = admin.initializeApp({
    credential: admin.credential.cert("src/config/admin-sdk.json"),
})

const fcm = admin.messaging(app);

export const verifyToken = async (token) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (err) {
        return err;
    }
};

export const sendNotification = async (token,
    {
        title = "",
        body = "",
        type = "",
        image = "",
    }
) => {
    const message = {
        data: {
            title,
            body,
            type,
            image,
        },
        token,
    };

    console.log(message);
    try {
        const response = await fcm.send(message);
        console.log("[firebase] successfully sent message:", response);
        return response;
    } catch (err) {
        console.log("[firebase] error sending message:", err);
        return err;
    }
}

export const sendNotificationToTopic = async (topic, title, body) => {
    const message = {
        notification: {
            title,
            body,
        },
        topic,
    };

    try {
        const response = await fcm.send(message);
        return response;
    } catch (err) {
        return err;
    }
}

export const subscribeToTopic = async (token, topic) => {
    try {
        const response = await fcm.subscribeToTopic(token, topic);
        return response;
    } catch (err) {
        return err;
    }
}

export const unsubscribeFromTopic = async (token, topic) => {
    try {
        const response = await fcm.unsubscribeFromTopic(token, topic);
        return response;
    } catch (err) {
        return err;
    }
}

export const sendNotificationToMultipleTokens = async (tokens, title, body) => {
    const message = {
        notification: {
            title,
            body,
        },
        tokens,
    };

    try {
        const response = await fcm.sendMulticast(message);
        return response;
    } catch (err) {
        return err;
    }
}

export const sendNotificationToMultipleTopics = async (topics, title, body) => {
    const message = {
        notification: {
            title,
            body,
        },
        topics,
    };

    try {
        const response = await fcm.sendMulticast(message);
        return response;
    } catch (err) {
        return err;
    }
}


