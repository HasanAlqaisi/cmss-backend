import { Hall, Lecture, Stage } from "@prisma/client";

export class TeacherLectureRoom {
  teacherId: number;

  lectureTitle: string;

  roomId: number;

  constructor(teacherId: number, lectureTitle: string, roomId: number) {
    this.teacherId = teacherId;
    this.lectureTitle = lectureTitle;
    this.roomId = roomId;
  }
}

export class Gene {
  dayId: number;

  hourId: number;

  roomId: number;

  teacherId: number;

  lectureId: number;

  classId: number;

  constructor(
    dayId: number,
    hourId: number,
    roomId: number,
    teacherId: number,
    lectureId: number,
    classId: number
  ) {
    this.dayId = dayId;
    this.hourId = hourId;
    this.roomId = roomId;
    this.teacherId = teacherId;
    this.lectureId = lectureId;
    this.classId = classId;
  }
}

export class Chromosome {
  genes: Gene[];

  fitness: number;

  constructor(genes: Gene[], fitness: number) {
    this.genes = genes;
    this.fitness = fitness;
  }
}

export type FullLectures = (Lecture & {
  teacher: {
    email: string;
    username: string;
    fullName: string;
  };
  hall: Hall & {
    room: {
      number: number;
      name: string | null;
    };
    subject: {
      name: string;
      Class: {
        id: number;
        branchId: number;
        stageId: number;
        programId: number;
        program: {
          name: string;
        };
        stage: Stage;
      };
      isElectronic: boolean;
      isLab: boolean;
    };
  };
})[];

export type FullLecture = Lecture & {
  teacher: {
    email: string;
    username: string;
    fullName: string;
  };
  hall: Hall & {
    room: {
      number: number;
      name: string | null;
    };
    subject: {
      name: string;
      Class: {
        id: number;
        branchId: number;
        stageId: number;
        programId: number;
        program: {
          name: string;
        };
        stage: Stage;
      };
      isElectronic: boolean;
      isLab: boolean;
    };
  };
};

type Schedule = {
  subject?: string;
  room?: number;
  teacher?: string;
};

export type Timetable = { title: string; schedules: Schedule[][][] };
