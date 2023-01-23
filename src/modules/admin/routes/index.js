import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.js";
import adminController from "../controllers/index.js";

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;
const authorizeRoles = authMiddleware.authorizeRoles;

const validRoles = authorizeRoles("admin", "superadmin", "moderator");

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
    validRoles,
    adminController.changeAdminPassword
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get Progress
adminRouter.route("/admin/get-progress")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getProgress
  );

// Get Stats
adminRouter.route("/admin/get-stats")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getStats
  );

// Get Monthly Stats
adminRouter.route("/admin/get-monthly-stats")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getMonthlyStats
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get Recent Users
adminRouter.route("/admin/get-recent-users")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getRecentUsers
  );

// Get All Users
adminRouter
  .route("/admin/users")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getUsers
  );

// Get Verified Users
adminRouter
  .route("/admin/get-verified-users-stats")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getVerifiedUsers
  );

// Search User
adminRouter
  .route("/admin/search-users")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.searchUsers
  );

// Delete User
adminRouter
  .route("/admin/delete-user")
  .delete(
    isAuthenticatedUser,
    validRoles,
    adminController.deleteUser
  )

// Get User Details
adminRouter
  .route("/admin/get-user-details")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getUserDetails
  );

// Update User Role
adminRouter
  .route("/admin/user/update-role")
  .put(
    isAuthenticatedUser,
    validRoles,
    adminController.updateUserRole
  );

// Update Account Status
adminRouter
  .route("/admin/user/update-status")
  .put(
    isAuthenticatedUser,
    validRoles,
    adminController.updateAccountStatus
  );

// Update Verification Status
adminRouter
  .route("/admin/user/update-verification-status")
  .put(
    isAuthenticatedUser,
    validRoles,
    adminController.updateVerificationStatus
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get All Posts
adminRouter
  .route("/admin/posts")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getPosts
  );

// Get Post Details
adminRouter
  .route("/admin/get-post-details")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getPostDetails
  );

// Get Recent Posts
adminRouter.route("/admin/get-recent-posts")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getRecentPosts
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get All Comments
adminRouter
  .route("/admin/get-comments")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getAllComments
  );
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Get Verification Requests
adminRouter
  .route("/admin/verification-requests")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getVerificationRequests
  );

// Get Verification Request Details
adminRouter
  .route("/admin/verification-request-details")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getVerificationRequestDetails
  );

// Approve Verification Request
adminRouter
  .route("/admin/approve-verification-request")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.approveVerificationRequest
  );

// Reject Verification Request
adminRouter
  .route("/admin/reject-verification-request")
  .post(
    isAuthenticatedUser,
    validRoles,
    adminController.rejectVerificationRequest
  );

// Remove Verification Status
adminRouter
  .route("/admin/remove-verification-status")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.removeVerificationStatus
  );
// --------------------------------------------------------------------------------


/// Project Routes
// --------------------------------------------------------------------------------
// Get All Projects
adminRouter
  .route("/admin/projects")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getProjects
  );

// Get Project Details
adminRouter
  .route("/admin/get-project-details")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.getProjectDetails
  );

// Search Project
adminRouter
  .route("/admin/search-projects")
  .get(
    isAuthenticatedUser,
    validRoles,
    adminController.searchProjects
  );

// Update Project
adminRouter
  .route("/admin/update-project")
  .put(
    isAuthenticatedUser,
    validRoles,
    adminController.updateProject
  );

// Update Project Screenshots
adminRouter
  .route("/admin/update-project-screenshots")
  .put(
    isAuthenticatedUser,
    validRoles,
    adminController.updateProjectScreenshots
  );


export default adminRouter;
