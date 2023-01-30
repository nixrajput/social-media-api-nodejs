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
ResponseMessages.COMMENT_REQUIRED = 'Comment is required';
ResponseMessages.COMMENT_ID_REQUIRED = 'Comment id is required';
ResponseMessages.DEVICE_ID_REQUIRED = 'Device id is required';
ResponseMessages.IP_REQUIRED = 'IP is required';
ResponseMessages.DEVICE_INFO_REQUIRED = 'Device info is required';
ResponseMessages.DEVICE_NAME_REQUIRED = 'Device name is required';
ResponseMessages.DEVICE_MODEL_REQUIRED = 'Device model is required';
ResponseMessages.DEVICE_BRAND_REQUIRED = 'Device brand is required';
ResponseMessages.DEVICE_OS_REQUIRED = 'Device OS is required';
ResponseMessages.DEVICE_OS_VERSION_REQUIRED = 'Device OS version is required';
ResponseMessages.DEVICE_TYPE_REQUIRED = 'Device type is required';
ResponseMessages.DEVICE_MANUFACTURER_REQUIRED = 'Device manufacturer is required';
ResponseMessages.USER_ID_REQUIRED = 'User id is required';
ResponseMessages.REPORT_TYPE_REQUIRED = 'Report type is required';
ResponseMessages.REPORT_REASON_REQUIRED = 'Report reason is required';
ResponseMessages.REPORT_ID_REQUIRED = 'Report id is required';
ResponseMessages.LEGAL_NAME_REQUIRED = 'Legal name is required';
ResponseMessages.BUSINESS_NAME_REQUIRED = 'Business name is required';
ResponseMessages.BUSINESS_TYPE_REQUIRED = 'Business type is required';
ResponseMessages.BUSINESS_EMAIL_REQUIRED = 'Business email is required';
ResponseMessages.BUSINESS_PHONE_REQUIRED = 'Business phone is required';
ResponseMessages.BUSINESS_ADDRESS_REQUIRED = 'Business address is required';
ResponseMessages.BUSINESS_DOCUMENT_REQUIRED = 'Business document is required';
ResponseMessages.DOCUMENT_REQUIRED = 'Document is required';
ResponseMessages.PROFESSION_REQUIRED = 'Profession is required';
ResponseMessages.CATEGORY_REQUIRED = 'Category is required';
ResponseMessages.BIO_REQUIRED = 'Bio is required';
ResponseMessages.IS_VERIFIED_ON_OTHER_PLATFORM_REQUIRED = 'Is verified on other platform is required';
ResponseMessages.OTHER_PLATFORM_PROFILE_LINKS_REQUIRED = 'Other platform profile links is required';
ResponseMessages.HAS_WIKIPEDIA_PAGE_REQUIRED = 'Has wikipedia page is required';
ResponseMessages.WIKIPEDIA_PAGE_LINK_REQUIRED = 'Wikipedia page link is required';
ResponseMessages.FEATURED_IN_ARTICLES_REQUIRED = 'Featured in articles is required';
ResponseMessages.ARTICLE_LINKS_REQUIRED = 'Article links is required';
ResponseMessages.REPO_NAME_REQUIRED = 'Repo name is required';
ResponseMessages.CURRENT_VERSION_REQUIRED = 'Current version is required';
ResponseMessages.POLL_QUESTION_REQUIRED = 'Poll question is required';
ResponseMessages.POLL_OPTIONS_REQUIRED = 'Poll options is required';
ResponseMessages.POLL_OPTION_REQUIRED = 'Poll option is required';
ResponseMessages.POLL_LENGTH_REQUIRED = 'Poll length is required';
ResponseMessages.POLL_OPTIONS_MIN = 'Poll options must be at least 2';
ResponseMessages.POLL_OPTIONS_MAX = 'Poll options must be at most 4';
ResponseMessages.POLL_ID_REQUIRED = 'Poll id is required';
ResponseMessages.POLL_OPTION_ID_REQUIRED = 'Poll option id is required';
ResponseMessages.POLL_OPTION_VOTE_ID_REQUIRED = 'Poll option vote id is required';
ResponseMessages.EMAIL_OR_PHONE_REQUIRED = 'Email or phone is required';
ResponseMessages.ICON_REQUIRED = 'Icon is required';
ResponseMessages.TITLE_REQUIRED = 'Title is required';
ResponseMessages.DESCRIPTION_REQUIRED = 'Description is required';
ResponseMessages.FEATURES_REQUIRED = 'Features is required';
ResponseMessages.SCREENSHOTS_REQUIRED = 'Screenshots is required';
ResponseMessages.SEARCH_QUERY_REQUIRED = 'Search query is required';
ResponseMessages.SEARCH_TYPE_REQUIRED = 'Search type is required';
ResponseMessages.TOKEN_REQUIRED = 'Token is required';

