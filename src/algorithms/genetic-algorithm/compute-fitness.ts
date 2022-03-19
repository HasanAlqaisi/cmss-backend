import { Class, Day, Hour, Room } from "@prisma/client";
import {
  Chromosome,
  FullLectures,
  Gene,
  TeacherLectureRoom,
} from "../../atoms/schedules/types";
import initEmpty3dArray from "../../utils/init-empty-3d-array";
import checkForElectronicWithAttendance from "./utils/check-for-electronic-with-attendance";
import checkForSubjectsSameRoomAndTime from "./utils/check-for-lectures-same-room-and-time";
import checkForTeacherWithSubjectsAtSameTime from "./utils/check-for-teacher-with-lectures-at-same-time";
import checkForForbiddenDays from "./utils/check-for-forbidden-days";
import checkForLabMultipleRoomsNotInSameTimeSlot from "./utils/check-for-lab-multiple-rooms-not-in-same-time-slot";
import { lecturesLength } from "./utils/constants";
import logger from "../../utils/config/logger";
import checkForSubjectsSameClassSameTime from "./utils/check-for-subjects-same-class-same-time";

export default (
  chromosome: Chromosome,
  lectures: FullLectures,
  days: Day[],
  hours: Hour[],
  classes: Class[],
  rooms: Room[]
  // teachers: User[]
) => {
  // Counter for number of conflicts of electronic lecture with attendance lecture at the same day
  let vioElectronicWithAttendanceSameDay: number = 0;
  // first dimen is day, second dimen is klass, third dimen is lecture
  const dayAndKlassLectures: boolean[][][] = initEmpty3dArray<boolean>();
  const foundBefore1: string[] = [];

  // Counter for number of conflicts of multiple lectures taking same room same time
  let vioLecturesSameRoomSameTime: number = 0;
  // first dimen is day, second dimen is time, third dimen is room
  const dayAndTimeRooms: number[][][] = initEmpty3dArray<number>();
  const foundBefore2: string[] = [];

  // Counter for number of conflicts of teachers teaches multiple lectures at same time but not same room and not same lecture title
  let vioTeacherWithLecturesSameTime: number = 0;
  // first dimen is day, second dimen is time, third dimen is teacher
  const dayAndTimeTeachers: TeacherLectureRoom[][][] =
    initEmpty3dArray<TeacherLectureRoom>();
  const foundBefore3: string[] = [];

  // Counter for number of conflicts of same subject labs but are not in same time slot
  let vioLabMultipleRoomsNotInSameTimeSlot: number = 0;
  // first dimen is day, second dimen is time, third dimen is room
  const dayAndTimeLabRooms: Room[][][] = initEmpty3dArray<Room>();
  const subjectsName: string[] = [];
  const addedRoomsLengthForSubject: number[] = Array.from({
    length: lecturesLength,
  });
  addedRoomsLengthForSubject.fill(0);
  // first Dimen for subject, second dimen for rooms
  const subjectRooms: Room[][] = Array.from({ length: lecturesLength }, () =>
    Array.from({ length: 0 })
  );

  let vioStageHasLectureInForbiddenDay: number = 0;
  const foundBefore4: number[] = [];

  // Counter for number of conflicts of multiple lectures for same class same time
  let vioLecturesSameClassSameTime: number = 0;
  // first dimen is day, second dimen is time, third dimen is room
  const dayAndTimeClasses: number[][][] = initEmpty3dArray<number>();
  const foundBefore5: string[] = [];
  const currentLectures: string[] = [];

  let worstGene: Gene | undefined;
  let isDayConflictForWorst: number = 0;
  // let isDayConflictForSecondWorst: boolean = false;
  // let secondWorstGene: Gene | undefined;
  let worstTracker = 0;
  // let secondWorstTracker = 0;
  let beforeConflicts = 0;

  chromosome.genes.forEach((gene) => {
    let afterConflicts = 0;
    const beforeDayConflictWorst =
      vioElectronicWithAttendanceSameDay + vioStageHasLectureInForbiddenDay;
    const beforeTimeConflictWorst =
      vioLabMultipleRoomsNotInSameTimeSlot +
      vioLecturesSameRoomSameTime +
      vioTeacherWithLecturesSameTime +
      vioLecturesSameClassSameTime;

    beforeConflicts =
      vioElectronicWithAttendanceSameDay +
      vioLabMultipleRoomsNotInSameTimeSlot +
      vioLecturesSameRoomSameTime +
      vioTeacherWithLecturesSameTime +
      vioStageHasLectureInForbiddenDay +
      vioLecturesSameClassSameTime;

    vioElectronicWithAttendanceSameDay += checkForElectronicWithAttendance(
      gene,
      lectures,
      classes,
      days,
      dayAndKlassLectures,
      foundBefore1
    );

    vioLecturesSameRoomSameTime += checkForSubjectsSameRoomAndTime(
      gene,
      days,
      hours,
      rooms,
      dayAndTimeRooms,
      foundBefore2
    );

    vioTeacherWithLecturesSameTime += checkForTeacherWithSubjectsAtSameTime(
      gene,
      days,
      hours,
      lectures,
      dayAndTimeTeachers,
      foundBefore3
    );

    vioLabMultipleRoomsNotInSameTimeSlot +=
      checkForLabMultipleRoomsNotInSameTimeSlot(
        gene,
        days,
        hours,
        rooms,
        lectures,
        subjectsName,
        addedRoomsLengthForSubject,
        subjectRooms,
        dayAndTimeLabRooms
      );

    vioStageHasLectureInForbiddenDay += checkForForbiddenDays(
      gene,
      lectures,
      days,
      foundBefore4
    );

    vioLecturesSameClassSameTime += checkForSubjectsSameClassSameTime(
      gene,
      days,
      hours,
      classes,
      lectures,
      dayAndTimeClasses,
      foundBefore5,
      currentLectures
    );

    afterConflicts =
      vioElectronicWithAttendanceSameDay +
      vioLabMultipleRoomsNotInSameTimeSlot +
      vioLecturesSameRoomSameTime +
      vioTeacherWithLecturesSameTime +
      vioStageHasLectureInForbiddenDay +
      vioLecturesSameClassSameTime;

    const afterDayConflictWorst =
      vioElectronicWithAttendanceSameDay + vioStageHasLectureInForbiddenDay;
    const afterTimeConflictWorst =
      vioLabMultipleRoomsNotInSameTimeSlot +
      vioLecturesSameRoomSameTime +
      vioTeacherWithLecturesSameTime +
      vioLecturesSameClassSameTime;

    // logger.debug(
    //   `afterConflicts:${afterConflicts} - beforeConflicts:${beforeConflicts} >= worstTracker:${worstTracker} ${
    //     afterConflicts - beforeConflicts >= worstTracker
    //   }`
    // );

    if (afterConflicts - beforeConflicts > worstTracker) {
      // secondWorstTracker = worstTracker;
      // secondWorstGene = worstGene;
      worstGene = gene;
      worstTracker = afterConflicts - beforeConflicts;

      if (
        afterDayConflictWorst - beforeDayConflictWorst >
        afterTimeConflictWorst - beforeTimeConflictWorst
      ) {
        isDayConflictForWorst = 1;
      } else if (
        afterDayConflictWorst - beforeDayConflictWorst <
        afterTimeConflictWorst - beforeTimeConflictWorst
      ) {
        isDayConflictForWorst = -1;
      } else {
        isDayConflictForWorst = 0;
      }
    }
  });

  const hardConstraints =
    vioElectronicWithAttendanceSameDay +
    vioLabMultipleRoomsNotInSameTimeSlot +
    vioLecturesSameRoomSameTime +
    vioTeacherWithLecturesSameTime +
    vioStageHasLectureInForbiddenDay +
    vioLecturesSameClassSameTime;

  const fitness = 1 / (hardConstraints + 1);

  // eslint-disable-next-line no-param-reassign
  chromosome.fitness = fitness;

  return {
    fitness,
    worstGene,
    isDayConflictForWorst,
    // secondWorstGene,
    vioElectronicWithAttendanceSameDay,
    vioLabMultipleRoomsNotInSameTimeSlot,
    vioLecturesSameRoomSameTime,
    vioTeacherWithLecturesSameTime,
    vioStageHasLectureInForbiddenDay,
    vioLecturesSameClassSameTime,
  };
};
