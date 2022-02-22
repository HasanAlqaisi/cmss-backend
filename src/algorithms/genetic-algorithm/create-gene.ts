import { Day, Hour } from "@prisma/client";
import { daysLength, hoursLength } from "./constants";
import { FullLectures, Gene } from "../../atoms/schedules/types";
import getRandomInt from "../../utils/get-random-int";

export default (
  index: number,
  lectures: FullLectures,
  days: Day[],
  hours: Hour[]
): Gene => {
  const randomDayId = getRandomInt(daysLength) + 1;
  const dayId = days.find((element) => element.id === randomDayId)!.id;

  let hourId: number;
  if (lectures[index].hall.subject.Class.program.name === "Morning") {
    const randomHourId = getRandomInt(hoursLength - 1) + 1;
    hourId = hours.find((hour) => hour.id === randomHourId)!.id;
  } else {
    const randomHourId = getRandomInt(hoursLength, 1) + 1;
    hourId = hours.find((hour) => hour.id === randomHourId)!.id;
  }

  const { roomId } = lectures[index].hall;
  const { teacherId } = lectures[index];
  const lectureId = lectures[index].id;
  const classId = lectures[index].hall.subject.Class.id;

  return new Gene(dayId, hourId, roomId, teacherId, lectureId, classId);
};
