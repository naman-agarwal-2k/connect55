import admin from "firebase-admin";
import path from "path";
import { sendNotification } from "./utility";

const serviceAccountPath = path.join(__dirname, "../firebaseKey.json");

admin.initializeApp({
    credential: admin.credential.cert(process.env.FIREBASE_KEY_PATH!),
});

export default admin;
    //  sendNotification(["d0SdT68qStWu9qqPnqmLbV:APA91bG9D-WotgevmovOu7_WIWIcZYgB0hwpjS0pogZVhIGF7ARIwAhJg1PnDpSOHsQxDuUQ8ZXphvCSVU-a-9zuoU4wQwb3hlPVTt-spy6mBT9CYT-KfQU"], {
    //         title: "New Message",
    //         body: "Reply on team if you see this!",
    //         data: { "chatId" :"testId"},
    //     });