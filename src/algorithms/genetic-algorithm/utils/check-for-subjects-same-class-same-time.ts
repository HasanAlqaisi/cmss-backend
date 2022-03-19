import { Class, Day, Hour, Room } from "@prisma/client";
import { FullLectures, Gene } from "../../../atoms/schedules/types";
import logger from "../../../utils/config/logger";

export default (
  gene: Gene,
  days: Day[],
  hours: Hour[],
  classes: Class[],
  lectures: FullLectures,
  dayAndTimeClasses: number[][][],
  foundBefore: string[],
  currentLectures: string[]
): number => {
  let conflictCount: number = 0;

  const dayIndex: number = days.findIndex((day) => day.id === gene.dayId);
  const timeIndex: number = hours.findIndex((hour) => hour.id === gene.hourId);

  const classIndex = classes.findIndex((klass) => klass.id === gene.classId);

  const lecture = lectures.find((lec) => lec.id === gene.lectureId);

  const geneSubjectName =
    lecture!.hall.subject.name + lecture!.hall.subject.Class.id;

  // lectures which should be in same timeslot is not being pushed
  if (!currentLectures.includes(geneSubjectName)) {
    dayAndTimeClasses[dayIndex][timeIndex].push(classIndex);
  }

  currentLectures.push(geneSubjectName);

  // Save classes for current timeslot to check
  const currentClasses = dayAndTimeClasses[dayIndex][timeIndex];
  // Make a set of classes to check for duplication with the original array
  const classesSet = new Set(currentClasses);

  if (
    classesSet.size !== currentClasses.length &&
    !foundBefore.includes(`${dayIndex}${timeIndex}`)
  ) {
    foundBefore.push(`${dayIndex}${timeIndex}`);
    // logger.debug(
    //   `conflict found! on day ${dayIndex + 1} at time ${
    //     timeIndex + 1
    //   } with rooms ${roomsCurrentTimeSlot}`
    // );
    conflictCount += 1;
  }

  return conflictCount;
};
