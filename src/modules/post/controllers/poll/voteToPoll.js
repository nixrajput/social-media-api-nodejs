import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import dateUtility from "../../../../utils/dateUtil.js";

/// VOTE TO POLL ///

const voteToPoll = catchAsyncError(async (req, res, next) => {
    const { pollId, optionId } = req.body;

    if (!pollId) {
        return next(new ErrorHandler(ResponseMessages.POLL_ID_REQUIRED, 400));
    }

    if (!optionId) {
        return next(new ErrorHandler(ResponseMessages.POLL_OPTION_ID_REQUIRED, 400));
    }

    const poll = await models.Post.findById(pollId).select("-__v");

    if (!poll) {
        return next(new ErrorHandler(ResponseMessages.POLL_NOT_FOUND, 404));
    }

    if (poll.postType !== "poll") {
        return next(new ErrorHandler(ResponseMessages.POLL_NOT_FOUND, 404));
    }

    // if (poll.owner.toString() === req.user._id.toString()) {
    //     return next(new ErrorHandler(ResponseMessages.POLL_OWNER_CANNOT_VOTE, 400));
    // }

    if (dateUtility.isDateExpired(poll.pollEndsAt)) {
        return next(new ErrorHandler(ResponseMessages.POLL_EXPIRED, 400));
    }

    const option = await models.PollOption.findById(optionId).select("-__v");

    if (!option) {
        return next(new ErrorHandler(ResponseMessages.POLL_OPTION_NOT_FOUND, 404));
    }

    const vote = await models.PollVote.findOne({
        user: req.user._id,
        poll: pollId,
    });

    if (vote) {
        return next(new ErrorHandler(ResponseMessages.POLL_ALREADY_VOTED, 400));
    }

    const newVote = {
        user: req.user._id,
        poll: pollId,
        option: optionId,
    }

    const pollVote = await models.PollVote.create(newVote);

    poll.totalVotes++;
    await poll.save();
    option.votes++;
    await option.save();

    res.status(200).json({
        success: true,
        message: ResponseMessages.POLL_VOTED,
        data: pollVote,
    });
});

export default voteToPoll;