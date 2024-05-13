/**
 * Define Global Strings
 */

class StringValues {
  public static EMAIL_REQUIRED: string = "Email is required";
  public static EMAIL_OR_USERNAME_REQUIRED: string =
    "Either email or username is required";
  public static EMAIL_NOT_REGISTERED: string = "Email is not registered";
  public static EMAIL_ALREADY_REGISTERED: string =
    "Email is already registered";
  public static INCORRECT_USERNAME: string = "Username is incorrect";
  public static USERNAME_REQUIRED: string = "Username is required";
  public static USERNAME_ALREADY_REGISTERED: string =
    "Username is already registered";
  public static OTP_SEND_SUCCESS: string = "OTP sent";
  public static INVALID_EMAIL_FORMAT: string = "Email format is invalid";
  public static INTERNAL_SERVER_ERROR: string = "Internal server error";
  public static SOMETHING_WENT_WRONG: string = "Something went wrong";
  public static RESOURCE_NOT_FOUND: string = "Resource not found";
  public static INVALID_TOKEN: string = "Token is invalid";
  public static TOKEN_EXPIRED: string = "Token is expired";
  public static TOKEN_NOT_FOUND: string = "Token not found";
  public static TOKEN_INVALID_EXPIRED: string = "Token is invalid or expired";
  public static UNAUTHORIZED_ACCESS: string = "Unauthorized acess";
  public static USER_NOT_FOUND: string = "User not found";
  public static AUTH_PARAM_REQUIRED: string =
    "Authorization parameter is required";
  public static AUTH_PARAM_HEADER_NOT_FOUND: string =
    "Authorization parameter not found in header";
  public static TOKEN_NOT_FOUND_IN_AUTH_HEADER: string =
    "Token not found in Authorization parameter in header";
  public static AUTH_TOKEN_REQUIRED: string = "Auth token is required";
  public static EMAIL_SEND_SUCCESS: string = "Email sent";
  public static EMAIL_SUBJECT_REQUIRED: string = "Email subject is required";
  public static EMAIL_BODY_REQUIRED: string = "Email body is required";
  public static SENDGRID_API_KEY_NOT_FOUND: string =
    "SendGrid API key not found";
  public static FIRST_NAME_REQUIRED: string = "First name is required";
  public static LAST_NAME_REQUIRED: string = "Last name is required";
  public static FULL_NAME_REQUIRED: string = "Full name is required";
  public static OTP_REQUIRED: string = "OTP is required";
  public static INVALID_OTP: string = "OTP is invalid";
  public static INCORRECT_OTP: string = "OTP is incorrect";
  public static OTP_EXPIRED: string = "OTP is expired";
  public static OTP_ALREADY_USED: string = "OTP is already used";
  public static REGISTER_SUCCESS: string = "User registered";
  public static LOGIN_SUCCESS: string = "User logged in";
  public static INCORRECT_EMAIL_UNAME: string =
    "Email or username is incorrect";
  public static INVALID_USERNAME_FORMAT: string = "Username format is invalid";
  public static PROFILE_DATA_NOT_FOUND: string = "Profile data not found";
  public static JWT_SECRET_NOT_FOUND: string = "JWT secret not found";
  public static JWT_TOKEN_CREATE_ERROR: string =
    "An error occurred while creating token";
  public static SUCCESS: string = "Sucess";
  public static DONE: string = "Done";
  public static FAILURE: string = "Failure";
  public static UNAUTHORIZED: string = "Unauthorized";
  public static TOKEN_NOT_VERIFIED = "Token not verified";
  public static OTP_CREATE_ERROR = "An error occurred while creating an otp";
  public static TEXT_OR_MEDIA_REQUIRED = "Either text or media is required";
  public static MEDIA_FILES_REQUIRED = "Atleast one media file is required";
  public static MEDIA_FILES_MAX_LIMIT = "Maximum 10 media file are allowed";
  public static TEXT_REQUIRED = "Text is required";
  public static POLL_OPTIONS_REQUIRED = "Poll options are required";
  public static POLL_OPTIONS_MIN_REQUIRED =
    "Atleast 2 poll options are required";
  public static POLL_OPTIONS_MAX_LIMIT = "Maximum 4 poll options are allowed";
  public static POLL_END_DURATION_REQUIRED = "Poll end duration is required";
  public static POST_TYPE_REQUIRED = "Post type is required";
  public static INVALID_POST_TYPE = "Post type is invalid";
  public static INVALID_REQUEST_METHOD = "Request method is invalid";
  public static JOB_VACANCIES_LIMIT_EXCEEDED = "Job vacancies limit exceeded";
  public static JOB_DATA_REQUIRED = "Job data are required";
  public static JOB_TITLE_REQUIRED = "Job title is required";
  public static JOB_MANDATORY_SKILLS_REQUIRED = "Mandatory skills are required";
  public static JOB_MANDATORY_SKILLS_MAX_LIMIT_ERROR =
    "Maximum 5 mandatory skills are allowed";
  public static JOB_OPTIONAL_SKILLS_MAX_LIMIT_ERROR =
    "Maximum 10 optional skills are allowed";
  public static JOB_SALARY_RANGE_REQUIRED = "Salary range is required";
  public static JOB_MIN_SALARY_REQUIRED = "Minimum salary is required";
  public static JOB_MAX_SALARY_REQUIRED = "Maximum salary is required";
  public static JOB_PROBATION_DURATION_REQUIRED =
    "Probation duration is required";
  public static JOB_PROBATION_SALARY_RANGE_REQUIRED =
    "Probation salary range is required";
  public static JOB_MIN_PROBATION_SALARY_REQUIRED =
    "Probation minimum salary is required";
  public static JOB_MAX_PROBATION_SALARY_REQUIRED =
    "Probation maximum salary is required";
  public static JOB_OPENINGS_REQUIRED = "Job openings is required";
  public static JOB_TYPE_REQUIRED = "Job type is required";
  public static JOB_LOCATION_REQUIRED = "Job location is required";

