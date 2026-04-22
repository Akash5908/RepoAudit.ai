import express, { Response, Request } from "express";
import { fileUploadRouter } from "./router/file-upload.router.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello");
});
app.use("/api/v1/file-upload", fileUploadRouter);

async function startServer() {
  app.listen(5001, () => {
    console.log("Server started on port 5001");
  });
}

startServer();
