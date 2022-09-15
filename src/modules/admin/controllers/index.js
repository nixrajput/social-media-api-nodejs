import getAllUsers from "./user/getAllUsers.js";
import deleteUser from "./user/deleteUser.js";
import updateAccountStatus from "./user/updateAccountStatus.js";
import searchUser from "./user/searchUser.js";
import updateUserRole from "./user/updateUserRole.js";
import getUserDetails from "./user/getUserDetails.js";
import getAllPosts from "./post/getAllPosts.js";
import updateVerificationStatus from "./user/updateVerificationStatus.js";
import getAllComments from "./comment/getAllComments.js";

const adminController = {};

adminController.getAllUsers = getAllUsers;
adminController.deleteUser = deleteUser;
adminController.updateAccountStatus = updateAccountStatus;
adminController.searchUser = searchUser;
adminController.updateUserRole = updateUserRole;
adminController.getUserDetails = getUserDetails;
adminController.getAllPosts = getAllPosts;
adminController.updateVerificationStatus = updateVerificationStatus;
adminController.getAllComments = getAllComments;

export default adminController;