  public static CURRENCY_CODE_REQUIRED = "Currency code is required";
  public static CURRENCY_SYMBOL_REQUIRED = "Currency symbol is required";
  public static JOB_DESCRIPTION_REQUIRED = "Job description is required";
  public static MIN_QUALIFICATION_REQUIRED =
    "Minimum qualification is required";
  public static JOB_CATEGORY_REQUIRED = "Job category is required";
  public static JOB_INDUSTRY_REQUIRED = "Job industry is required";
  public static JOB_LOCATION_CITY_REQUIRED = "Job location city is required";
  public static JOB_LOCATION_STATE_REQUIRED = "Job location state is required";
  public static JOB_LOCATION_COUNTRY_REQUIRED =
    "Job location country is required";
  public static JOB_PREFERRED_JOINING_DATE_REQUIRED =
    "Job preferred joining date is required";
  public static JOB_WORK_EXPERIENCE_REQUIRED = "Work experience is required";
  public static JOB_MIN_WORK_EXPERIENCE_REQUIRED =
    "Minimum work experience is required";
  public static JOB_MAX_WORK_EXPERIENCE_REQUIRED =
    "Maximum work experience is required";
  public static ACTION_NOT_PERMITTED =
    "This account is not permitted to perform this action";
  public static PROFILE_NOT_FOUND = "Profile not found";
  public static USER_TYPE_REQUIRED = "User type is required";
  public static PHONE_REQUIRED = "Phone number is required";
  public static INVALID_PHONE_FORMAT = "Phone number format is invalid";
  public static COMPANY_NAME_REQUIRED = "Company name is required";
  public static DESIGNATION_REQUIRED = "Designation is required";
  public static OLD_PASSWORD_REQUIRED = "Old password is required";
  public static PASSWORD_REQUIRED = "Password is required";
  public static CONFIRM_PASSWORD_REQUIRED = "Confirm password is required";
  public static PASSWORDS_DO_NOT_MATCH = "Passwords do not match";
  public static PHONE_ALREADY_USED = "Phone number is already used";
  public static OLD_PASSWORD_MIN_LENGTH_ERROR =
    "Old password length should be greater than or equal to 8 characters";
  public static OLD_PASSWORD_MAX_LENGTH_ERROR =
    "Old password length should not be greater than 32 characters";
  public static PASSWORD_MIN_LENGTH_ERROR =
    "Password length should be greater than or equal to 8 characters";
  public static PASSWORD_MAX_LENGTH_ERROR =
    "Password length should not be greater than 32 characters";
  public static CONFIRM_PASSWORD_MIN_LENGTH_ERROR =
    "Confirm password length should be greater than or equal to 8 characters";
  public static CONFIRM_PASSWORD_MAX_LENGTH_ERROR =
    "Confirm password length should not be greater than 32 characters";
  public static PHONE_LENGTH_ERROR =
    "Phone number length should be equal to 10 characters";
  public static INCORRECT_PASSWORD = "Password is incorrect";
  public static INCORRECT_OLD_PASSWORD = "Old password is incorrect";
  public static POST_NOT_FOUND = "Post not found";
}

export default StringValues;
