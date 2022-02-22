import fs from "fs";
import { Chromosome } from "../../atoms/schedules/types";

export default (filename: string, chromosomes: any) => {
  // Write chromosome to a json file
  fs.writeFileSync(filename, JSON.stringify(chromosomes));
};
