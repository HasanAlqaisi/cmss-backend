import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";

export default (firstParent: Chromosome, secondParent: Chromosome) => {
  const firstPoint: number = getRandomInt(firstParent.genes.length);
  const secondPoint: number = getRandomInt(
    firstParent.genes.length,
    firstPoint + 1
  );

  const offspring1: Chromosome = new Chromosome([], 0);
  const offspring2: Chromosome = new Chromosome([], 0);

  for (let index = 0; index < firstPoint; index++) {
    offspring1.genes.push(firstParent.genes[index]);
    offspring2.genes.push(secondParent.genes[index]);
  }
  for (let index = firstPoint; index < secondPoint; index++) {
    offspring1.genes.push(secondParent.genes[index]);
    offspring2.genes.push(firstParent.genes[index]);
  }
  for (let index = secondPoint; index < firstParent.genes.length; index++) {
    offspring1.genes.push(firstParent.genes[index]);
    offspring2.genes.push(secondParent.genes[index]);
  }

  return [offspring1, offspring2];
};
