import mongoose from "mongoose";

const validators = {};

const Numeric = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const AlphaNumeric = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "_",
];

const FilteredWordsForUsername = [
  "administrator",
  "mod",
  "mods",

  "support",
  "supporter",
  "supporters",
  "supporting",
  "supports",
  "supported",

  "help",
  "helper",
  "helpers",
  "helping",
  "helps",
  "helped",

  "staff",
  "staffs",
  "staffing",
  "staffed",
  "staffs",

  "owner",
  "owners",
  "owning",
  "owned",

  "admin",
  "admins",
  "admining",
  "admined",

  "moderator",
  "moderators",
  "moderating",
  "moderated",
  "moderates",

  "developer",
  "developers",
  "developing",
  "developed",
  "develops",

  "creator",
  "creators",
  "creating",
  "created",
  "creates",

  "user",
  "users",
  "using",
  "used",
  "uses",

  "member",
  "members",
  "membering",
  "membered",
  "members",

  "follower",
  "followers",
  "following",
  "followed",
  "follows",

  "subscriber",
  "subscribers",
  "subscribing",
  "subscribed",
  "subscribes",

  "viewer",
  "viewers",
  "viewing",
  "viewed",
  "views",

  "player",
  "players",
  "playing",
  "played",
  "plays",

  "guest",
  "guests",
  "guesting",
  "guested",
  "guests",

  "visitor",
  "visitors",
  "visiting",
  "visited",
  "visits",

  "friend",
  "friends",
  "friending",
  "friended",
  "friends",

  "god",
  "gods",
  "godding",

  "ceo",
  "ceos",
  "ceoing",
  "ceoed",

  "manager",
  "managers",
  "managing",
  "managed",

  "leader",
  "leaders",
  "leading",
  "led",
  "leads",

  "test",
  "tests",
  "testing",
  "tested",
  "tester",
  "testers",

  "null",
  "undefined",
  "NaN",
  "false",
  "true",

  "root",
  "roots",
  "rooting",
  "rooted",

  "temp",
  "temps",
];

const startsWithNumber = (str) => {
  return Numeric.includes(str[0]);
};

// Validate username
validators.validateUsername = (username) => {
  if (username.length < 3 || username.length > 15) return false;

  if (FilteredWordsForUsername.includes(username)) return false;

  if (username.includes(" ")) return false;

  // not allowed to start/end with underscore
  if (username.startsWith("_")) return false;

  if (startsWithNumber(username)) return false;

  // max one underscore
  var underscores = 0;
  for (var c of username) {
    if (c == "_") underscores++;
    if (!AlphaNumeric.includes(c)) return false;
  }

  if (underscores > 1) return false;

  // if none of these returned false, it's probably ok
  return true;
};

const emailRegExp =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

validators.validateEmail = (email) => {
  return emailRegExp.test(email);
};

const PhoneNumberValidator = ["+", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

validators.validatePhone = (phone) => {
  if (phone.length < 10 || phone.length > 15) return false;

  for (var c of phone) {
    if (!PhoneNumberValidator.includes(c)) return false;
  }

  return true;
};

validators.isValidObjectId = (uid) => {
  return mongoose.Types.ObjectId.isValid(uid);
};

validators.validatePassword = (password) => {
  if (password.length < 8 || password.length > 32) return false;

  return true;
};

const nameRegExp = /^[a-zA-Z0-9 ]{3,32}$/;

validators.validateName = (name) => {
  if (name.length < 3 || name.length > 32) return false;

  if (name.startsWith(" ")) return false;

  if (startsWithNumber(name)) return false;

  return nameRegExp.test(name);
};

validators.validateAbout = (about) => {
  if (about.length > 110) return false;

  return true;
};

validators.validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export default validators;
