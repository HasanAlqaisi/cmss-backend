import { Class, Day } from "@prisma/client";
import { FullLectures, Gene } from "../../../atoms/schedules/types";

export default (
  gene: Gene,
  lectures: FullLectures,
  classes: Class[],
  days: Day[],
  dayAndKlassLectures: boolean[][][],
  foundBefore: number[]
): number => {
  let conflictCount: number = 0;

  const dayIndex: number = days.findIndex((day) => day.id === gene.dayId);
  const klassIndex: number = classes.findIndex(
    (klass) => klass.id === gene.classId
  );

  const lecture = lectures.find((lec) => lec.id === gene.lectureId);

  dayAndKlassLectures[dayIndex][klassIndex].push(
    lecture!.hall.subject.isElectronic
  );

  const isFirstSubjectElectronic = dayAndKlassLectures[dayIndex][klassIndex][0];

  const lectureArray: boolean[] = dayAndKlassLectures[dayIndex][klassIndex];

  // eslint-disable-next-line no-restricted-syntax
  for (const isElectronic of lectureArray) {
    if (
      isElectronic !== isFirstSubjectElectronic &&
      !foundBefore.includes(dayIndex + klassIndex)
    ) {
      foundBefore.push(dayIndex + klassIndex);
      // const str: string = lec.hall.subject.isElectronic
      //   ? "electronic"
      //   : "not electronic";
      // logger.debug(
      //   `conflict found! on day ${dayIndex}, class id ${
      //     lec.hall.subject.Class.id
      //   } because of a subject ${lec.hall.subject.name} is ${str}`
      // );
      conflictCount += 1;
      break;
    }
  }
  return conflictCount;
};
