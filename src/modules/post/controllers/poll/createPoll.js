import ResponseMessages from "../../../../contants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// CREATE POLL ///

const createPoll = catchAsyncError(async (req, res, next) => {
    let { pollQuestion, pollOptions, pollEndsAt, visibility } = req.body;

    if (!pollQuestion) {
        return next(new ErrorHandler(ResponseMessages.POLL_QUESTION_REQUIRED, 400));
    }

    if (!pollOptions) {
        return next(new ErrorHandler(ResponseMessages.POLL_OPTIONS_REQUIRED, 400));
    }

    if (pollOptions && pollOptions.length < 2) {
        return next(new ErrorHandler(ResponseMessages.POLL_OPTIONS_MIN, 400));
    }

    if (!pollEndsAt) {
        return next(new ErrorHandler(ResponseMessages.POLL_LENGTH_REQUIRED, 400));
    }

    const newPoll = {
        owner: req.user._id,
        pollQuestion: pollQuestion,
        pollEndsAt: pollEndsAt,
        visibility: visibility,
        postType: "poll",
    }

    const post = await models.Post.create(newPoll);

    const pollOps = [];

    for (let i = 0; i < pollOptions.length; i++) {
        let option = await models.PollOption.create({
            option: pollOptions[i],
            post: post._id,
        });

        pollOps.push(option._id);
    }

    post.pollOptions = pollOps;
    await post.save();

    const user = await models.User.findById(req.user._id).select("_id postsCount");
    user.postsCount++;
    await user.save();

    let hashtags = [];
    let mentions = [];

    if (pollQuestion) {
        hashtags = utility.getHashTags(pollQuestion);
        mentions = utility.getMentions(pollQuestion);

        if (mentions.length > 0) {
            for (let i = 0; i < mentions.length; i++) {
                const mentionedUser = await models.User.findOne({ uname: mentions[i] })
                    .select(["_id", "uname"]);

                const notification = await models.Notification.findOne({
                    to: mentionedUser._id,
                    from: req.user._id,
                    refId: post._id,
                    type: "postMention"
                });

                const isPostOwner = await utility.checkIfPostOwner(post._id, mentionedUser);

                if (mentionedUser && (!notification && !isPostOwner)) {
                    await models.Notification.create({
                        to: mentionedUser._id,
                        from: req.user._id,
                        refId: post._id,
                        body: `mentioned you in a post`,
                        type: "postMention"
                    });
                }
            }
        }

        for (let i = 0; i < hashtags.length; i++) {
            const tag = await models.Tag.findOne({ name: hashtags[i] });

            if (tag) {
                tag.postsCount++;
                await tag.save();
            } else {
                await models.Tag.create({
                    name: hashtags[i],
                    postsCount: 1,
                });
            }
        }

    }

    const postData = await utility.getPostData(post._id, req.user);

    res.status(201).json({
        success: true,
        message: ResponseMessages.POLL_CREATE_SUCCESS,
        post: postData,
    });
});

export default createPoll;