/// Incorrect Response Messages
ResponseMessages.INCORRECT_EMAIL = 'Incorrect email';
ResponseMessages.INCORRECT_USERNAME = 'Incorrect username';
ResponseMessages.INCORRECT_PASSWORD = 'Incorrect password';
ResponseMessages.INCORRECT_OTP = 'Incorrect OTP';
ResponseMessages.INCORRECT_PHONE = 'Incorrect phone';
ResponseMessages.INCORRECT_CURRENT_PASSWORD = 'Incorrect current password';
ResponseMessages.INCORRECT_OLD_PASSWORD = 'Incorrect old password';
ResponseMessages.INCORRECT_EMAIL_OR_USERNAME = 'Incorrect email or username';
ResponseMessages.INCORRECT_EMAIL_OR_PHONE = 'Incorrect email or phone';
ResponseMessages.INCORRECT_EMAIL_OR_USERNAME_OR_PHONE = 'Incorrect email or username or phone';

/// Success Response Messages
ResponseMessages.SUCCESS = 'Success';
ResponseMessages.LOGIN_SUCCESS = 'Login success';
ResponseMessages.SIGNUP_SUCCESS = 'Signup success';
ResponseMessages.LOGOUT_SUCCESS = 'Logout success';
ResponseMessages.OTP_SEND_SUCCESS = 'OTP sent successfully';
ResponseMessages.OTP_VERIFY_SUCCESS = 'OTP verified successfully';
ResponseMessages.EMAIL_SEND_SUCCESS = 'Email sent successfully';
ResponseMessages.EMAIL_CHANGE_SUCCESS = 'Email changed successfully';
ResponseMessages.USERNAME_CHANGE_SUCCESS = 'Username changed successfully';
ResponseMessages.PASSWORD_CHANGE_SUCCESS = 'Password changed successfully';
ResponseMessages.PASSWORD_RESET_SUCCESS = 'Password reset successfully';
ResponseMessages.PHONE_CHANGE_SUCCESS = 'Phone changed successfully';
ResponseMessages.ACCOUNT_VERIFY_SUCCESS = 'Account verified successfully';
ResponseMessages.ACCOUNT_REACTIVATE_SUCCESS = 'Account reactivated successfully';
ResponseMessages.ACCOUNT_DEACTIVATE_SUCCESS = 'Account deactivated successfully';
ResponseMessages.PROFILE_PICTURE_UPLOAD_SUCCESS = 'Profile picture uploaded successfully';
ResponseMessages.PROFILE_PICTURE_REMOVE_SUCCESS = 'Profile picture removed successfully';
ResponseMessages.PROFILE_UPDATE_SUCCESS = 'Profile updated successfully';
ResponseMessages.POST_CREATE_SUCCESS = 'Post created successfully'
ResponseMessages.POST_UPDATE_SUCCESS = 'Post updated successfully';
ResponseMessages.POST_DELETE_SUCCESS = 'Post deleted successfully';
ResponseMessages.POLL_CREATE_SUCCESS = 'Poll created successfully';
ResponseMessages.POLL_DELETE_SUCCESS = 'Poll deleted successfully';
ResponseMessages.COMMENT_ADD_SUCCESS = 'Comment added successfully';
ResponseMessages.COMMENT_UPDATE_SUCCESS = 'Comment updated successfully';
ResponseMessages.COMMENT_DELETE_SUCCESS = 'Comment deleted successfully';
ResponseMessages.CHAT_MESSAGE_SENT_SUCCESS = 'Chat message sent successfully';
ResponseMessages.CHAT_MESSAGE_READ_SUCCESS = 'Chat message read successfully';
ResponseMessages.CHAT_MESSAGE_DELETE_SUCCESS = 'Chat message deleted successfully';
ResponseMessages.REPORT_USER_SUCCESS = 'User reported successfully';
ResponseMessages.REPORT_POST_SUCCESS = 'Post reported successfully';
ResponseMessages.REPORT_COMMENT_SUCCESS = 'Comment reported successfully';
ResponseMessages.REPORT_CHAT_MESSAGE_SUCCESS = 'Chat message reported successfully';
ResponseMessages.LOGOUT_OTHER_DEVICES_SUCCESS = 'Other devices logged out successfully';


