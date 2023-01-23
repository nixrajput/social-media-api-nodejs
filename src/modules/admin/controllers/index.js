import getUsers from "./user/getUsers.js";
import deleteUser from "./user/deleteUser.js";
import updateAccountStatus from "./user/updateAccountStatus.js";
import updateUserRole from "./user/updateUserRole.js";
import getUserDetails from "./user/getUserDetails.js";
import getPosts from "./post/getPosts.js";
import updateVerificationStatus from "./user/updateVerificationStatus.js";
import getAllComments from "./comment/getAllComments.js";
import adminLogin from "./auth/login.js";
import getProgress from "./stats/getProgress.js";
import forgotAdminPassword from "./auth/forgotPassword.js";
import resetAdminPassword from "./auth/resetPassword.js";
import changeAdminPassword from "./auth/changePassword.js";
import getStats from "./stats/getStats.js";
import getRecentPosts from "./post/getRecentPosts.js";
import getRecentUsers from "./user/getRecentUsers.js";
import getVerifiedUsersStats from "./user/getVerifiedUsersStats.js";
import getMonthlyStats from "./stats/monthlyStats.js";
import getPostDetails from "./post/getPostDetails.js";
import getVerificationRequests from "./verification/getRequests.js";
import approveVerificationRequest from "./verification/approveRequest.js";
import rejectVerificationRequest from "./verification/rejectRequest.js";
import removeVerificationStatus from "./verification/removeVerificationStatus.js";
import getVerificationRequestDetails from "./verification/getRequestDetails.js";
import searchUsers from "./user/searchUsers.js";
import getProjects from "./projects/getProjects.js";
import getProjectDetails from "./projects/getProjectDetails.js";
import searchProjects from "./projects/searchProjects.js";
import updateProject from "./projects/updateProject.js";

const adminController = {};

adminController.adminLogin = adminLogin;

adminController.getUsers = getUsers;
adminController.searchUsers = searchUsers;
adminController.deleteUser = deleteUser;
adminController.updateAccountStatus = updateAccountStatus;
adminController.updateUserRole = updateUserRole;
adminController.getUserDetails = getUserDetails;

adminController.getPosts = getPosts;
adminController.updateVerificationStatus = updateVerificationStatus;
adminController.getAllComments = getAllComments;

adminController.getProgress = getProgress;
adminController.getStats = getStats;
adminController.adminForgotPassword = forgotAdminPassword;
adminController.adminResetPassword = resetAdminPassword;
adminController.changeAdminPassword = changeAdminPassword;

adminController.getRecentPosts = getRecentPosts;
adminController.getRecentUsers = getRecentUsers;
adminController.getVerifiedUsers = getVerifiedUsersStats;
adminController.getMonthlyStats = getMonthlyStats;
adminController.getPostDetails = getPostDetails;

adminController.getVerificationRequests = getVerificationRequests;
adminController.approveVerificationRequest = approveVerificationRequest;
adminController.rejectVerificationRequest = rejectVerificationRequest;
adminController.removeVerificationStatus = removeVerificationStatus;
adminController.getVerificationRequestDetails = getVerificationRequestDetails;

adminController.getProjects = getProjects;
adminController.getProjectDetails = getProjectDetails;
adminController.searchProjects = searchProjects;
adminController.updateProject = updateProject;

export default adminController;
