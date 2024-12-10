import mqtt from "mqtt";
import { Chat } from "../models/Chat";

//MQTT broker connection
const brokerUrl = 'mqtt://test.mosquitto.org';
// 'mqtt://localhost:1883';
const mqttClient = mqtt.connect(brokerUrl);

const topic = 'chat/messages'
 
//on successfull connection
mqttClient.on("connect",()=>{
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('chat/+/messages', (err) => {
        if (err) {
          console.error('Failed to subscribe to chat topics', err);
        } else {
          console.log("Subscribed to 'chat/+/messages'");
        }
      });
}
);

mqttClient.on('message', async (topic, message) => {
    try {
      const topicParts = topic.split('/');
      const chatId = topicParts[1]; // Extract chatId from topic
  
      // Parse the message content
      const parsedMessage = JSON.parse(message.toString());
  
      // Update the chat in the database
      const chat = await Chat.findById(chatId);
      if (chat) {
        chat.messages.push(parsedMessage);
        await chat.save();
  
        console.log('Message received and saved:', parsedMessage);
      } else {
        console.error(`Chat with ID ${chatId} not found`);
      }
    } catch (err) {
      console.error('Error processing received MQTT message', err);
    }
  });
  
mqttClient.on('error',(err)=>{
    console.error('Failed to connect to MQTT broker:', err.message);
});
  // Handle connection close
  mqttClient.on('close', () => {
    console.log('MQTT Client connection closed');
  });
  mqttClient.on('offline', () => {
    console.error('MQTT client went offline');
  });
  
  mqttClient.on('disconnect', () => {
    console.log('MQTT client disconnected');
  });

export default mqttClient;