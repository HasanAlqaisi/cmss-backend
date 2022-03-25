import { Chromosome, FullLectures, Gene } from "../../../atoms/schedules/types";

export default (solution: Chromosome, lectures: FullLectures): Chromosome => {
  const subjects: { subjectName: string; gene: Gene }[] = [];

  for (let i = 0; i < solution.genes.length; i++) {
    const gene = solution.genes[i];
    const geneLecture = lectures.find((lec) => lec.id === gene.lectureId);
    const geneSubjectName =
      geneLecture!.hall.subject.name + geneLecture!.hall.subject.Class.id;

    let indexTarget = -1;
    if (
      geneLecture!.hall.subject.isLab &&
      !geneLecture!.hall.subject.isElectronic &&
      subjects.find((subject, index) => {
        if (subject.subjectName === geneSubjectName) {
          indexTarget = index;
          return true;
        }
        return false;
      })
    ) {
      gene.dayId = subjects[indexTarget].gene.dayId;
      gene.hourId = subjects[indexTarget].gene.hourId;
    }

    subjects.push({ subjectName: geneSubjectName, gene });
  }
  return solution;
};
