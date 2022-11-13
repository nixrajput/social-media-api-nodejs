import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  email: {
    type: String,
    required: [true, "Please enter an email."],
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  uname: {
    type: String,
    required: [true, "Please enter an username."],
    minlength: [3, "Username must be at least 3 characters."],
    maxlength: [20, "Username must not exceeds 20 characters."],
  },

  phone: String,

  countryCode: String,

  phoneVerified: {
    type: Boolean,
    default: false,
  },

  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [6, "password must be at least 6 characters."],
    select: false,
  },

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

  verificationStatus: {
    type: String,
    enum: ["verified", "unverified", "pending", "rejected"],
    default: "unverified",
  },

  isVerified: {
    type: Boolean,
    default: false,
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

  preKeyBundle: {
    type: Object,
  },

  deviceId: {
    type: String,
  },

  fcmToken: {
    type: String,
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

  createdAtLocation: {
    ip: String,
    city: String,
    region: String,
    regionName: String,
    country: String,
    countryCode: String,
    continent: String,
    continentCode: String,
    lat: Number,
    lon: Number,
    zip: String,
    timezone: String,
    isp: String,
    org: String,
    as: String,
    asname: String,
    reverse: String,
    mobile: Boolean,
    proxy: Boolean,
    hosting: Boolean,
  },

  token: String,

  expiresAt: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update UpdatedAt
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Encrypt Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 16);
});

// Generate JWT Token
userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const decodedData = jwt.decode(token);
  this.token = token;
  this.expiresAt = decodedData.exp;

  return token;
};

// Match Password
userSchema.methods.matchPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};


userSchema.index({ uname: "text", fname: "text", lname: "text" });
const User = mongoose.model("User", userSchema);

export default User;
