import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import express, { Request, Response } from 'express';
import Validator from "./validator";
import upload from "../middlewares/upload";
import { OrgDataController } from "../controllers/orgDataController";
import { createChat, getChatByChatId, getChatByUserId, markChatPinned, sendMessage, updateGroupChat } from "../controllers/mqttChatController";

const userService = new UserService();
const userController =  new UserController(userService);
const orgDataController = new OrgDataController();

export function registerRoutes(app: express.Application){
const router = express.Router();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScriptss Express!');
  });
  
router.get(
    "/header-titles",
    userController.getHeaderTitles.bind(userController)
  );

//The bind method creates a new function with the this context explicitly set to the userController object.
// This ensures that inside the getHeaderTitles method, the this keyword correctly refers
//  to the userController object, not the router or other calling context.

  router.post(
    "/users/register",
    Validator.userRegistration,
    userController.userRegistration.bind(userController)
  );
  router.post(
    "/users/login",
    Validator.userLogin,
    userController.userLogin.bind(userController)
  );
  //this upload.single and in chat upload media are same thing
  router.patch("/users/update/:id",upload.single("profilePicture"),Validator.userUpdate,userController.updateUser.bind(userController));

  router.get("/users/user-data/:id",userController.getUserData.bind(userController));

  router.post("/users/logout",userController.logout.bind(userController));

  router.get("/users/search-users",userController.searchUsers.bind(userController));//users/search?query=na&role=admin

  router.get("/organisation-data", orgDataController.getOrganisationData.bind(orgDataController));
  

  // router.post("/chat/upload",upload.single("media"),(req:any, res:any) => {
  //   const fileUrl = `/uploads/chats/${req.file.filename}`;
  //   res.status(200).json({ success: true, url: fileUrl });
  // });

  router.post("/chat/create-chat",upload.single("groupIcon"), createChat);

  // Route to get all chats for a user
  router.get("/chat/:userId", getChatByUserId);

  // Route to get chat details by chat ID
  router.get("/chat-data/:chatId", getChatByChatId );

// Route to send a message to a chat
 router.post("/chat/send-message", sendMessage);

 router.post("/chat/mark-chat-pin",markChatPinned);

 router.patch("/chat/group/update",upload.single("groupIcon"),updateGroupChat);


  app.use("/api/v1", router);

}