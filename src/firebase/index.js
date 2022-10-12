import admin from "firebase-admin";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({
        path: "src/config/config.env",
    });
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "");

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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

    //console.log(message);
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


