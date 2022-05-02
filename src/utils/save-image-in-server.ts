import { Request } from "express";
import path from "path";
import fs from "fs";

export default (req: Request) => {
  let imageUrl: string | undefined;

  if (req.file) {
    const fileName = new Date().getTime().toString() + req.file.originalname;

    const fullUrl = `${req.protocol}://${req.get("host")}`;
    imageUrl = path.join(fullUrl, `public/images/${fileName}`);

    const dirPath = path.join(process.cwd(), `src/public/images/${fileName}`);

    fs.writeFileSync(dirPath, req.file.buffer);
  }

  return imageUrl;
};
