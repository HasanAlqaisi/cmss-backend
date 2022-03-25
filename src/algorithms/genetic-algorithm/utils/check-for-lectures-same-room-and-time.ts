import { Day, Hour, Room } from "@prisma/client";
import { electronicRoomNumber } from "./constants";
import { Gene } from "../../../atoms/schedules/types";

export default (
  gene: Gene,
  days: Day[],
  hours: Hour[],
  rooms: Room[],
  dayAndTimeRooms: number[][][]
): number => {
  let conflictCount: number = 0;
  const dayIndex: number = days.findIndex((day) => day.id === gene.dayId);
  const timeIndex: number = hours.findIndex((hour) => hour.id === gene.hourId);

  const room = rooms.find((element) => element.id === gene.roomId);

  // current room will be added if it is not the electronic room
  if (room!.number !== electronicRoomNumber) {
    dayAndTimeRooms[dayIndex][timeIndex].push(room!.id);
  }

  // Save rooms for current timeslot to check
  const roomsCurrentTimeSlot = dayAndTimeRooms[dayIndex][timeIndex];
  // Make a set of rooms to check for duplication with the original array
  const roomsSet = new Set(roomsCurrentTimeSlot);

  if (roomsSet.size !== roomsCurrentTimeSlot.length) {
    conflictCount += 1;
  }

  return conflictCount;
};
