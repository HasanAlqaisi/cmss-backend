import mapStageNumberToString from "../../utils/map-stage-number-to-string";
import { ScheduleType } from "./service";
import { Timetable } from "./types";

// eslint-disable-next-line import/prefer-default-export
export const reshapeTimetable = (result: ScheduleType) => {
  const timetable: Timetable[] = [];

  let currentIndex = -1;

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
          klassInfo[0] ===
            mapStageNumberToString(schedule.class.stage.number) &&
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
        teacher: schedule.lecture.teacher.username,
      });
    } else {
      const len = timetable.push({
        title: `${mapStageNumberToString(schedule.class.stage.number)} - ${
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

export const reshapeTimetableForCsv = (timetables: Timetable[]) => {
  const hours = new Map<number, string>();
  hours.set(0, "8:30");
  hours.set(1, "10:30");
  hours.set(2, "12:30");
  hours.set(3, "2:30");
  hours.set(4, "4:30");

  const days = new Map<number, string>();
  days.set(0, "Saturday");
  days.set(1, "Sunday");
  days.set(2, "Monday");
  days.set(3, "Tuesday");
  days.set(4, "Wednesday");
  days.set(5, "Thursday");

  return timetables.map((timetable) => ({
    title: timetable.title,
    schedule: timetable.schedules.map((day, index1) => ({
      days: days.get(index1),
      hours: day.map((time, index2) => {
        const hour = hours.get(index2)!;
        const subjects = time.map(
          (subject) =>
            `${subject.subject} - ${subject.room} - ${subject.teacher}`
        );
        return {
          [hour]: subjects.join("\n"),
        };
      }),
    })),
  }));
};
// Day, time, subject
/*
[
   {
      "Days": "Sat",
      "hours": [
         {
            "8:30": "skop | SAMI | 304"
         },
         {
            "10:30": "skop2"
         },
         {
            "12:30": "skop3"
         },
         {
            "2:30": "sko4"
         }
      ]
   },
]
*/
