import logger from "../../../utils/config/logger";
import { Chromosome } from "../../../atoms/schedules/types";

export default (previousGeneration: Chromosome[], n: number): Chromosome[] => {
  const fittesters: Chromosome[] = [];

  previousGeneration.sort((chrom1, chrom2) => chrom2.fitness - chrom1.fitness);

  for (let index = 0; index < n; index++) {
    fittesters.push(previousGeneration[index]);
  }
  return fittesters;
};
