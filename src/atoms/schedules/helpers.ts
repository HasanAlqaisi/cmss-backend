import { ScheduleType } from "./service";
import { Timetable } from "./types";

// eslint-disable-next-line import/prefer-default-export
export const reshapeTimetable = (result: ScheduleType) => {
  const timetable: Timetable[] = [];

  let currentIndex = -1;

  const stages = new Map<number, string>();
  stages.set(1, "First");
  stages.set(2, "Second");
  stages.set(3, "Third");
  stages.set(4, "Fourth");

  const hours = new Map<string, number>();
  hours.set("8:30", 0);
  hours.set("10:30", 1);
  hours.set("12:30", 2);
  hours.set("2:30", 3);
  hours.set("4:30", 4);

  result.forEach((schedule) => {
    if (
      timetable.find((t, i) => {
        const klassInfo = t.title.split(" - ");
        if (
          klassInfo[0] === stages.get(schedule.class.stage.number) &&
          klassInfo[1] === schedule.class.program.name &&
          klassInfo[2] === schedule.class.branch.name
        ) {
          currentIndex = i;
          return true;
        }
        return false;
      })
    ) {
      timetable[currentIndex].schedules[schedule.day.number][
        hours.get(schedule.hour.start)!
      ].push({
        subject: schedule.lecture.hall.subject.name,
        room: schedule.lecture.hall.room.number,
        teacher: schedule.lecture.teacher.fullName,
      });
    } else {
      const len = timetable.push({
        title: `${stages.get(schedule.class.stage.number)} - ${
          schedule.class.program.name
        } - ${schedule.class.branch.name}`,
        schedules: [
          [[], [], [], [], []],
          [[], [], [], [], []],
          [[], [], [], [], []],
          [[], [], [], [], []],
          [[], [], [], [], []],
          [[], [], [], [], []],
        ],
      });
      timetable[len - 1].schedules[schedule.day.number][
        hours.get(schedule.hour.start)!
      ].push({
        subject: schedule.lecture.hall.subject.name,
        room: schedule.lecture.hall.room.number,
        teacher: schedule.lecture.teacher.fullName,
      });
    }
  });
  return timetable;
};
