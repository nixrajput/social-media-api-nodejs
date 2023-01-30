import LoginInfo from "./login-info/loginInfo.js";
import User from "./user/User.js";
import BlockedUser from "./user/BlockedUser.js";
import Notification from "./notification/notification.js";
import Post from "./post/Post.js";
import Comment from "./comment/Comment.js";
import CommentLike from "./comment/CommentLike.js";
import CommentReply from "./comment/CommentReply.js";
import CommentReplyLike from "./comment/CommentReplyLike.js";
import Otp from "./otp/Otp.js";
import Tag from "./hashtag/tag.js";
import PostLike from "./post/PostLike.js";
import Follower from "./user/Follower.js";
import FollowRequest from "./requests/followRequest.js";
import ChatMessage from "./chat/ChatMessage.js";
import FcmToken from "./user/FcmToken.js";
import PreKeyBundle from "./user/PreKeyBundle.js";
import FeedbackReport from "./reports/feedbackReport.js";
import PostReport from "./reports/PostReport.js";
import CommentReport from "./reports/CommentReport.js";
import CommentReplyReport from "./reports/CommentReplyReport.js";
import UserReport from "./reports/UserReport.js";
import AppIssueReport from "./reports/AppIssueReport.js";
import VerificationRequest from "./requests/VerificationRequest.js";
import AuthToken from "./user/AuthToken.js";
import PollVote from "./post/PollVote.js";
import PollOption from "./post/PollOption.js";
import PostMedia from "./media/PostMedia.js";
import Project from "./project/Project.js";
import ProjectScreenshot from "./media/ProjectScreenshot.js";

const models = {};

models.Comment = Comment;
models.CommentLike = CommentLike;
models.CommentReply = CommentReply;
models.CommentReplyLike = CommentReplyLike;

models.PostMedia = PostMedia;

models.OTP = Otp;

models.Tag = Tag;

models.Post = Post;
models.PostLike = PostLike;
models.PollOption = PollOption;
models.PollVote = PollVote;

models.AuthToken = AuthToken;
models.User = User;
models.BlockedUser = BlockedUser;
models.LoginInfo = LoginInfo;
models.Follower = Follower;
models.FcmToken = FcmToken;
models.PreKeyBundle = PreKeyBundle;

models.Notification = Notification;

models.ChatMessage = ChatMessage;

models.FeedbackReport = FeedbackReport;
models.PostReport = PostReport;
models.CommentReport = CommentReport;
models.CommentReplyReport = CommentReplyReport;
models.UserReport = UserReport;
models.AppIssueReport = AppIssueReport;

models.FollowRequest = FollowRequest;
models.VerificationRequest = VerificationRequest;

models.Project = Project;
models.ProjectScreenshot = ProjectScreenshot;

export default models;
