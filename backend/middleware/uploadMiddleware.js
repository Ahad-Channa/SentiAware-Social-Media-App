import multer from "multer";

// Keep files in memory for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
