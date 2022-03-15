import getRandomInt from "../../../utils/get-random-int";
import { Chromosome } from "../../../atoms/schedules/types";

export default (firstParent: Chromosome, secondParent: Chromosome) => {
  const midPoint: number = getRandomInt(firstParent.genes.length);
  const offspring1: Chromosome = new Chromosome([], 0);
  const offspring2: Chromosome = new Chromosome([], 0);

  for (let index = 0; index < midPoint; index++) {
    offspring1.genes.push(firstParent.genes[index]);
    offspring2.genes.push(secondParent.genes[index]);
  }
  for (let index = midPoint; index < firstParent.genes.length; index++) {
    offspring1.genes.push(secondParent.genes[index]);
    offspring2.genes.push(firstParent.genes[index]);
  }

  return [offspring1, offspring2];
};
