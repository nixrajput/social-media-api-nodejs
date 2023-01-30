import createPost from "./post/createPost.js";
import createPoll from "./poll/createPoll.js";
import voteToPoll from "./poll/voteToPoll.js";
import getPosts from "./post/getPosts.js";
import likeUnlikePost from "./post/likeUnlikePost.js";
import deletePost from "./post/deletePost.js";
import getPostDetails from "./post/getPostDetails.js";
import addComment from "./comment/addComment.js";
import getComments from "./comment/getComments.js";
import likeUnlikeComment from "./comment/likeUnlikeComment.js";
import deleteComment from "./comment/deleteComment.js";
import createUploadPost from "./post/createUploadPost.js";
import getLikedUsers from "./post/getLikedUsers.js";
import getTrendingPosts from "./post/getTrendingPosts.js";
import searchPosts from "./post/searchPost.js";
import reportPost from "./post/reportPost.js";
import reportComment from "./comment/reportComment.js";
import addCommentReply from "./comment/addCommentReply.js";
import likeUnlikeCommentReply from "./comment/likeUnlikeCommentReply.js";
import getCommentReplies from "./comment/getCommentReplies.js";
import deleteCommentReply from "./comment/deleteCommentReply.js";
import reportCommentReply from "./comment/reportCommentReply.js";

const postController = {};

postController.createPost = createPost;
postController.createPoll = createPoll;
postController.voteToPoll = voteToPoll;
postController.getPosts = getPosts;
postController.likeUnlikePost = likeUnlikePost;
postController.deletePost = deletePost;
postController.getPostDetails = getPostDetails;
postController.addComment = addComment;
postController.getComments = getComments;
postController.likeUnlikeComment = likeUnlikeComment;
postController.deleteComment = deleteComment;
postController.createUploadPost = createUploadPost;
postController.getLikedUsers = getLikedUsers;
postController.getTrendingPosts = getTrendingPosts;
postController.searchPosts = searchPosts;

postController.reportPost = reportPost;
postController.reportComment = reportComment;

postController.addCommentReply = addCommentReply;
postController.likeUnlikeCommentReply = likeUnlikeCommentReply;
postController.getCommentReplies = getCommentReplies;
postController.deleteCommentReply = deleteCommentReply;
postController.reportCommentReply = reportCommentReply;

export default postController;
