import { Class, Day, Lecture } from "@prisma/client";
import logger from "../../../utils/config/logger";
import {
  FullLecture,
  FullLectures,
  Gene,
} from "../../../atoms/schedules/types";

export default (
  gene: Gene,
  lectures: FullLectures,
  days: Day[],
  foundBefore: number[]
): number => {
  let conflictCount: number = 0;

  const day = days.find((element) => element.id === gene.dayId);
  const lecture = lectures.find((lec) => lec.id === gene.lectureId);
  const { stage } = lecture!.hall.subject.Class;
  const forbiddenDays = stage.forbiddenDays!;

  if (
    forbiddenDays?.includes(day!.number!) &&
    !foundBefore.includes(stage.id)
  ) {
    foundBefore.push(stage.id);
    logger.debug(
      `conflict found! day number ${day!.number} is a forbidden day for stage ${
        stage.number
      }`
    );
    conflictCount += 1;
  }
  return conflictCount;
};
