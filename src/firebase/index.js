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

export const sendNotification = async (token, title, body, type, data) => {
    const message = {
        notification: {
            title,
            body,
        },
        data: {
            title,
            body,
            type,
            data: JSON.stringify(data),
        },
        token,
    };

    try {
        const response = await fcm.send(message);
        console.log("Successfully sent message:", response);
        return response;
    } catch (err) {
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


