import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (_req, file, cb) {
        // ${path.parse(file.originalname).name}
        // ${uuidv4()}
        // ${path.extname(file.originalname)}
        const uniqueFilename = `${path.parse(file.originalname).name}_${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    dest: 'uploads/',
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});