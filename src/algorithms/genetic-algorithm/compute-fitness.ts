import { Class, Day, Hour, Room } from "@prisma/client";
import {
  Chromosome,
  FullLectures,
  TeacherLectureRoom,
} from "../../atoms/schedules/types";
import initEmpty3dArray from "../../utils/init-empty-3d-array";
import checkForElectronicWithAttendance from "./utils/check-for-electronic-with-attendance";
import checkForSubjectsSameRoomAndTime from "./utils/check-for-lectures-same-room-and-time";
import checkForTeacherWithSubjectsAtSameTime from "./utils/check-for-teacher-with-lectures-at-same-time";
import checkForForbiddenDays from "./utils/check-for-forbidden-days";
import checkForSubjectsSameClassSameTime from "./utils/check-for-subjects-same-class-same-time";

export default (
  chromosome: Chromosome,
  lectures: FullLectures,
  days: Day[],
  hours: Hour[],
  classes: Class[],
  rooms: Room[]
) => {
  // Counter for number of conflicts of electronic lecture with attendance lecture at the same day
  let vioElectronicWithAttendanceSameDay: number = 0;
  // first dimen is day, second dimen is klass, third dimen is lecture
  const dayAndKlassLectures: boolean[][][] = initEmpty3dArray<boolean>();

  // Counter for number of conflicts of multiple lectures taking same room same time
  let vioLecturesSameRoomSameTime: number = 0;
  // first dimen is day, second dimen is time, third dimen is room
  const dayAndTimeRooms: number[][][] = initEmpty3dArray<number>();

  // Counter for number of conflicts of teachers teaches multiple lectures at same time but not same room and not same lecture title
  let vioTeacherWithLecturesSameTime: number = 0;
  // first dimen is day, second dimen is time, third dimen is teacher
  const dayAndTimeTeachers: TeacherLectureRoom[][][] =
    initEmpty3dArray<TeacherLectureRoom>();

  let vioStageHasLectureInForbiddenDay: number = 0;

  // Counter for number of conflicts of multiple lectures for same class same time
  let vioLecturesSameClassSameTime: number = 0;
  // first dimen is day, second dimen is time, third dimen is room
  const dayAndTimeClasses: number[][][] = initEmpty3dArray<number>();
  const currentLectures: string[] = [];

  chromosome.genes.forEach((gene) => {
    vioElectronicWithAttendanceSameDay += checkForElectronicWithAttendance(
      gene,
      lectures,
      classes,
      days,
      dayAndKlassLectures
    );

    vioLecturesSameRoomSameTime += checkForSubjectsSameRoomAndTime(
      gene,
      days,
      hours,
      rooms,
      dayAndTimeRooms
    );

    vioTeacherWithLecturesSameTime += checkForTeacherWithSubjectsAtSameTime(
      gene,
      days,
      hours,
      lectures,
      dayAndTimeTeachers
    );

    vioStageHasLectureInForbiddenDay += checkForForbiddenDays(
      gene,
      lectures,
      days
    );

    vioLecturesSameClassSameTime += checkForSubjectsSameClassSameTime(
      gene,
      days,
      hours,
      classes,
      lectures,
      dayAndTimeClasses,
      currentLectures
    );
  });

  const hardConstraints =
    vioElectronicWithAttendanceSameDay +
    vioLecturesSameRoomSameTime +
    vioTeacherWithLecturesSameTime +
    vioStageHasLectureInForbiddenDay +
    vioLecturesSameClassSameTime;

  const fitness = 1 / (hardConstraints + 1);

  // eslint-disable-next-line no-param-reassign
  chromosome.fitness = fitness;

  return fitness;
};
