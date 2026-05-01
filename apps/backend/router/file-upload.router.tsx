import express, { Router } from "express";
import multer from "multer";

const router: Router = Router();
const upload = multer({ dest: "./public/data/uploads/" });

/** Will define a post endpoint
 * It will receive the file and use multer to store in vps /tmp/uploads folder
 * And will also create a JobID using a UUID
 */
router.post("/", upload.single("uploaded_file"), (req, res) => {
  console.log(req.file, req.body);
});

export { router as fileUploadRouter };
