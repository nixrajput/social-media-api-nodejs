import mongoose from "mongoose";

const onlineUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

});

const OnlineUser = mongoose.model("OnlineUser", onlineUserSchema);

export default OnlineUser;
