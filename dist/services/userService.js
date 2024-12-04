"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    getUserDetailsByEmail(emailId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //   let query = `SELECT id AS user_id, user_role_id, email_id, password, first_name, last_name, 
            //   is_password_updated, is_active, is_email_verified, is_name_completed, is_dob_completed,
            //   is_nationality_completed,is_notification_completed, is_deleted, country
            //   FROM users
            //   WHERE email_id = ? AND user_role_id = ?`;
            //   let queryObj = {
            //     query: query,
            //     args: [emailId, userRole],
            //     event: "getUserDetialsByEmail",
            //   };
            //   let result: any = await dbHandler.dbHandler.executeQuery(queryObj);
            //   return result[0];
            // } catch (error) {
            //   logDatabaseQueryError("Error in getUserDetialsByEmail", error, {});
            //   throw new Error(
            //     responseMessages.ERROR.DB_ERROR.customMessage.replace(
            //       "{QUERY_EVENT_NAME}",
            //       "getUserDetialsByEmail"
            //     )
            //   );
            // }
        });
    }
    getUserDetailsByUserId(userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.UserService = UserService;
