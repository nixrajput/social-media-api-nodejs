import getNotifications from "./getNotifications.js";
import markReadNotification from "./markNotificationRead.js";
import deleteNotification from "./deleteNotification.js";

const notificationController = {};

notificationController.getNotifications = getNotifications;
notificationController.markReadNotification = markReadNotification;
notificationController.deleteNotification = deleteNotification;

export default notificationController;
