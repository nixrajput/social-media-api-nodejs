import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../index.js";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    minlength: [3, "First name must be at least 3 characters."],
    required: [true, "Please enter a first name."],
  },

  lname: {
    type: String,
    required: [true, "Please enter a last name."],
  },

  nameChangedAt: Date,

  email: {
    type: String,
    required: [true, "Please enter an email."],
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  emailChangedAt: Date,

  uname: {
    type: String,
    required: [true, "Please enter an username."],
    minlength: [3, "Username must be at least 3 characters."],
    maxlength: [20, "Username must not exceeds 20 characters."],
  },

  usernameChangedAt: Date,

  phone: String,

  countryCode: String,

  phoneVerified: {
    type: Boolean,
    default: false,
  },

  phoneChangedAt: Date,

  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [6, "password must be at least 6 characters."],
    select: false,
  },

  passwordChangedAt: Date,

  avatar: {
    public_id: String,
    url: String,
  },

  gender: String,

  dob: String,

  about: String,

  profession: {
    type: String,
    maxlength: 100,
  },

  location: {
    type: String,
  },

  website: {
    type: String,
  },

  postsCount: {
    type: Number,
    default: 0,
  },

  followersCount: {
    type: Number,
    default: 0,
  },

  followingCount: {
    type: Number,
    default: 0,
  },

  role: {
    type: String,
    enum: ["user", "admin", "superadmin", "moderator"],
    default: "user",
  },

  accountStatus: {
    type: String,
    enum: [
      "active", "inactive", "deactivated",
      "suspended", "blocked", "deleted",
      "banned", "reported", "pending",
      "withheld", "restricted",
    ],
    default: "active",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verifiedCategory: {
    type: String,
    default: null,
  },

  verifiedAt: {
    type: Date,
    default: null,
  },

  verificationRequestedAt: {
    type: Date,
    default: null,
  },

  isValid: {
    type: Boolean,
    default: false,
  },

  isPrivate: {
    type: Boolean,
    default: false,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  deletedAt: {
    type: Date,
    default: null,
  },

  deletionRequest: {
    type: Boolean,
    default: false,
  },

  deletionRequestedAt: {
    type: Date,
    default: null,
  },

  showOnlineStatus: {
    type: Boolean,
    default: true,
  },

  lastSeen: {
    type: Date,
    default: null,
  },

  accountCreatedIp: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    this.updatedAt = Date.now();
    next();
  }

  this.updatedAt = Date.now();
  this.password = await bcrypt.hash(this.password, 16);
});

// Generate JWT Token
userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const decodedData = jwt.decode(token);

  const authToken = await models.AuthToken.create({
    token: token,
    user: this._id,
    expiresAt: decodedData.exp
  });

  return authToken;
};

// Match Password
userSchema.methods.matchPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};


userSchema.index({ uname: "text", fname: "text", lname: "text" });
const User = mongoose.model("User", userSchema);

export default User;
