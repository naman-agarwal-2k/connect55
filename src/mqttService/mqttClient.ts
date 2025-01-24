import mqtt from "mqtt";
import { Chat } from "../models/chat";
import * as ngrok from 'ngrok';
import { sendNotification } from "../firebase/utility";
import user from "../models/user";
import { scheduleUnseenNotification } from "./utility";

// Declare mqttClient as a global variable so it can be accessed in other files
let mqttClient: mqtt.MqttClient;

// Function to start Ngrok and connect to MQTT
const startMqttWithNgrok = async () => {
  try {
    // const httpUrl= await ngrok.connect(9001)
    // console.log(httpUrl)
    // // Start Ngrok to expose the local MQTT port (e.g., 1883)
    // const url = await ngrok.connect({ proto: 'tcp', addr: 1883 });  // Change port if necessary
    // console.log('Ngrok Tunnel URL:', url);

    // // Parse the TCP URL from Ngrok's output (convert HTTP to TCP for MQTT)
    // const mqttUrl = url.replace('http', 'tcp');
    const brokerUrl = 'mqtt://localhost:1883';

    // MQTT broker connection
    mqttClient = mqtt.connect(brokerUrl);

    // On successful connection to the MQTT broker
    mqttClient.on("connect", () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe('chat/+/messages', (err) => {
        if (err) {
          console.error('Failed to subscribe to chat topics', err);
        } else {
          console.log("Subscribed to 'chat/+/messages'");
        }
      });
    });

    // Handling incoming MQTT messages
    // mqttClient.on('message', async (topic, message) => {
    //   console.log('Message received:', message);
    //   try {
    //     console.log('topic:',topic)
    //     const topicParts = topic.split('/');

    //     //  chatId from the topic
    //     const chatId = topicParts[1];

    //     // Parse the message content
    //     const parsedMessage = JSON.parse(message.toString());
        
    //     // Ignore messages originating from the server
    //     // if (parsedMessage.origin === 'server') return;

    //     const chat = await Chat.findById(chatId).populate("participants").exec();
        
    //     if (chat) {
    //       const participants = chat.participants;
    //       const recipients = participants.filter((user: any) => 
    //       user._id.toString() !== parsedMessage.senderId && 
    //       !parsedMessage.seenBy.includes(user._id.toString())
    //   );


    //       const allDeviceTokens: string[] = recipients
    //         .flatMap((user:any) => user.deviceTokens) // Flatten all device token arrays
    //         .filter(Boolean); // Remove any undefined or null tokens
      
    //     console.log("Device Tokens:", allDeviceTokens);
    //     // Send notification to participants
    //     if (allDeviceTokens.length > 0) {
    //     await sendNotification(allDeviceTokens, {
    //         title: "New Message",
    //         body: parsedMessage.content || "You have a new message!",
    //         data: { chatId },
    //     });}
        
    //       chat.messages.push(parsedMessage);
    //       await chat.save();

    //       console.log('Message received and saved:', parsedMessage);
    //     } else {
    //       console.error(`Chat with ID ${chatId} not found`);
    //     }
    //   } catch (err) {
    //     console.error('Error processing received MQTT message', err);
    //   }
    // });

    mqttClient.on('message',async (topic,message)=>{
      console.log('topic:',topic)
      try{
      const topicParts = topic.split('/');
      const chatId = topicParts[1];
      const parsedMessage = JSON.parse(message.toString());
      const chat = await Chat.findById(chatId).populate("participants").exec();

      // if(topic.startsWith("chat/") && topic.endsWith('/seen')){
      //   if (chat) {
      //     for (const msg of chat.messages) {
      //       if (!msg.seenBy.includes(parsedMessage.userId)) {
      //         msg.seenBy.push(parsedMessage.userId);
      //       }
      //     }
      //     await chat.save();
    
      //     //updated seenBy list to clients
      //     mqttClient.publish(`chat/${chatId}/updates`, JSON.stringify(chat.messages));
      //   }

      //   //Schedule unseen notification
      //   scheduleUnseenNotification(chatId,parsedMessage.messageId,parsedMessage.senderId);
      // }else
       if(chat){
      mqttClient.publish(`chat/${chatId}/messages`, JSON.stringify({message,origin: 'server'}));

      chat.messages.push(parsedMessage);
      await chat.save();
      console.log('Message received and saved:', parsedMessage);
    }else{
        console.error(`Chat with ID ${chatId} not found`);
      }}catch(err){
        console.error('Error processing received MQTT message', err);
      }
    })

    // Handle connection errors
    mqttClient.on('error', (err) => {
      console.error('Failed to connect to MQTT broker:', err.message);
    });

    // Handle connection close
    mqttClient.on('close', () => {
      console.log('MQTT Client connection closed');
    });

    // Handle offline state
    mqttClient.on('offline', () => {
      console.error('MQTT client went offline');
    });

    // Handle disconnection
    mqttClient.on('disconnect', () => {
      console.log('MQTT client disconnected');
    });

    return mqttClient;  // Return mqttClient for use in other files if necessary
  } catch (error) {
    console.error('Error starting Ngrok or connecting to MQTT:', error);
  }
};

// Export both the function and the mqttClient
export { startMqttWithNgrok, mqttClient };

//client side
// const payload = {
//   chatId: parsedMessage.chatId,
//   userId: parsedMessage.userId,
// };
// mqttClient.publish(`chat/${chatId}/seen`, JSON.stringify(payload));