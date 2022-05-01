import { Request } from "express";
import path from "path";
import fs from "fs";
import logger from "./config/logger";

export default (req: Request) => {
  let imageUrl: string | undefined;

  if (req.file) {
    const fileName = new Date().getTime().toString() + req.file.originalname;

    imageUrl = path.join(
      process.env.CLIENT_ORIGIN as string,
      `public/images/${fileName}`
    );

    const dirPath = path.join(process.cwd(), `src/public/images/${fileName}`);

    fs.writeFileSync(dirPath, req.file.buffer);
  }

  return imageUrl;
};
