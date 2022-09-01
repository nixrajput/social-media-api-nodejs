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

/// Incorrect Response Messages
ResponseMessages.INCORRECT_EMAIL = 'Incorrect email';
ResponseMessages.INCORRECT_USERNAME = 'Incorrect username';
ResponseMessages.INCORRECT_PASSWORD = 'Incorrect password';

/// Success Response Messages
ResponseMessages.SUCCESS = 'Success';
ResponseMessages.LOGIN_SUCCESS = 'Login success';
ResponseMessages.SIGNUP_SUCCESS = 'Signup success';
ResponseMessages.LOGOUT_SUCCESS = 'Logout success';

/// Failure Response Messages
ResponseMessages.FAILURE = 'Failure';
ResponseMessages.LOGIN_FAILURE = 'Login failure';
ResponseMessages.SIGNUP_FAILURE = 'Signup failure';
ResponseMessages.LOGOUT_FAILURE = 'Logout failure';

/// Delete Response Messages
ResponseMessages.ACCOUNT_DELETED = 'Account deleted';

/// Other Response Messages
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

/// Invalid Response Messages
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
ResponseMessages.INVALID_ACCOUNT_VALIDATION = 'Your account is not verified, please update your app and verify your account to proceed';
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