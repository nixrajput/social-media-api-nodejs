import LoginInfo from "./login-info/loginInfo.js";
import User from "./user/user.js";
import Notification from "./notification/notification.js";
import Post from "./post/post.js";
import Comment from "./comment/comment.js";
import CommentLike from "./comment/commentLike.js";
import CommentReply from "./comment/commentReply.js";
import OTP from "./otp/otp.js";
import Tag from "./hashtag/tag.js";
import PostLike from "./post/postLike.js";
import Follower from "./user/follower.js";
import FollowRequest from "./requests/followRequest.js";
import ChatMessage from "./chat/chatMessage.js";
import FcmToken from "./user/fcmToken.js";
import PreKeyBundle from "./user/preKeyBundle.js";
import FeedbackReport from "./reports/feedbackReport.js";
import PostReport from "./reports/postReport.js";
import CommentReport from "./reports/commentReport.js";
import UserReport from "./reports/userReport.js";
import IssueReport from "./reports/issueReport.js";
import BlueTickRequest from "./requests/blueTickRequest.js";

const models = {};

models.Comment = Comment;
models.CommentLike = CommentLike;
models.CommentReply = CommentReply;

models.OTP = OTP;

models.Tag = Tag;

models.Post = Post;
models.PostLike = PostLike;

models.User = User;
models.LoginInfo = LoginInfo;
models.Follower = Follower;
models.FcmToken = FcmToken;
models.PreKeyBundle = PreKeyBundle;

models.Notification = Notification;

models.ChatMessage = ChatMessage;

models.FeedbackReport = FeedbackReport;
models.PostReport = PostReport;
models.CommentReport = CommentReport;
models.UserReport = UserReport;
models.IssueReport = IssueReport;

models.FollowRequest = FollowRequest;
models.BlueTickRequest = BlueTickRequest;

export default models;
