"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const userController_1 = require("../controllers/userController");
const userService_1 = require("../services/userService");
const express_1 = __importDefault(require("express"));
const validator_1 = __importDefault(require("./validator"));
const upload_1 = __importDefault(require("../middlewares/upload"));
const orgDataController_1 = require("../controllers/orgDataController");
const userService = new userService_1.UserService();
const userController = new userController_1.UserController(userService);
const orgDataController = new orgDataController_1.OrgDataController();
function registerRoutes(app) {
    const router = express_1.default.Router();
    app.use(express_1.default.json({ limit: "50mb" }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
    app.get('/', (req, res) => {
        res.send('Hello, TypeScriptss Express!');
    });
    router.get("/header-titles", userController.getHeaderTitles.bind(userController));
    //The bind method creates a new function with the this context explicitly set to the userController object.
    // This ensures that inside the getHeaderTitles method, the this keyword correctly refers
    //  to the userController object, not the router or other calling context.
    router.post("/users/register", validator_1.default.userRegistration, userController.userRegistration.bind(userController));
    router.post("/users/login", validator_1.default.userLogin, userController.userLogin.bind(userController));
    router.patch("/users/update/:id", upload_1.default.single("profilePicture"), validator_1.default.userUpdate, userController.updateUser.bind(userController));
    router.get("/users/user-data/:id", userController.getUserData.bind(userController));
    router.get("/organisation-data", orgDataController.getOrganisationData.bind(orgDataController));
    app.use("/api/v1", router);
}
