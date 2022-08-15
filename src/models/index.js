import DeviceInfo from "./auth/deviceInfo.js";
import User from "./auth/user.js";
import Notification from "./notification/notification.js";
import Post from "./post/post.js";
import Comment from "./post/comment.js";
import OTP from "./otp/otp.js";

const models = {};

models.DeviceInfo = DeviceInfo;
models.User = User;
models.Notification = Notification;
models.Post = Post;
models.Comment = Comment;
models.OTP = OTP;

export default models;
