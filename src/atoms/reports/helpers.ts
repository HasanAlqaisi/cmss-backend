import { ReportAndLecture, FullReport } from "./types";

// eslint-disable-next-line import/prefer-default-export
export const getEachStudentWithLecturesAbsences = (
  reports: ReportAndLecture[]
) => {
  const results: FullReport[] = [];

  reports.forEach((announcement) => {
    if (!results.find((result) => result.id === announcement.student.id)) {
      results.push({
        id: announcement.student.id,
        name: announcement.student.name,
        email: announcement.student.email!,
        lectures: [
          {
            id: announcement.lecture.id,
            name: announcement.lecture.hall.subject.name,
            absence: 0,
          },
        ],
      });
    }

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.id === announcement.student.id) {
        const lecture = result.lectures.find((lec, index) => {
          if (lec.id === announcement.lecture.id) {
            results[i].lectures[index].absence += 1;
            return true;
          }
          return false;
        });
        if (!lecture) {
          results[i].lectures.push({
            id: announcement.lecture.id,
            name: announcement.lecture.hall.subject.name,
            absence: 1,
          });
        }
      }
    }
  });

  return results;
};
