import multer from "multer"
const mimetypes = ["image/jpeg", "image/png", "image/pdf"];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split(".");
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
        cb(null, file, uniqueName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (mimetypes.includes(file.mimetype)) {
            return cb(null, false);
        }
        cb(null, true);
    }
});
export default upload