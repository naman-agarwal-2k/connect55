// import multer from 'multer';
// import path from 'path';
// import fs from "fs";

// const uploadDir = path.join(__dirname, "../uploads/profile-pictures");

// // Ensure the directory exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// //disk or memory stoarge confirm before production!
// const storage = multer.diskStorage({
// destination: (req,file,cb)=>{
//     cb(null,uploadDir);
// },
// filename:(req,file,cb)=>{
//     cb(null,`${Date.now()}-${file.originalname}`);
// },
// });

// const upload=multer({
//     storage,
//     fileFilter:(req,file,cb)=>{
//         const allowedTypes = /jpeg|jpg|png/;
//         const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         if (isValid) cb(null, true);
//         else cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
//       },
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
// });

// export default upload;

import multer from "multer";
import path from "path";
import fs from "fs";

// Base upload directory
const uploadBaseDir = path.join(__dirname, "../uploads");

// Ensure directories exist
const ensureDirExists = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDirExists(path.join(uploadBaseDir, "profile-pictures"));
ensureDirExists(path.join(uploadBaseDir, "chat-media"));

// Dynamic storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fieldname = file.fieldname; // Expecting "profilePicture" or "media"
        let subDir = "";

        if (fieldname === "profilePicture") {
            subDir = "profile-pictures";
        } else if (fieldname === "media") {
            subDir = "chat-media";
        } else {
            return cb(new Error("Invalid fieldname for file upload"),'');
        }

        const uploadDir = path.join(uploadBaseDir, subDir);
        ensureDirExists(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

// File filter
const fileFilter = (req:any, file:any, cb:any) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) cb(null, true);
    else cb(new Error("Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed."));
};

// Unified upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
});

export default upload;
