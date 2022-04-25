import LectureService from "../lectures/service";
import { UserWithPermissions } from "../users/types";

// eslint-disable-next-line import/prefer-default-export
export const canTeacherManageAttendance = async (
  req: any,
  lectureId: number
) => {
  const teacherRequester = req.user as UserWithPermissions;

  const lecture = await LectureService.getLectureById(lectureId);

  return lecture && teacherRequester.id === lecture.teacherId;
};
