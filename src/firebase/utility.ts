import admin from "./firebase";

interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
}

export const sendNotification = async (
    deviceTokens: string[],
    payload: NotificationPayload
): Promise<void> => {
    try {
        const message = {
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {}, // Additional data
            tokens: deviceTokens, // Array of device tokens
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        console.log("Notifications sent:", response);
    } catch (err) {
        console.error("Error sending notifications:", err);
    }
};