/// Failure Response Messages
ResponseMessages.FAILURE = 'Failure';
ResponseMessages.LOGIN_FAILURE = 'Login failure';
ResponseMessages.SIGNUP_FAILURE = 'Signup failure';
ResponseMessages.LOGOUT_FAILURE = 'Logout failure';
ResponseMessages.OTP_SEND_FAILURE = 'OTP send failure';
ResponseMessages.EMAIL_SEND_FAILURE = 'Email send failure';
ResponseMessages.CHAT_MESSAGE_READ_FAILURE = 'Chat message read failure';
ResponseMessages.CHAT_MESSAGE_DELETE_FAILURE = 'Chat message delete failure';
ResponseMessages.CHAT_MESSAGE_TYPING_FAILURE = 'Chat message typing failure';
ResponseMessages.ONLINE_USERS_FAILURE = 'Online users failure';
ResponseMessages.REPORT_USER_FAILURE = 'User report failure';
ResponseMessages.REPORT_POST_FAILURE = 'Post report failure';
ResponseMessages.REPORT_COMMENT_FAILURE = 'Comment report failure';


ResponseMessages.EMAIL_NOT_SENT = 'Email not sent';

/// Delete Response Messages
ResponseMessages.ACCOUNT_DELETED = 'Account deleted';

/// Other Response Messages
ResponseMessages.PUBLIC_KEY_SAVED = 'Public key saved';
ResponseMessages.PUBLIC_KEY_NOT_SAVED = 'Public key not saved';
ResponseMessages.CHAT_MESSAGES_RECEIVED = 'Chat messages received';
ResponseMessages.CHAT_MESSAGES_NOT_RECEIVED = 'Chat messages not received';
ResponseMessages.CLIENT_NOT_CONNECTED = 'Client not connected';
ResponseMessages.CHAT_MESSAGE_RECEIVED = 'Chat message received';
ResponseMessages.CHAT_MESSAGE_ALREADY_READ = 'Chat message already read';
ResponseMessages.CHAT_MESSAGE_NOT_SENT = 'Chat message not sent';
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
ResponseMessages.CANNOT_UNFOLLOW_YOURSELF = 'You cannot unfollow yourself';
ResponseMessages.CANNOT_BLOCK_YOURSELF = 'You cannot block yourself';
ResponseMessages.CANNOT_UNBLOCK_YOURSELF = 'You cannot unblock yourself';
ResponseMessages.USER_ALREADY_BLOCKED = 'User already blocked';
ResponseMessages.BLOCKED = 'Blocked';
ResponseMessages.USER_NOT_BLOCKED = 'User not blocked';
ResponseMessages.UNBLOCKED = 'Unblocked';

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

ResponseMessages.PROFILE_PICTURE_NOT_FOUND = 'Profile picture not found';

ResponseMessages.POST_NOT_FOUND = 'Post not found';
ResponseMessages.POST_LIKED = 'Post liked';
ResponseMessages.POST_UNLIKED = 'Post unliked';
ResponseMessages.POST_DELETED = 'Post deleted';
ResponseMessages.POST_ALREADY_DELETED = 'Post already deleted';

