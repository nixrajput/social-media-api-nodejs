import type { Document, ObjectId } from "mongoose";

export interface IMedia {
  publicId: string;
  url: string;
}

export interface IPost {
  userId: ObjectId;
  medias?: IMedia[];
  status?: string;
}

export interface IPostModel extends IPost, Document {
  likesCount: number;
  repostCount: number;
  bookmarksCount: number;

  createdAt: Date;
  updatedAt: Date;

  // Methods
  isLiked(): Promise<boolean>;
}
