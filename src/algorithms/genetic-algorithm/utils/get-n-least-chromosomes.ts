import { Chromosome } from "../../../atoms/schedules/types";

export default (previousGeneration: Chromosome[], n: number): Chromosome[] => {
  const leasters: Chromosome[] = [];

  previousGeneration.sort((chrom1, chrom2) => chrom1.fitness - chrom2.fitness);

  for (let index = 0; index < n; index++) {
    leasters.push(previousGeneration[index]);
  }
  return leasters;
};
