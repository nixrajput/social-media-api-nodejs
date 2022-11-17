import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import adminController from "../controllers/index.js";

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;
const authorizeRoles = authMiddleware.authorizeRoles;

const adminRouter = Router();

// --------------------------------- Routes ---------------------------------------

// --------------------------------------------------------------------------------
// Admin Login
adminRouter.route("/admin/login")
  .post(adminController.adminLogin);

// Admin Forgot Password
adminRouter.route("/admin/forgot-password")
  .post(adminController.adminForgotPassword);

// Admin Reset Password
adminRouter.route("/admin/reset-password")
  .post(adminController.adminResetPassword);

// Admin Change Password
adminRouter.route("/admin/change-password")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.changeAdminPassword
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get Progress
adminRouter.route("/admin/get-progress")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getProgress
  );

// Get Stats
adminRouter.route("/admin/get-stats")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getStats
  );

// Get Monthly Stats
adminRouter.route("/admin/get-monthly-stats")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getMonthlyStats
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get Recent Users
adminRouter.route("/admin/get-recent-users")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getRecentUsers
  );

// Get All Users
adminRouter
  .route("/admin/get-users")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getAllUsers
  );

// Get Verified Users
adminRouter
  .route("/admin/get-verified-users-stats")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getVerifiedUsers
  );

// Search User
adminRouter
  .route("/admin/user/search")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.searchUser
  );

// Delete User
adminRouter
  .route("/admin/delete-user")
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.deleteUser
  )

// Get User Details
adminRouter
  .route("/admin/get-user-details")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getUserDetails
  );

// Update User Role
adminRouter
  .route("/admin/user/update-role")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.updateUserRole
  );

// Update Account Status
adminRouter
  .route("/admin/user/update-status")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.updateAccountStatus
  );

// Update Verification Status
adminRouter
  .route("/admin/user/update-verification-status")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.updateVerificationStatus
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get All Posts
adminRouter
  .route("/admin/get-posts")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getAllPosts
  );

// Get Post Details
adminRouter
  .route("/admin/get-post-details")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getPostDetails
  );

// Get Recent Posts
adminRouter.route("/admin/get-recent-posts")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getRecentPosts
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get All Comments
adminRouter
  .route("/admin/get-comments")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    adminController.getAllComments
  );
// --------------------------------------------------------------------------------

export default adminRouter;
