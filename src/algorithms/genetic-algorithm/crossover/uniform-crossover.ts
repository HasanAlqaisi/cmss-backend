import { Chromosome } from "../../../atoms/schedules/types";
import getRandomInt from "../../../utils/get-random-int";

export default (firstParent: Chromosome, secondParent: Chromosome) => {
  const offspring1: Chromosome = new Chromosome([], 0);
  const offspring2: Chromosome = new Chromosome([], 0);

  for (let index = 0; index < firstParent.genes.length; index++) {
    const rand = getRandomInt(2, 0);
    if (rand === 1) {
      offspring1.genes.push(firstParent.genes[index]);
      offspring2.genes.push(secondParent.genes[index]);
    } else {
      offspring1.genes.push(secondParent.genes[index]);
      offspring2.genes.push(firstParent.genes[index]);
    }
  }
  return [offspring1, offspring2];
};
