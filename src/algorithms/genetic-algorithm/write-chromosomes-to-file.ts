import fs from "fs";

export default (filename: string, chromosomes: any) => {
  fs.writeFileSync(filename, JSON.stringify(chromosomes));
};
