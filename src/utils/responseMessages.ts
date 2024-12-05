export const ERROR = {
  DEFAULT: {
    statusCode: 500,
    customMessage: "Something went wrong.",
    type: "DEFAULT",
  },
  INVALID_EMAIL: {
    statusCode: 400,
    customMessage: "Email not found.",
    type: "INVALID_EMAIL",
  },
  INVALID_PASSWORD: {
    statusCode: 400,
    customMessage: "Invalid password.",
    type: "INVALID_PASSWORD",
  },
  VALIDATE_PASSWORD: {
    statusCode: 400,
    customMessage: "Password & confirm password should be same.",
    type: "VALIDATE_PASSWORD",
  },
  EMPTY_EMAIL_PASSWORD: {
    statusCode: 400,
    customMessage: "Email or password cannot be empty.",
    type: "EMPTY_EMAIL_PASSWORD",
  },
  INVALID_USER_ROLE: {
    statusCode: 400,
    customMessage: "Invalid user role.",
    type: "INVALID_USER_ROLE",
  },
  INVALID_ONBOARDING_PROCESS: {
    statusCode: 400,
    customMessage: "Invalid onboarding process.",
    type: "INVALID_ONBOARDING_PROCESS",
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: 400,
    customMessage: "You have already registered with this email.",
    type: "EMAIL_ALREADY_EXISTS",
  },
  ACCOUNT_DEACTIVATED: {
    statusCode: 403,
    customMessage:
      "Your account has been deactivated, Please coordinate with admin.",
    type: "ACCOUNT_DEACTIVATED",
  },
  JWT_TOKEN_EXPIRED: {
    statusCode: 400,
    customMessage: "Invalid or expired token.",
    type: "JWT_TOKEN_EXPIRED",
  },
  ACCOUNT_DELETED: {
    statusCode: 410,
    customMessage:
      "Your account has been deleted, Please coordinate with admin.",
    type: "ACCOUNT_DELETED",
  },
  DATA_NOT_FOUND: {
    statusCode: 404,
    customMessage: "Data not found.",
    type: "DATA_NOT_FOUND",
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    customMessage: "User not found.",
    type: "USER_NOT_FOUND",
  },
  ID_NOT_FOUND: {
    statusCode: 404,
    customMessage: "Id not found.",
    type: "ID_NOT_FOUND",
  },
  INVALID_ACCESS_TOKEN: {
    statusCode: 401,
    customMessage: "Invalid access token.",
    type: "INVALID_ACCESS_TOKEN",
  },
  INVALID_X_API_KEY: {
    statusCode: 403,
    customMessage: "Invalid x-api-key.",
    type: "INVALID_X_API_KEY",
  },
  DB_ERROR: {
    statusCode: 500,
    customMessage: "Error in {QUERY_EVENT_NAME} query.",
    type: "DB_ERROR",
  },
  EMAIL_NOT_VERIFIED: {
    statusCode: 400,
    customMessage: "Email not verified yet.",
    type: "EMAIL_NOT_VERIFIED",
  },
  INVALID_VERIFICATION_OTP: {
    statusCode: 400,
    customMessage: "Invalid verification OTP.",
    type: "INVALID_VERIFICATION_OTP",
  },
  PROFILE_INCOMPLETE: {
    statusCode: 404,
    customMessage:
      "To proceed with generating your personalized QR code, we kindly request that you complete your profile information.",
    type: "PROFILE_INCOMPLETE",
  },
};

export const SUCCESS = {
  DEFAULT: {
    statusCode: 200,
    customMessage: "Success",
    type: "DEFAULT",
  },
  REGISTER: {
    statusCode: 200,
    customMessage: "Registered successfully.",
    type: "REGISTER",
  },
  SEND_VERIFIATION_OTP: {
    statusCode: 200,
    customMessage:
      "We have successfully send a verification OTP on your email.",
    type: "SEND_VERIFIATION_OTP",
  },
  OTP_VERIFIED: {
    statusCode: 200,
    customMessage: "We have successfully verified OTP.",
    type: "OTP_VERIFIED",
  },
  LOGIN: {
    statusCode: 200,
    customMessage: "Logged in successfully.",
    type: "LOGIN",
  },
  PROFILE_LIST: {
    statusCode: 200,
    customMessage: "Profile has been fetched successfully.",
    type: "PROFILE_LIST",
  },
  PROFILE_UPDATE: {
    statusCode: 200,
    customMessage: "Profile has been successfully updated.",
    type: "PROFILE_UPDATE",
  },
  PASSWORD_UPDATED: {
    statusCode: 200,
    customMessage: "We have successfully updated your password.",
    type: "PASSWORD_UPDATED",
  },
  ORG_DATA_LIST: {
    statusCode: 200,
    customMessage: "Organisation data has been fetched successfully.",
    type: "ORG_DATA_LIST",
  },
};

export default {
  ERROR,
  SUCCESS,
};