ResponseMessages.POLL_NOT_FOUND = 'Poll not found';
ResponseMessages.POLL_EXPIRED = 'Poll expired';
ResponseMessages.POLL_ALREADY_VOTED = 'You have already voted';
ResponseMessages.POLL_VOTED = 'Poll voted';
ResponseMessages.POLL_NOT_VOTED = 'Poll not voted';
ResponseMessages.POLL_OPTION_NOT_FOUND = 'Poll option not found';

ResponseMessages.COMMENT_NOT_FOUND = 'Comment not found';
ResponseMessages.COMMENT_LIKED = 'Comment liked';
ResponseMessages.COMMENT_UNLIKED = 'Comment unliked';

ResponseMessages.FOLLOWING = 'Following';
ResponseMessages.UNFOLLOWING = 'Unfollowing';
ResponseMessages.ALREADY_FOLLOWING = 'Already following';
ResponseMessages.ALREADY_UNFOLLOWING = 'Already unfollowing';
ResponseMessages.UNFOLLOWED_USER = 'Unfollowed user';
ResponseMessages.FOLLOWED_USER = 'Followed user';
ResponseMessages.FOLLOW_REQUEST_ALREADY_SENT = 'Follow request already sent';
ResponseMessages.FOLLOW_REQUEST_SENT = 'Follow request sent';
ResponseMessages.FOLLOW_REQUEST_ACCEPTED = 'Follow request accepted';
ResponseMessages.FOLLOW_REQUEST_REMOVED = 'Follow request removed';
ResponseMessages.FOLLOW_REQUEST_CANCELLED = 'Follow request cancelled';
ResponseMessages.FOLLOW_REQUEST_NOT_FOUND = 'Follow request not found';
ResponseMessages.USER_IS_NOT_FOLLOWER = 'User is not follower';
ResponseMessages.REMOVED_FOLLOWER = 'Removed follower';

ResponseMessages.PREKEY_BUNDLE_SAVED = 'Prekey bundle saved';
ResponseMessages.PREKEY_BUNDLE_NOT_SAVED = 'Prekey bundle not saved';
ResponseMessages.PREKEY_BUNDLE_NOT_FOUND = 'Prekey bundle not found';
ResponseMessages.PREKEY_BUNDLE_RECEIVED = 'Prekey bundle received';
ResponseMessages.PREKEY_BUNDLE_NOT_RECEIVED = 'Prekey bundle not received';
ResponseMessages.PREKEY_BUNDLE_ALREADY_EXISTS = 'Prekey bundle already exists';

ResponseMessages.DEVICE_ID_NOT_FOUND = 'Device id not found';
ResponseMessages.DEVICE_ID_ALREADY_EXISTS = 'Device id already exists';
ResponseMessages.DEVICE_ID_SAVED = 'Device id saved';
ResponseMessages.DEVICE_ID_NOT_SAVED = 'Device id not saved';
ResponseMessages.DEVICE_ID_DELETED = 'Device id deleted';
ResponseMessages.DEVICE_ID_RECEIVED = 'Device id received';

ResponseMessages.FCM_TOKEN_SAVED = 'FCM token saved';
ResponseMessages.FCM_TOKEN_NOT_SAVED = 'FCM token not saved';
ResponseMessages.FCM_TOKEN_NOT_FOUND = 'FCM token not found';
ResponseMessages.FCM_TOKEN_RECEIVED = 'FCM token received';
ResponseMessages.FCM_TOKEN_NOT_RECEIVED = 'FCM token not received';
ResponseMessages.FCM_TOKEN_ALREADY_EXISTS = 'FCM token already exists';

ResponseMessages.CANNOT_MESSAGE_YOURSELF = 'You cannot message yourself';
ResponseMessages.CHAT_MESSAGE_TYPING = 'Chat message typing';
ResponseMessages.CHAT_MESSAGE_NOT_TYPING = 'Chat message not typing';

