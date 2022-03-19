/* eslint-disable no-param-reassign */
import { Day, Hour } from "@prisma/client";
import {
  FullLectures,
  Gene,
  TeacherLectureRoom,
} from "../../../atoms/schedules/types";

export default (
  gene: Gene,
  days: Day[],
  hours: Hour[],
  lectures: FullLectures,
  dayAndTimeTeachers: TeacherLectureRoom[][][],
  foundBefore: string[]
): number => {
  let conflictCount: number = 0;

  const dayIndex: number = days.findIndex((day) => day.id === gene.dayId);
  const timeIndex = hours.findIndex((hour) => hour.id === gene.hourId);

  const lecture = lectures.find((lec) => lec.id === gene.lectureId);

  const teacherLectureRoom = new TeacherLectureRoom(
    gene.teacherId,
    lecture!.hall.subject.name,
    gene.roomId
  );

  dayAndTimeTeachers[dayIndex][timeIndex].push(teacherLectureRoom);

  // Save rooms for current timeslot to check
  const currentTeachers = dayAndTimeTeachers[dayIndex][timeIndex];

  const lookup = currentTeachers.reduce((a, e) => {
    a[e.teacherId] = ++a[e.teacherId] || 0;
    return a;
  }, {} as any);

  const duplicateTeachers = currentTeachers.filter((e) => lookup[e.teacherId]);
  const duplicateTeachersToString = duplicateTeachers.map((v) =>
    JSON.stringify(v)
  );

  const sameTeacherDifferentSubjectOrRoom = duplicateTeachersToString.filter(
    (a, _, aa) => aa.indexOf(a) === aa.lastIndexOf(a)
  );

  if (
    sameTeacherDifferentSubjectOrRoom.length > 0 &&
    !foundBefore.includes(`${dayIndex}${timeIndex}`)
  ) {
    foundBefore.push(`${dayIndex}${timeIndex}`);
    // logger.debug(
    //   `conflict found! on day ${dayIndex + 1} at time ${
    //     timeIndex + 1
    //   } with teachers ${sameTeacherDifferentSubjectOrRoom}`
    // );
    conflictCount += 1;
  }

  return conflictCount;
};
