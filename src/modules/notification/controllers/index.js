import getNotifications from "./getNotifications.js";
import markReadNotification from "./markNotificationRead.js";

const notificationController = {};

notificationController.getNotifications = getNotifications;
notificationController.markReadNotification = markReadNotification;

export default notificationController;
