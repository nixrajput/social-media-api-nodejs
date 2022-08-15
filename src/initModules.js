// import postModule from "./modules/post/index.js";
// import notificationModule from "./modules/notifications/index.js";
import authModule from "./modules/auth/index.js";
import userModule from "./modules/user/index.js";
import adminModule from "./modules/admin/index.js";

const initModules = (app) => {
  authModule.init(app);
  userModule.init(app);
  adminModule.init(app);
  //postModule.init(app);
  //notificationModule.init(app);
};

export default initModules;
