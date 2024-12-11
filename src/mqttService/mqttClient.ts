import mqtt from "mqtt";
import { Chat } from "../models/Chat";
import * as ngrok from 'ngrok';

// Declare mqttClient as a global variable so it can be accessed in other files
let mqttClient: mqtt.MqttClient;

// Function to start Ngrok and connect to MQTT
const startMqttWithNgrok = async () => {
  try {
    const httpUrl= await ngrok.connect(9001)
    console.log(httpUrl)
    // Start Ngrok to expose the local MQTT port (e.g., 1883)
    const url = await ngrok.connect({ proto: 'tcp', addr: 1883 });  // Change port if necessary
    console.log('Ngrok Tunnel URL:', url);

    // Parse the TCP URL from Ngrok's output (convert HTTP to TCP for MQTT)
    const mqttUrl = url.replace('http', 'tcp');

    // MQTT broker connection
    mqttClient = mqtt.connect(mqttUrl);

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
    mqttClient.on('message', async (topic, message) => {
      console.log('Message received:', message);
      try {
        const topicParts = topic.split('/');
        const chatId = topicParts[1]; // Extract chatId from the topic

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
