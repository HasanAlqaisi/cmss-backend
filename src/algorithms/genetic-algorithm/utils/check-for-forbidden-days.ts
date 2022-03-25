import { Day } from "@prisma/client";
import { FullLectures, Gene } from "../../../atoms/schedules/types";

export default (gene: Gene, lectures: FullLectures, days: Day[]): number => {
  let conflictCount: number = 0;

  const day = days.find((element) => element.id === gene.dayId);
  const lecture = lectures.find((lec) => lec.id === gene.lectureId);
  const { stage } = lecture!.hall.subject.Class;
  const forbiddenDays = stage.forbiddenDays!;

  if (forbiddenDays?.includes(day!.number!)) {
    conflictCount += 1;
  }
  return conflictCount;
};
