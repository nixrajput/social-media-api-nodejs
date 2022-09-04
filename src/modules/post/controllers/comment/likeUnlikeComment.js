import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// LIKE/UNLIKE COMMENT ///

const likeUnlikeComment = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(
      new ErrorHandler("please enter comment id in query params", 400)
    );
  }

  const comment = await models.Comment.findById(req.query.id);

  if (!comment) {
    return next(new ErrorHandler("comment not found", 404));
  }

  if (comment.likes.includes(req.user._id)) {
    const index = comment.likes.indexOf(req.user._id);

    comment.likes.splice(index, 1);
    comment.likesCount--;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "comment unliked",
    });
  } else {
    comment.likes.push(req.user._id);
    comment.likesCount++;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "comment liked",
    });
  }
});

export default likeUnlikeComment;