ResponseMessages.ONLINE_USERS = 'Online users';

ResponseMessages.LOGIN_INFO_SAVED = 'Login info saved';
ResponseMessages.LOGIN_INFO_NOT_SAVED = 'Login info not saved';
ResponseMessages.LOGIN_INFO_NOT_FOUND = 'Login info not found';
ResponseMessages.LOGIN_INFO_RECEIVED = 'Login info received';
ResponseMessages.LOGIN_INFO_NOT_RECEIVED = 'Login info not received';
ResponseMessages.LOGIN_INFO_ALREADY_EXISTS = 'Login info already exists';
ResponseMessages.LOGIN_INFO_DELETED = 'Login info deleted';
ResponseMessages.LOGIN_INFO_FOUND = 'Login info found';
ResponseMessages.INVALID_LOGIN_INFO = 'Invalid login info';
ResponseMessages.LOGIN_INFO_VALIDATED = 'Login info validated';
ResponseMessages.NO_OTHER_DEVICES = 'No other devices';

ResponseMessages.CHAT_MESSAGE_ALREADY_DELETED = 'Chat message already deleted';

ResponseMessages.NOT_AUTHORIZED = 'Not authorized';
ResponseMessages.UNAUTHORIZED_ACCESS = 'Unauthorized access';
ResponseMessages.UNAUTHORIZED_ACCESS_MESSAGE = 'You are not authorized to access this resource';

ResponseMessages.UNKNOW_ERROR = 'Unknown error';
ResponseMessages.ALREADY_REQUESTED = 'Already requested';

ResponseMessages.GITHUB_API_ERROR = 'Github API error';
ResponseMessages.UPDATE_CHECKED = 'Update checked';
ResponseMessages.UPDATE_NOT_FOUND = 'Update not found';
ResponseMessages.UPDATE_FOUND = 'Update found';
ResponseMessages.UPDATE_DOWNLOADED = 'Update downloaded';
ResponseMessages.UPDATE_NOT_DOWNLOADED = 'Update not downloaded';
ResponseMessages.UPDATE_INSTALLED = 'Update installed';
ResponseMessages.NO_UPDATE_AVAILABLE = 'No update available';
ResponseMessages.UPDATE_ERROR = 'Update error';
ResponseMessages.UPDATE_AVAILABLE = 'Update available';

ResponseMessages.AUTH_TOKEN_NOT_FOUND = 'Auth token not found';

ResponseMessages.INELIGIBLE_FOR_VERIFICATION = 'You are not eligible for verification';

