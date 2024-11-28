import multer from 'multer';
import path from 'path';

//disk or memory stoarge confirm before production!
const storage = multer.diskStorage({
destination: (req,file,cb)=>{
    cb(null,'uploads/profile-pictures/');
},
filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`);
},
});

const upload=multer({
    storage,
    fileFilter:(req,file,cb)=>{
        const allowedTypes = /jpeg|jpg|png/;
        const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (isValid) cb(null, true);
        else cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
      },
});

export default upload;