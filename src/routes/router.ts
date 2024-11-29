import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import express, { Request, Response } from 'express';
import Validator from "./validator";
import upload from "../middlewares/upload";
import { OrgDataController } from "../controllers/orgDataController";

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
  router.patch("/users/update/:id",upload.single("profilePicture"),Validator.userUpdate,userController.updateUser.bind(userController));
  router.get("users/:id",userController.getUserData.bind(userController));

  router.get("/organisation-data", orgDataController.getOrganisationData.bind(orgDataController));

  
  app.use("/api/v1", router);

}