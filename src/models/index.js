import DeviceInfo from "./device-info/deviceInfo.js";
import User from "./user/user.js";
import Notification from "./notification/notification.js";
import Post from "./post/post.js";
import Comment from "./comment/comment.js";
import OTP from "./otp/otp.js";

const models = {};

models.DeviceInfo = DeviceInfo;
models.User = User;
models.Notification = Notification;
models.Post = Post;
models.Comment = Comment;
models.OTP = OTP;

export default models;
