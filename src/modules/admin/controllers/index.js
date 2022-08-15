import getAllUsers from "./user/getAllUsers.js";
import deleteUser from "./user/deleteUser.js";
import updateAccountStatus from "./user/updateAccountStatus.js";
import searchUser from "./user/searchUser.js";
import updateUserRole from "./user/updateUserRole.js";
import getUserDetails from "./user/getUserDetails.js";

const adminController = {};

adminController.getAllUsers = getAllUsers;
adminController.deleteUser = deleteUser;
adminController.updateAccountStatus = updateAccountStatus;
adminController.searchUser = searchUser;
adminController.updateUserRole = updateUserRole;
adminController.getUserDetails = getUserDetails;

export default adminController;
