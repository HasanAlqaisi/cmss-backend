import path from "path";
import fs from "fs";

export default (image: string) => {
  const imagePath = path.join(process.env.PWD as string, `src`);

  const oldImageUrl = image.replace(
    process.env.CLIENT_DOMAIN as string,
    imagePath
  );

  fs.unlinkSync(oldImageUrl);
};
