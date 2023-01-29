import { Router } from "express";
import multerMiddleware from "../../../middlewares/multer.js";
import authMiddleware from "../../../middlewares/auth.js";
import userController from "../controllers/index.js";

const userRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

// Public Routes  -------------------------------------------------------------

userRouter.route("/check-username")
  .post(userController.checkUsernameAvailable);

// Authenticated Routes -------------------------------------------------------

userRouter
  .route("/change-password")
  .post(isAuthenticatedUser, userController.changePassword);

userRouter
  .route("/me")
  .get(isAuthenticatedUser, userController.getProfileDetails);

userRouter
  .route("/update-profile")
  .put(isAuthenticatedUser, userController.updateProfile);

userRouter
  .route("/upload-avatar")
  .post(
    multerMiddleware.single("avatar"),
    isAuthenticatedUser,
    userController.uploadAvatar
  );

userRouter
  .route("/delete-avatar")
  .delete(isAuthenticatedUser, userController.deleteAvatar);

userRouter
  .route("/upload-profile-picture")
  .post(isAuthenticatedUser, userController.uploadProfilePicture);

userRouter
  .route("/remove-profile-picture")
  .delete(isAuthenticatedUser, userController.removeProfilePicture);

userRouter
  .route("/deactivate-account")
  .post(isAuthenticatedUser, userController.deactivateAccount);

userRouter
  .route("/reactivate-account")
  .post(userController.reactivateAccountOtp)
  .put(userController.reactivateAccount);

userRouter
  .route("/change-username")
  .post(isAuthenticatedUser, userController.changeUsername);

userRouter
  .route("/change-email")
  .post(isAuthenticatedUser, userController.changeEmailOtp)
  .put(isAuthenticatedUser, userController.changeEmail);

userRouter
  .route("/add-change-phone")
  .post(isAuthenticatedUser, userController.addChangePhoneOtp)
  .put(isAuthenticatedUser, userController.addChangePhone);

userRouter
  .route("/verify-password")
  .post(isAuthenticatedUser, userController.verifyPassword);

userRouter
  .route("/pre-key-bundle")
  .get(isAuthenticatedUser, userController.getPreKeyBundle)
  .post(isAuthenticatedUser, userController.savePreKeyBundle);

userRouter
  .route("/fcm-token")
  .get(isAuthenticatedUser, userController.getFcmToken)
  .post(isAuthenticatedUser, userController.saveFcmToken);


/// Follow Operations

userRouter
  .route("/follow-user")
  .get(isAuthenticatedUser, userController.followUnfollowUser);

userRouter
  .route("/get-follow-requests")
  .get(isAuthenticatedUser, userController.getFollowRequests);

userRouter
  .route("/accept-follow-request")
  .get(isAuthenticatedUser, userController.acceptFollowRequest);

userRouter
  .route("/cancel-follow-request")
  .get(isAuthenticatedUser, userController.cancelFollowRequest);

userRouter
  .route("/remove-follow-request")
  .delete(isAuthenticatedUser, userController.removeFollowRequest);

userRouter
  .route("/remove-follower")
  .delete(isAuthenticatedUser, userController.removeFollower);

userRouter
  .route("/search-followers")
  .get(isAuthenticatedUser, userController.searchFollowers);

userRouter
  .route("/search-followings")
  .get(isAuthenticatedUser, userController.searchFollowings);

userRouter
  .route("/user-details")
  .get(isAuthenticatedUser, userController.getUserDetails);

userRouter
  .route("/get-user-posts")
  .get(isAuthenticatedUser, userController.getUserPosts);

userRouter
  .route("/get-followings")
  .get(isAuthenticatedUser, userController.getFollowings);

userRouter
  .route("/get-followers")
  .get(isAuthenticatedUser, userController.getFollowers);

userRouter
  .route("/delete-profile")
  .get(isAuthenticatedUser, userController.deleteProfile);

userRouter
  .route("/search-user")
  .get(isAuthenticatedUser, userController.searchUser);

userRouter
  .route("/get-recommend-users")
  .get(isAuthenticatedUser, userController.getRecommendedUsers);

userRouter
  .route("/get-login-history")
  .get(isAuthenticatedUser, userController.getLoginHistory);

userRouter
  .route("/login-info")
  .get(isAuthenticatedUser, userController.getLoginInfo)
  .post(isAuthenticatedUser, userController.saveLoginInfo)
  .delete(isAuthenticatedUser, userController.deleteLoginInfo);

userRouter
  .route("/logout-all-other-devices")
  .delete(isAuthenticatedUser, userController.logoutOtherDevices);

userRouter
  .route("/verify-login-info")
  .get(isAuthenticatedUser, userController.verifyLoginInfo);

userRouter
  .route("/report-user")
  .post(isAuthenticatedUser, userController.reportUser);

userRouter
  .route("/request-verification")
  .post(isAuthenticatedUser, userController.requestVerification);

/// @route  POST api/v1/block-user
/// @desc   Block User
/// @access Private
userRouter
  .route("/block-user")
  .post(isAuthenticatedUser, userController.blockUser);


/// @route  POST api/v1/unblock-user
/// @desc   Unblock User
/// @access Private
userRouter
  .route("/unblock-user")
  .post(isAuthenticatedUser, userController.unblockUser);

/// @route GET api/v1/get-blocked-users
/// @desc Get Blocked Users
/// @access Private
userRouter
  .route("/get-blocked-users")
  .get(isAuthenticatedUser, userController.getBlockedUsers);

export default userRouter;
