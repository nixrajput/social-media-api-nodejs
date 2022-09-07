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

const startsWithNumber = (str) => {
  return Numeric.includes(str[0]);
};

// Validate username
validators.validateUsername = (username) => {
  if (username.length < 3 || username.length > 15) return false;

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

export default validators;
