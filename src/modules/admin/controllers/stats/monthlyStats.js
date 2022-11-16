import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import dateUtility from "../../../../utils/dateUtil.js";
import utility from "../../../../utils/utility.js";

/// GET MONTHLY STATS -- ADMIN ///

const usersColor = "hsl(172, 70%, 50%)";
const postsColor = "hsl(241, 70%, 50%)";
const commentsColor = "hsl(39, 70%, 50%)";

const getMonthlyStats = catchAsyncError(async (req, res, next) => {
    const results = [];
    const date = new Date();

    // 1st month
    const firstDayPrevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const lastDayPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const monthName = dateUtility.getMonthName(firstDayPrevMonth, true);

    const data1 = await utility.getStats(firstDayPrevMonth, lastDayPrevMonth);

    results.push({
        month: monthName,
        users: data1.users,
        posts: data1.posts,
        comments: data1.comments,
        usersColor,
        postsColor,
        commentsColor
    });

    // 2nd month
    const firstDay2ndPrevMonth = new Date(date.getFullYear(), date.getMonth() - 2, 1);
    const lastDay2ndPrevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 0);
    const monthName2 = dateUtility.getMonthName(firstDay2ndPrevMonth, true);

    const data2 = await utility.getStats(firstDay2ndPrevMonth, lastDay2ndPrevMonth);

    results.push({
        month: monthName2,
        users: data2.users,
        posts: data2.posts,
        comments: data2.comments,
        usersColor,
        postsColor,
        commentsColor
    });

    // 3rd month
    const firstDay3rdPrevMonth = new Date(date.getFullYear(), date.getMonth() - 3, 1);
    const lastDay3rdPrevMonth = new Date(date.getFullYear(), date.getMonth() - 2, 0);
    const monthName3 = dateUtility.getMonthName(firstDay3rdPrevMonth, true);

    const data3 = await utility.getStats(firstDay3rdPrevMonth, lastDay3rdPrevMonth);

    results.push({
        month: monthName3,
        users: data3.users,
        posts: data3.posts,
        comments: data3.comments,
        usersColor,
        postsColor,
        commentsColor
    });

    // 4th month
    const firstDay4thPrevMonth = new Date(date.getFullYear(), date.getMonth() - 4, 1);
    const lastDay4thPrevMonth = new Date(date.getFullYear(), date.getMonth() - 3, 0);
    const monthName4 = dateUtility.getMonthName(firstDay4thPrevMonth, true);

    const data4 = await utility.getStats(firstDay4thPrevMonth, lastDay4thPrevMonth);

    results.push({
        month: monthName4,
        users: data4.users,
        posts: data4.posts,
        comments: data4.comments,
        usersColor,
        postsColor,
        commentsColor
    });

    // 5th month
    const firstDay5thPrevMonth = new Date(date.getFullYear(), date.getMonth() - 5, 1);
    const lastDay5thPrevMonth = new Date(date.getFullYear(), date.getMonth() - 4, 0);
    const monthName5 = dateUtility.getMonthName(firstDay5thPrevMonth, true);

    const data5 = await utility.getStats(firstDay5thPrevMonth, lastDay5thPrevMonth);

    results.push({
        month: monthName5,
        users: data5.users,
        posts: data5.posts,
        comments: data5.comments,
        usersColor,
        postsColor,
        commentsColor
    });

    // 6th month
    const firstDay6thPrevMonth = new Date(date.getFullYear(), date.getMonth() - 6, 1);
    const lastDay6thPrevMonth = new Date(date.getFullYear(), date.getMonth() - 5, 0);
    const monthName6 = dateUtility.getMonthName(firstDay6thPrevMonth, true);

    const data6 = await utility.getStats(firstDay6thPrevMonth, lastDay6thPrevMonth);

    results.push({
        month: monthName6,
        users: data6.users,
        posts: data6.posts,
        comments: data6.comments,
        usersColor,
        postsColor,
        commentsColor
    });

    return res.status(200).json({
        success: true,
        currentDate: date.toLocaleDateString(),
        results
    });
});

export default getMonthlyStats;
