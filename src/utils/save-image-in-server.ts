import { Request } from "express";
import path from "path";
import fs from "fs";

export default (req: Request) => {
  let imageUrl: string | undefined;

  if (req.file) {
    const fileName = new Date().getTime().toString() + req.file.originalname;

    imageUrl = path.join(
      process.env.CLIENT_DOMAIN as string,
      `public/images/${fileName}`
    );

    const dirPath = path.join(
      process.env.PWD as string,
      `src/public/images/${fileName}`
    );

    fs.writeFileSync(dirPath, req.file.buffer);
  }

  return imageUrl;
};
