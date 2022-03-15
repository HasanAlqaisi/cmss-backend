/* eslint-disable no-restricted-syntax */
import { Day, Hour, Room } from "@prisma/client";
import { FullLectures, Gene } from "../../../atoms/schedules/types";

export default (
  gene: Gene,
  days: Day[],
  hours: Hour[],
  rooms: Room[],
  lectures: FullLectures,
  subjectsName: string[],
  addedRoomsLengthForSubject: number[],
  subjectRooms: Room[][],
  dayAndTimeLabRooms: Room[][][]
): number => {
  let conflictCount = 0;

  const dayIndex = days.findIndex((day) => day.id === gene.dayId);
  const timeIndex = hours.findIndex((hour) => hour.id === gene.hourId);

  const geneRoom = rooms.find((room) => room.id === gene.roomId);
  const geneLecture = lectures.find((lec) => lec.id === gene.lectureId);
  const geneSubjectName =
    geneLecture!.hall.subject.name + geneLecture!.hall.subject.Class.id;

  if (
    geneLecture!.hall.subject.isLab &&
    !geneLecture!.hall.subject.isElectronic
  ) {
    if (!subjectsName.includes(geneSubjectName)) {
      subjectsName.push(geneSubjectName);
    }

    const currentSubjectIndex = subjectsName.findIndex(
      (subjectName) => subjectName === geneSubjectName
    );

    // We will add all rooms of each lecture
    if (!subjectRooms[currentSubjectIndex].includes(geneRoom!)) {
      subjectRooms[currentSubjectIndex].push(geneRoom!);
      // eslint-disable-next-line no-param-reassign
      addedRoomsLengthForSubject[currentSubjectIndex] += 1;
    }

    dayAndTimeLabRooms[dayIndex][timeIndex].push(geneRoom!);

    if (
      addedRoomsLengthForSubject[currentSubjectIndex] ===
      subjectRooms[currentSubjectIndex].length
    ) {
      for (const labRoom of subjectRooms[currentSubjectIndex]) {
        if (!dayAndTimeLabRooms[dayIndex][timeIndex].includes(labRoom)) {
          // logger.debug(
          //   `conflict found! room ${labRoom.number} of lecture ${subjectsName[currentSubjectIndex]} is not on day ${dayIndex} at time ${timeIndex}`
          // );
          conflictCount += 1;
        }
      }
    }
  }
  return conflictCount;
};
