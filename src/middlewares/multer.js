import multer from "multer";
import path from "path";

const multerStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const whiteListMediaTypes = [".png", ".jpeg", ".jpg", ".mp4", ".mkv"];

const fileFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (!whiteListMediaTypes.includes(ext)) {
    cb({ message: "Unsupported file format" }, false);
    return;
  }
  cb(null, true);
};

const multerMiddleware = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
});

export default multerMiddleware;
