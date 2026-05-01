import express, { Response, Request } from "express";
import { fileUploadRouter } from "./router/file-upload.router.js";

const app = express();
app.use(express.json());
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello");
});
app.use("/v1/api/file-upload", fileUploadRouter);

async function startServer() {
  app.listen(5001, () => {
    console.log("Server started on port 5001");
  });
}

startServer();
