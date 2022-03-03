import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from ".";
import UserService from "../atoms/users/service";

async function createAdminAccount() {
  await UserService.createAdminAccount(
    "admin",
    "admin",
    "admin",
    "admin@example.com",
    bcrypt.hashSync("password", 10)
  );
}

async function createClasses() {
  const morningProgram = await prisma.program.create({
    data: { name: "Morning" },
  });
  const eveningProgram = await prisma.program.create({
    data: { name: "Evening" },
  });

  const stageOne = await prisma.stage.create({ data: { number: 1 } });
  const stageTwo = await prisma.stage.create({ data: { number: 2 } });
  const stageThree = await prisma.stage.create({ data: { number: 3 } });
  const stageFour = await prisma.stage.create({ data: { number: 4 } });

  const infromationBranch = await prisma.branch.create({
    data: { name: "Information", maxCapacity: 100 },
  });
  const networkBranch = await prisma.branch.create({
    data: { name: "Network", maxCapacity: 100 },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageOne.id } },
      branch: { connect: { id: infromationBranch.id } },
      program: { connect: { id: morningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageOne.id } },
      branch: { connect: { id: networkBranch.id } },
      program: { connect: { id: morningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageTwo.id } },
      branch: { connect: { id: infromationBranch.id } },
      program: { connect: { id: morningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageTwo.id } },
      branch: { connect: { id: networkBranch.id } },
      program: { connect: { id: morningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageThree.id } },
      branch: { connect: { id: infromationBranch.id } },
      program: { connect: { id: morningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageThree.id } },
      branch: { connect: { id: networkBranch.id } },
      program: { connect: { id: morningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageFour.id } },
      branch: { connect: { id: infromationBranch.id } },
      program: { connect: { id: morningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageFour.id } },
      branch: { connect: { id: networkBranch.id } },
      program: { connect: { id: morningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageOne.id } },
      branch: { connect: { id: infromationBranch.id } },
      program: { connect: { id: eveningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageOne.id } },
      branch: { connect: { id: networkBranch.id } },
      program: { connect: { id: eveningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageTwo.id } },
      branch: { connect: { id: infromationBranch.id } },
      program: { connect: { id: eveningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageTwo.id } },
      branch: { connect: { id: networkBranch.id } },
      program: { connect: { id: eveningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageThree.id } },
      branch: { connect: { id: infromationBranch.id } },
      program: { connect: { id: eveningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageThree.id } },
      branch: { connect: { id: networkBranch.id } },
      program: { connect: { id: eveningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageFour.id } },
      branch: { connect: { id: infromationBranch.id } },
      program: { connect: { id: eveningProgram.id } },
    },
  });

  await prisma.class.create({
    data: {
      stage: { connect: { id: stageFour.id } },
      branch: { connect: { id: networkBranch.id } },
      program: { connect: { id: eveningProgram.id } },
    },
  });
}

async function createLecture(
  role: Role,
  fullName: string,
  username: string,
  roomNumber: number,
  classId: number,
  subjectName: string,
  isElectronic: boolean,
  isLab: boolean
) {
  const teacher = await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      role: { connect: { id: role!.id } },
      fullName,
      username,
      email: `${username}${classId}${subjectName}${roomNumber}@example.com`,
      password: "00000000",
    },
  });

  const room = await prisma.room.upsert({
    where: { number: roomNumber },
    update: {},
    create: { number: roomNumber },
  });

  const subject = await prisma.subject.create({
    data: { classId, name: subjectName, isElectronic, isLab },
  });

  await prisma.lecture.create({
    data: {
      teacher: { connect: { id: teacher.id } },
      hall: {
        connectOrCreate: {
          where: {
            roomId_subjectId: { roomId: room.id!, subjectId: subject.id! },
          },
          create: {
            room: { connect: { id: room.id! } },
            subject: { connect: { id: subject.id! } },
          },
        },
      },
    },
  });
}

async function createDaysAndHours() {
  await prisma.day.createMany({
    data: [
      { number: 0 },
      { number: 1 },
      { number: 2 },
      { number: 3 },
      { number: 4 },
      { number: 5 },
    ],
  });

  await prisma.hour.createMany({
    data: [
      { start: "8:30" },
      { start: "10:30" },
      { start: "12:30" },
      { start: "2:30" },
    ],
  });
}

async function createYears() {
  await prisma.year.createMany({
    data: [
      {
        range: "2010/2011",
      },
      {
        range: "2011/2012",
      },
      {
        range: "2012/2013",
      },
      {
        range: "2013/2014",
      },
      {
        range: "2014/2015",
      },
      {
        range: "2015/2016",
      },
      {
        range: "2016/2017",
      },
      {
        range: "2017/2018",
      },
      {
        range: "2018/2019",
      },
      {
        range: "2019/2020",
      },
      {
        range: "2020/2021",
      },
      {
        range: "2021/2022",
      },
    ],
  });
}

async function createSpecialties() {
  await prisma.specialty.createMany({
    data: [
      { name: "First", capacity: 3, isDependent: true },
      { name: "Second", capacity: 3, isDependent: true },
      { name: "Third", capacity: 3, isDependent: true },
      { name: "Forth", capacity: 3, isDependent: true },
    ],
  });
}

const main = async () => {
  // await createLectures(); // TEMP: for testing only - will be deleted later

  const promises = [
    createAdminAccount(),
    createClasses(),
    createDaysAndHours(),
    createYears(),
    createSpecialties(),
  ];

  await Promise.all(promises);
};

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
