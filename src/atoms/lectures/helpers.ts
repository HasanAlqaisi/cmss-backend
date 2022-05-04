import mapStageNumberToString from "../../utils/map-stage-number-to-string";
import { LecturesForTeacher } from "./service";
import { TeacherLectures } from "./types";

// eslint-disable-next-line import/prefer-default-export
export const reshapeLecturesForTeacher = (
  lectures: LecturesForTeacher
): TeacherLectures[] => {
  const result: TeacherLectures[] = [];

  lectures.forEach((lecture) => {
    const klass = lecture.hall.subject.Class;
    const stage = mapStageNumberToString(klass.stage.number);
    const branch = klass.branch.name;
    const program = klass.program.name;
    const subject = lecture.hall.subject.name;

    result.push({
      name: `${stage} - ${branch} - ${program} - ${subject}`,
      classId: klass.id,
      lectureId: lecture.id,
    });
  });

  return result;
};
