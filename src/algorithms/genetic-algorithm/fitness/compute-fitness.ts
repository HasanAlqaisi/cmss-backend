import { Class, Day, Hour, Lecture, Room, User } from "@prisma/client";
import {
  Chromosome,
  FullLecture,
  FullLectures,
  TeacherLectureRoom,
} from "../../../atoms/schedules/types";
import initEmpty3dArray from "../../../utils/init-empty-3d-array";
import checkForElectronicWithAttendance from "./check-for-electronic-with-attendance";
// import checkForLabMultipleRoomsNotInSameTimeSlot from "./check-for-lab-multiple-rooms-not-in-same-time-slot";
import checkForSubjectsSameRoomAndTime from "./check-for-lectures-same-room-and-time";
import checkForTeacherWithSubjectsAtSameTime from "./check-for-teacher-with-lectures-at-same-time";
import logger from "../../../utils/config/logger";
import checkForForbiddenDays from "./check-for-forbidden-days";
import writeChromosomesToFile from "../write-chromosomes-to-file";
import checkForLabMultipleRoomsNotInSameTimeSlot from "./check-for-lab-multiple-rooms-not-in-same-time-slot";
import { lecturesLength } from "../constants";

export default (
  chromosome: Chromosome,
  lectures: FullLectures,
  days: Day[],
  hours: Hour[],
  classes: Class[],
  rooms: Room[],
  teachers: User[]
) => {
  // Counter for number of conflicts of electronic lecture with attendance lecture at the same day
  let vioElectronicWithAttendanceSameDay: number = 0;
  // first dimen is day, second dimen is klass, third dimen is lecture
  const dayAndKlassLectures: boolean[][][] = initEmpty3dArray<boolean>();
  const foundBefore1: number[] = [];

  // Counter for number of conflicts of multiple lectures taking same room same time
  let vioLecturesSameRoomSameTime: number = 0;
  // first dimen is day, second dimen is time, third dimen is room
  const dayAndTimeRooms: number[][][] = initEmpty3dArray<number>();
  const foundBefore2: number[] = [];

  // Counter for number of conflicts of teachers teaches multiple lectures at same time but not same room and not same lecture title
  let vioTeacherWithLecturesSameTime: number = 0;
  // first dimen is day, second dimen is time, third dimen is teacher
  const dayAndTimeTeachers: TeacherLectureRoom[][][] =
    initEmpty3dArray<TeacherLectureRoom>();
  const foundBefore3: number[] = [];

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

  chromosome.genes.forEach((gene) => {
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

    // // Success
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
  });

  const hardConstraints =
    vioElectronicWithAttendanceSameDay +
    vioLabMultipleRoomsNotInSameTimeSlot +
    vioLecturesSameRoomSameTime +
    vioTeacherWithLecturesSameTime +
    vioStageHasLectureInForbiddenDay;

  // const fitness = (1 / (hardConstraints + 1)) ** 2; // Closer to 1 means better solution
  const fitness = 1 / (hardConstraints + 1);

  // eslint-disable-next-line no-param-reassign
  chromosome.fitness = fitness;

  // if (hardConstraints === 0)
  // writeChromosomesToFile(`./best.json`, chromosome.genes);
};
