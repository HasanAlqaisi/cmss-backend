import { Chromosome } from "../../../atoms/schedules/types";

export default (previousGeneration: Chromosome[]) => {
  let maxFit1 = 0;
  let maxFit2 = 0;

  for (let i = 0; i < previousGeneration.length; i++) {
    if (previousGeneration[i].fitness > previousGeneration[maxFit1].fitness) {
      maxFit2 = maxFit1;
      maxFit1 = i;
    } else if (
      previousGeneration[i].fitness > previousGeneration[maxFit2].fitness
    ) {
      maxFit2 = i;
    }
  }
  return previousGeneration[maxFit2];
};