/// Invalid Response Messages
ResponseMessages.INVALID_LEGAL_NAME = 'Invalid legal name';
ResponseMessages.INVALID_FIRST_NAME = 'Invalid first name';
ResponseMessages.INVALID_LAST_NAME = 'Invalid last name';
ResponseMessages.INVALID_URL = 'Invalid url';
ResponseMessages.INVALID_ABOUT_LENGTH = 'Invalid about length';
ResponseMessages.CHAT_MESSAGE_NOT_FOUND = 'Chat message not found';
ResponseMessages.INVALID_ACTION = 'Invalid action';
ResponseMessages.INVALID = 'Invalid';
ResponseMessages.INVALID_DATA = 'Invalid data';
ResponseMessages.ACCOUNT_NOT_ACTIVE = 'Account not active';
ResponseMessages.INVALID_EXPIRED_TOKEN = 'Invalid or expired token';
ResponseMessages.INVALID_PHONE = 'Invalid phone';
ResponseMessages.INVALID_EMAIL = 'Invalid email';
ResponseMessages.INVALID_USERNAME = 'Invalid username';
ResponseMessages.INVALID_PASSWORD = 'Invalid password';
ResponseMessages.INVALID_OTP = 'Invalid OTP';
ResponseMessages.INVALID_FIRST_NAME_LENGTH = 'First name must be at least 3 characters';
ResponseMessages.INVALID_LAST_NAME_LENGTH = 'Last name must be at least 3 characters';
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
ResponseMessages.INVALID_POST_ID = 'Invalid post id';
ResponseMessages.INVALID_COMMENT_ID = 'Invalid comment id';
ResponseMessages.INVALID_CHAT_ID = 'Invalid chat id';
ResponseMessages.INVALID_USER_TYPE = 'Invalid user type';
ResponseMessages.INVALID_USER_STATUS = 'Invalid user status';
ResponseMessages.INVALID_USER_ACCOUNT_STATUS = 'Invalid user account status';
ResponseMessages.INVALID_ACCOUNT_VALIDATION = 'Your account is not validated';
ResponseMessages.ACCOUNT_VALIDATED = 'Your account is validated';
ResponseMessages.ACCOUNT_ALREADY_VALIDATED = 'Your account is already validated';
ResponseMessages.INVALID_ACCOUNT_STATUS = 'Invalid account status';
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
ResponseMessages.NOTIFICATION_NOT_FOUND = 'Notification not found';
ResponseMessages.NOTIFICATION_MARKED_READ = 'Notification marked read';
ResponseMessages.NOTIFICATION_ALREADY_READ = 'Notification already read';
ResponseMessages.NOTIFICATION_DELETED = 'Notification deleted';
ResponseMessages.USER_DETAILS_FETCHED = 'User details fetched';
ResponseMessages.USER_DETAILS_NOT_FETCHED = 'User details not fetched';
ResponseMessages.USER_PROFILE_DETAILS_FETCHED = 'User profile details fetched';
ResponseMessages.USER_PROFILE_DETAILS_NOT_FETCHED = 'User profile details not fetched';
ResponseMessages.COMMENT_REPLIES_FETCHED = 'Comment replies fetched';
ResponseMessages.COMMENT_REPLIES_NOT_FETCHED = 'Comment replies not fetched';
ResponseMessages.LIKED = 'Liked';
ResponseMessages.UNLIKED = 'Unliked';
ResponseMessages.LIKE_FAILED = 'Like failed';
ResponseMessages.UNLIKE_FAILED = 'Unlike failed';
ResponseMessages.USER_ALREADY_LIKED = 'User already liked';
ResponseMessages.USER_ALREADY_UNLIKED = 'User already unliked';
ResponseMessages.METHOD_NOT_ALLOWED = 'Method not allowed';
ResponseMessages.ACCOUNT_NOT_CREATED = 'Account not created';

/// Project Response Messages

ResponseMessages.PROJECT_NOT_FOUND = 'Project not found';
ResponseMessages.PROJECT_ALREADY_EXISTS = 'Project already exists';
ResponseMessages.PROJECT_CREATED = 'Project created';
ResponseMessages.PROJECT_UPDATED = 'Project updated';
ResponseMessages.PROJECT_DELETED = 'Project deleted';
ResponseMessages.PROJECT_NOT_DELETED = 'Project not deleted';
ResponseMessages.PROJECT_NOT_UPDATED = 'Project not updated';
ResponseMessages.PROJECT_NOT_CREATED = 'Project not created';

ResponseMessages.INVALID_DOWNLOAD_URL = 'Invalid download url';
ResponseMessages.INVALID_GITHUB_URL = 'Invalid github url';
ResponseMessages.INVALID_DEMO_URL = 'Invalid demo url';
ResponseMessages.INVALID_WEBSITE_URL = 'Invalid website url';
ResponseMessages.INVALID_ICON_URL = 'Invalid icon url';
ResponseMessages.INVALID_SCREENSHOT_URL = 'Invalid screenshot url';

ResponseMessages.INVALID_PROJECT_NAME = 'Invalid project name';
ResponseMessages.SLUG_NOT_GENERATED = 'Slug not generated';
ResponseMessages.PROJECT_ID_REQUIRED = 'Project id required';
ResponseMessages.VIEWS_COUNT_INCREMENTED_SUCCESSFULLY = 'Views count incremented successfully';
ResponseMessages.DOWNLOADS_COUNT_INCREMENTED_SUCCESSFULLY = 'Downloads count incremented successfully';

