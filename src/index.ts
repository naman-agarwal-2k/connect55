import express  from 'express';
import { config } from "./config/index";
import { registerRoutes } from "./routes/router";
import http from "http";
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import { startMqttWithNgrok } from './mqttService/mqttClient';
//import './mqttService/mqttClient';
import "./firebase/firebase";

const app = express();
app.set("port",config.port); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
startMqttWithNgrok();
// app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Consider restricting this in production
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
  })
);

// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Server UP" });
  }); 

  mongoose
.connect("mongodb+srv://naman2:namanagarwal@connect55.iuhn8.mongodb.net/?retryWrites=true&w=majority&appName=connect55")
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('MongoDB connection error:', error));

registerRoutes(app);



//Uncaught Exception Handling
process.on("uncaughtException",(err)=>{
    console.error("Uncaught Exception:",err.stack);
})

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
  });
  
  // Default Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  //Create and start HTTP Server
    const httpsServer= http.createServer(app);
  httpsServer.listen(app.get("port"),()=>{
    console.log("Express server listening on port" + app.get("port"));
  });
  export default app;