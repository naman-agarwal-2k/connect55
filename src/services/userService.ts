export class UserService {
  async getUserDetailsByEmail(emailId: string, userRole?: any): Promise<any> {
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
  }
  async getUserDetailsByUserId(userId: any, userRole:any): Promise<any>{

  }
}