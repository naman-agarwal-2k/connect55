// import path from "path";
// import fs from "fs";
// import { sendError } from "../utils/universalFunctions";

// export const downloadMedia = async (req: Request, res: Response) => {
//     const { filePath } = req.params;

//     try {
//         const fullPath = path.join(__dirname, "../uploads/chat-media", filePath);

//         if (!fs.existsSync(fullPath)) {
//             return sendError(Error("File not found"), res, {});
//         }

//         res.download(fullPath); // Serve the file for download
//     } catch (err) {
//         sendError(err, res, {});
//     }
// };
