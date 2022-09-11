const ResponseMessages = {};

/// Required Field Response Messages
ResponseMessages.FIELD_REQUIRED = 'This field is required';
ResponseMessages.EMAIL_REQUIRED = 'Email is required';
ResponseMessages.EMAIL_USERNAME_REQUIRED = 'Email or username is required';
ResponseMessages.PASSWORD_REQUIRED = 'Password is required';
ResponseMessages.FIRST_NAME_REQUIRED = 'First name is required';
ResponseMessages.LAST_NAME_REQUIRED = 'Last name is required';
ResponseMessages.USERAME_REQUIRED = 'Username is required';
ResponseMessages.CONFIRM_PASSWORD_REQUIRED = 'Confirm password is required';
ResponseMessages.OLD_PASSWORD_REQUIRED = 'Old password is required';
ResponseMessages.NEW_PASSWORD_REQUIRED = 'New password is required';
ResponseMessages.PHONE_REQUIRED = 'Phone is required';
ResponseMessages.COUNTRY_CODE_REQUIRED = 'Country code is required';
ResponseMessages.OTP_REQUIRED = 'OTP is required';
ResponseMessages.ROLE_REQUIRED = 'Role is required';
ResponseMessages.MESSAGE_REQUIRED = 'Message is required';
ResponseMessages.PUBLIC_ID_REQUIRED = 'Public id is required';
ResponseMessages.URL_REQUIRED = 'URL is required';
ResponseMessages.MEDIA_TYPE_REQUIRED = 'Media type is required';
ResponseMessages.THUMBNAIL_REQUIRED = 'Thumbnail is required';
ResponseMessages.VIDEO_THUMBNAIL_REQUIRED = 'Video thumbnail is required';
ResponseMessages.CAPTION_REQUIRED = 'Caption is required';
ResponseMessages.MEDIA_FILES_REQUIRED = 'Media files is required';
ResponseMessages.POST_ID_REQUIRED = 'Post id is required';
ResponseMessages.VIDEO_THUMBNAIL_PUBLIC_ID_REQUIRED = 'Video thumbnail public id is required';
ResponseMessages.VIDEO_THUMBNAIL_URL_REQUIRED = 'Video thumbnail url is required';


/// Incorrect Response Messages
ResponseMessages.INCORRECT_EMAIL = 'Incorrect email';
ResponseMessages.INCORRECT_USERNAME = 'Incorrect username';
ResponseMessages.INCORRECT_PASSWORD = 'Incorrect password';
ResponseMessages.INCORRECT_OTP = 'Incorrect OTP';
ResponseMessages.INCORRECT_PHONE = 'Incorrect phone';
ResponseMessages.INCORRECT_CURRENT_PASSWORD = 'Incorrect current password';
ResponseMessages.INCORRECT_OLD_PASSWORD = 'Incorrect old password';

/// Success Response Messages
ResponseMessages.SUCCESS = 'Success';
ResponseMessages.LOGIN_SUCCESS = 'Login success';
ResponseMessages.SIGNUP_SUCCESS = 'Signup success';
ResponseMessages.LOGOUT_SUCCESS = 'Logout success';
ResponseMessages.OTP_SEND_SUCCESS = 'OTP sent successfully';
ResponseMessages.EMAIL_SEND_SUCCESS = 'Email sent successfully';
ResponseMessages.EMAIL_CHANGE_SUCCESS = 'Email changed successfully';
ResponseMessages.PASSWORD_CHANGE_SUCCESS = 'Password changed successfully';
ResponseMessages.PASSWORD_RESET_SUCCESS = 'Password reset successfully';
ResponseMessages.PHONE_CHANGE_SUCCESS = 'Phone changed successfully';
ResponseMessages.ACCOUNT_VERIFY_SUCCESS = 'Account verified successfully';
ResponseMessages.ACCOUNT_REACTIVATE_SUCCESS = 'Account reactivated successfully';
ResponseMessages.ACCOUNT_DEACTIVATE_SUCCESS = 'Account deactivated successfully';
ResponseMessages.PROFILE_PICTURE_UPLOAD_SUCCESS = 'Profile picture uploaded successfully';
ResponseMessages.PROFILE_PICTURE_REMOVE_SUCCESS = 'Profile picture removed successfully';
ResponseMessages.PROFILE_UPDATE_SUCCESS = 'Profile updated successfully';
ResponseMessages.POST_CREATE_SUCCESS = 'Post created successfully';

/// Failure Response Messages
ResponseMessages.FAILURE = 'Failure';
ResponseMessages.LOGIN_FAILURE = 'Login failure';
ResponseMessages.SIGNUP_FAILURE = 'Signup failure';
ResponseMessages.LOGOUT_FAILURE = 'Logout failure';

ResponseMessages.EMAIL_NOT_SENT = 'Email not sent';

/// Delete Response Messages
ResponseMessages.ACCOUNT_DELETED = 'Account deleted';

