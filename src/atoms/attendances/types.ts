export type InputAttendance = {
  lectureId: number;
  studentId?: number;
  note?: string;
  date?: Date;
  attended?: boolean;
};
