/* eslint-disable no-plusplus */
import getRandomInt from "../../../utils/get-random-int";
import { Chromosome } from "../../../atoms/schedules/types";
import logger from "../../../utils/config/logger";

// export default (firstParent: Chromosome, secondParent: Chromosome) => {
//   const midPoint: number = getRandomInt(firstParent.genes.length);
//   const newChromosome: Chromosome = new Chromosome([], 0);

//   for (let index = 0; index < midPoint; index++) {
//     newChromosome.genes.push(firstParent.genes[index]);
//   }
//   for (let index = midPoint; index < firstParent.genes.length; index++) {
//     newChromosome.genes.push(secondParent.genes[index]);
//   }

//   return newChromosome;
// };

// export default (firstParent: Chromosome, secondParent: Chromosome) => {
//   const firstPoint: number = getRandomInt(firstParent.genes.length);
//   const secondPoint: number = getRandomInt(
//     firstParent.genes.length,
//     firstPoint + 1
//   );
//   const newChromosome: Chromosome = new Chromosome([], 0);

//   for (let index = 0; index < firstPoint; index++) {
//     newChromosome.genes.push(firstParent.genes[index]);
//   }
//   for (let index = firstPoint; index < secondPoint; index++) {
//     newChromosome.genes.push(secondParent.genes[index]);
//   }
//   for (let index = secondPoint; index < firstParent.genes.length; index++) {
//     newChromosome.genes.push(firstParent.genes[index]);
//   }

//   return newChromosome;
// };

export default (firstParent: Chromosome, secondParent: Chromosome) => {
  const newChromosome: Chromosome = new Chromosome([], 0);

  for (let index = 0; index < firstParent.genes.length; index++) {
    const rand = getRandomInt(2, 0);

    if (rand === 1) {
      newChromosome.genes.push(firstParent.genes[index]);
    } else {
      newChromosome.genes.push(secondParent.genes[index]);
    }
  }
  return newChromosome;
};
