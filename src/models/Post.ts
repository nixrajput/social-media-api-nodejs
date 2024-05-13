import { Schema, Types, model } from "mongoose";
import type { IPostModel } from "src/interfaces/entities/post";
import { EPostStatus } from "../enums";

const PostSchema = new Schema<IPostModel>(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },

    status: {
      type: String,
      enum: EPostStatus,
      default: EPostStatus.active,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/**
 * @name isProfileComplete
 * @description Check if user's profile is complete
 * @returns Promise<boolean>
 */
// PostSchema.methods.isProfileComplete = async function (): Promise<boolean> {
//   if (!this.fullName) return false;

//   if (!this.email) return false;

//   if (!this.username) return false;

//   return true;
// };

// PostSchema.index({ fname: "text", lname: "text", email: "text" });
const Post = model<IPostModel>("Post", PostSchema);

export default Post;
