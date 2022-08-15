import { Router } from "express";
import multerMiddleware from "../../../middlewares/multer.js";
import authMiddleware from "../../../middlewares/auth.js";
import userController from "../controllers/index.js";

const userRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

// Public Routes  -------------------------------------------------------------

userRouter.route("/check-username").post(userController.checkUsernameAvailable);

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
    userController.uploadProfilePicture
  );

userRouter
  .route("/delete-avatar")
  .delete(isAuthenticatedUser, userController.removeProfilePicture);

userRouter
  .route("/change-username")
  .post(isAuthenticatedUser, userController.changeUsername);

userRouter
  .route("/verify-email")
  .get(isAuthenticatedUser, userController.sendEmailVerificationOtp)
  .post(isAuthenticatedUser, userController.verifyEmail);

userRouter
  .route("/follow-user")
  .get(isAuthenticatedUser, userController.followUser);

userRouter
  .route("/user-details")
  .get(isAuthenticatedUser, userController.getUserDetails);

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

// userRouter.route("/get-random-users").get(isAuthenticatedUser, getRandomUsers);

// userRouter.route("/save-login-info").post(isAuthenticatedUser, saveLoginInfo);

// userRouter.route("/get-login-info").get(isAuthenticatedUser, getLoginInfo);

export default userRouter;