/// Other Response Messages
ResponseMessages.AUTH_TOKEN_REQUIRED = 'Auth token is required';
ResponseMessages.AUTH_PARAM_REQUIRED = 'Auth param is required';
ResponseMessages.ACCOUNT_ALREADY_DEACTIVATED = 'Account already deactivated';
ResponseMessages.ACCOUNT_ALREADY_ACTIVE = 'Account already active';
ResponseMessages.ACCOUNT_SUSPENDED = 'Account suspended';
ResponseMessages.ACCOUNT_DEACTIVATED = 'Account deactivated';
ResponseMessages.USERAME_NOT_AVAILABLE = 'Username not available';
ResponseMessages.PASSWORDS_DO_NOT_MATCH = 'Passwords do not match';
ResponseMessages.EMAIL_ALREADY_USED = 'Email already used';
ResponseMessages.USERNAME_ALREADY_USED = 'Username already used';
ResponseMessages.ACCOUNT_ALREADY_EXISTS = 'Account already exists with this email';
ResponseMessages.ACCOUNT_NOT_FOUND = 'Account not found';
ResponseMessages.ACCOUNT_NOT_VERIFIED = 'Account not verified';
ResponseMessages.ACCOUNT_ALREADY_VERIFIED = 'Account already verified';
ResponseMessages.CANNOT_FOLLOW_YOURSELF = 'You cannot follow yourself';

ResponseMessages.ACCOUNT_SUPERADMIN = 'Superadmin account';
ResponseMessages.ACCOUNT_ADMIN = 'Admin account';
ResponseMessages.ACCOUNT_USER = 'User account';
ResponseMessages.ACCOUNT_MODERATOR = 'Moderator account';

ResponseMessages.OTP_ALREADY_SENT = 'OTP already sent';
ResponseMessages.OTP_EXPIRED = 'OTP expired';
ResponseMessages.OTP_NOT_SENT = 'OTP not sent';
ResponseMessages.OTP_ALREADY_USED = 'OTP already used';

ResponseMessages.EMAIL_ALREADY_EXISTS = 'Email already exists';
ResponseMessages.EMAIL_ALREADY_ASSOSIATED = 'Email already associated with another account';
ResponseMessages.PHONE_ALREADY_EXISTS = 'Phone already exists';
ResponseMessages.PHONE_ALREADY_USED = 'This phone number is already used';

ResponseMessages.VALID_TOKEN = 'Valid token';
ResponseMessages.CORRECT_PASSWORD = 'Correct password';

/// Invalid Response Messages
ResponseMessages.ACCOUNT_NOT_ACTIVE = 'Account not active';
ResponseMessages.INVALID_EXPIRED_TOKEN = 'Invalid or expired token';
ResponseMessages.INVALID_PHONE = 'Invalid phone';
ResponseMessages.INVALID_EMAIL = 'Invalid email';
ResponseMessages.INVALID_USERNAME = 'Invalid username';
ResponseMessages.INVALID_PASSWORD = 'Invalid password';
ResponseMessages.INVALID_OTP = 'Invalid OTP';
ResponseMessages.INVALID_FIRST_NAME_LENGTH = 'First name must be at least 3 characters';
ResponseMessages.INVALID_USERNAME_LENGTH = 'Username must be between 3-15 characters';
ResponseMessages.INVALID_CREDENTIALS = 'Invalid credentials';
ResponseMessages.INVALID_TOKEN = 'Invalid token';
ResponseMessages.EXPIRED_TOKEN = 'Expired token';
ResponseMessages.INVALID_REQUEST = 'Invalid request';
ResponseMessages.INVALID_PARAMETERS = 'Invalid parameters';
ResponseMessages.INVALID_EMAIL = 'Invalid email';
ResponseMessages.INVALID_PASSWORD = 'Invalid password';
ResponseMessages.INVALID_USERNAME = 'Invalid username';
ResponseMessages.INVALID_USER = 'Invalid user';
ResponseMessages.INVALID_USER_ID = 'Invalid user id';
ResponseMessages.INVALID_USER_TYPE = 'Invalid user type';
ResponseMessages.INVALID_USER_STATUS = 'Invalid user status';
ResponseMessages.INVALID_USER_ACCOUNT_STATUS = 'Invalid user account status';
ResponseMessages.INVALID_ACCOUNT_VALIDATION = 'Your account is not verified, please verify your account';
ResponseMessages.UNAUTHORIZED = 'You are not authorized to perform this operation';
ResponseMessages.NOT_FOUND = 'Not found';
ResponseMessages.INVALID_REQUEST = 'Invalid request';
ResponseMessages.INVALID_PARAMETERS = 'Invalid parameters';
ResponseMessages.INVALID_QUERY_PARAMETERS = 'Invalid query parameters';
ResponseMessages.INVALID_REQUEST_BODY = 'Invalid request body';
ResponseMessages.INVALID_REQUEST_PARAMETERS = 'Invalid request parameters';
ResponseMessages.SIGNUP_EMAIL_VERIFICATION_SUCCESS = 'Signup email verification success';
ResponseMessages.SIGNUP_EMAIL_VERIFICATION_FAILURE = 'Signup email verification failure';
ResponseMessages.SIGNUP_EMAIL_VERIFICATION_FAILURE_ALREADY_VERIFIED = 'Signup email verification failure - already verified';
ResponseMessages.SIGNUP_EMAIL_VERIFICATION_FAILURE_EXPIRED = 'Signup email verification failure - expired';
ResponseMessages.SIGNUP_EMAIL_VERIFICATION_FAILURE_INVALID = 'Signup email verification failure - invalid';
ResponseMessages.SIGNUP_EMAIL_VERIFICATION_FAILURE_NOT_FOUND = 'Signup email verification failure - not found';
ResponseMessages.USER_NOT_FOUND = 'User not found';
ResponseMessages.USER_CREATION_FAILURE = 'User creation failure';
ResponseMessages.POST_NOT_FOUND = 'Post not found';
ResponseMessages.NOTIFICATION_NOT_FOUND = 'Notification not found';
ResponseMessages.NOTIFICATION_MARKED_READ = 'Notification marked read';

export default ResponseMessages;