/// Verification Request Response Messages
ResponseMessages.VERIFICATION_REQUEST_ID_REQUIRED = 'Verification request id required';
ResponseMessages.VERIFICATION_REQUEST_NOT_FOUND = 'Verification request not found';
ResponseMessages.VERIFICATION_REQUEST_ALREADY_EXISTS = 'Verification request already exists';
ResponseMessages.VERIFICATION_REQUEST_SUCCESS = 'Request has been sent successfully';
ResponseMessages.VERIFICATION_REQUEST_ALREADY_PROCESSED = 'Verification request already processed';
ResponseMessages.VERIFICATION_REQUEST_APPROVED = 'Verification request approved';
ResponseMessages.VERIFICATION_REQUEST_REJECTED = 'Verification request rejected';
ResponseMessages.VERIFICATION_REQUEST_REJECTION_REASON_REQUIRED = 'Verification request rejection reason is required';
ResponseMessages.USER_NOT_VERIFIED = 'User not verified';
ResponseMessages.USER_ALREADY_VERIFIED = 'User already verified';
ResponseMessages.VERIFICATION_REMOVED = 'Verification removed';
ResponseMessages.VERIFICATION_REQUEST_DETAILS = 'Verification request details';

/// Comment Reply Response Messages
ResponseMessages.REPLY_REQUIRED = 'Reply is required';
ResponseMessages.COMMENT_REPLY_NOT_FOUND = 'Comment reply not found';
ResponseMessages.COMMENT_REPLY_ALREADY_EXISTS = 'Comment reply already exists';
ResponseMessages.COMMENT_REPLY_CREATED = 'Comment reply created';
ResponseMessages.COMMENT_REPLY_UPDATED = 'Comment reply updated';
ResponseMessages.COMMENT_REPLY_DELETED = 'Comment reply deleted';
ResponseMessages.COMMENT_REPLY_NOT_DELETED = 'Comment reply not deleted';
ResponseMessages.COMMENT_REPLY_NOT_UPDATED = 'Comment reply not updated';
ResponseMessages.COMMENT_REPLY_NOT_CREATED = 'Comment reply not created';
ResponseMessages.COMMENT_REPLY_ID_REQUIRED = 'Comment reply id required';
ResponseMessages.COMMENT_REPLY_NOT_FOUND = 'Comment reply not found';
ResponseMessages.COMMENT_REPLY_ADD_SUCCESS = 'Comment reply added successfully';
ResponseMessages.COMMENT_REPLY_DELETE_SUCCESS = 'Comment reply deleted successfully';

/// Block Response Messages
ResponseMessages.BLOCKED_USERS_FETCHED = 'Blocked users fetched';

/// Report Response Messages
ResponseMessages.REPORT_ID_REQUIRED = 'Report id required';
ResponseMessages.REPORT_NOT_FOUND = 'Report not found';
ResponseMessages.REPORT_ALREADY_EXISTS = 'Report already exists';
ResponseMessages.REPORT_CREATED = 'Report created';
ResponseMessages.REPORT_UPDATED = 'Report updated';
ResponseMessages.REPORT_DELETED = 'Report deleted';
ResponseMessages.REPORT_NOT_DELETED = 'Report not deleted';
ResponseMessages.REPORT_NOT_UPDATED = 'Report not updated';
ResponseMessages.REPORT_NOT_CREATED = 'Report not created';
ResponseMessages.REPORT_ADD_SUCCESS = 'Report added successfully';
ResponseMessages.REPORT_DELETE_SUCCESS = 'Report deleted successfully';
ResponseMessages.REPORTS_FETCHED = 'Reports fetched';
ResponseMessages.REPORTS_NOT_FETCHED = 'Reports not fetched';
ResponseMessages.REPORTS_FETCHED_SUCCESS = 'Reports fetched successfully';
ResponseMessages.REPORTS_FETCHED_FAILED = 'Reports not fetched successfully';
ResponseMessages.CANNOT_REPORT_YOURSELF = 'You cannot report yourself';


export default ResponseMessages;