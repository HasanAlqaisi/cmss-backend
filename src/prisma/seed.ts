import { Role } from "@prisma/client";
import prisma from ".";

async function createRoles() {
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
    },
  });

  const timetableRole = await prisma.role.create({
    data: {
      name: "timetable_manager",
    },
  });

  const registrationRole = await prisma.role.create({
    data: {
      name: "registration_manager",
    },
  });

  const attendanceRole = await prisma.role.create({
    data: {
      name: "attendance_manager",
    },
  });

  const inventoryRole = await prisma.role.create({
    data: {
      name: "inventory_manager",
    },
  });
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
    data: { name: "Information" },
  });
  const networkBranch = await prisma.branch.create({
    data: { name: "Network" },
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

async function createLectures() {
  const attendnceManagerRole = await prisma.role.findFirst({
    where: { name: "attendance_manager" },
  });

  await createLecture(attendnceManagerRole!, "...", "dotsdots", 1000, 2, "english language", true, false);
  await createLecture(attendnceManagerRole!, "", "baidaa", 1000, 2, "human rights", true, false);
  await createLecture(attendnceManagerRole!, "", "zahraaAbbas", 1000, 2, "programming c++ lab", true, true);
  await createLecture(attendnceManagerRole!, "", "saifGhassan", 1000, 2, "algorithms", true, false);
  await createLecture(attendnceManagerRole!, "", "aliAbdulrazzaq", 1000, 2, "engineering drawing lab", true, true);
  await createLecture(attendnceManagerRole!, "", "sarmadAbdulHassan", 316, 2, "mathematics 1", false, false);
  await createLecture(attendnceManagerRole!, "", "saharAdel", 304, 2, "electronic", false, false);
  await createLecture(attendnceManagerRole!, "", "saddamKamel", 304, 2, "elctrical", false, false);
  await createLecture(attendnceManagerRole!, "", "laithKamel", 3, 2, "logic lab", false, true);
  await createLecture(attendnceManagerRole!, "", "noorAbdul", 2, 2, "logic lab", false, true);
  await createLecture(attendnceManagerRole!, "", "EmanMatleb", 2, 2, "elctrical lab", false, true);
  await createLecture(attendnceManagerRole!, "", "noorKadhim", 3, 2, "elctrical lab", false, true);
  await createLecture(attendnceManagerRole!, "", "randAli", 304, 2, "logic", false, false);

  await createLecture(attendnceManagerRole!, "...", "dotsdots", 1000, 1, "english language", true, false);
  await createLecture(attendnceManagerRole!, "", "baidaa", 1000, 1, "human rights", true, false);
  await createLecture(attendnceManagerRole!, "", "saifGhassan", 1000, 1, "algorithms", true, false);
  await createLecture(attendnceManagerRole!, "", "zahraaAbbas", 1000, 1, "programming c++ lab", true, true);
  await createLecture(attendnceManagerRole!, "", "aliAbdulrazzaq", 1000, 1, "engineering drawing lab", true, true);
  await createLecture(attendnceManagerRole!, "", "saharAdel", 304, 1, "electronic", false, false);
  await createLecture(attendnceManagerRole!, "", "sarmadAbdulHassan", 316, 1, "mathematics 1", false, false);
  await createLecture(attendnceManagerRole!, "", "laithKamel", 3, 1, "logic lab", false, true);
  await createLecture(attendnceManagerRole!, "", "noorAbdul", 2, 1, "logic lab", false, true);
  await createLecture(attendnceManagerRole!, "", "saddamKamel", 304, 1, "elctrical", false, false);
  await createLecture(attendnceManagerRole!, "", "randAli", 304, 1, "logic", false, false);
  await createLecture(attendnceManagerRole!, "", "EmanMatleb", 2, 1, "elctrical lab", false, true);
  await createLecture(attendnceManagerRole!, "", "noorKadhim", 3,1, "elctrical lab", false, true);


  await createLecture(attendnceManagerRole!, "", "zainabMahmood", 1000,4, "object oriented", true, false);
  await createLecture(attendnceManagerRole!, "", "israaAli", 1000,4, "fundementals of os", true, false);
  await createLecture(attendnceManagerRole!, "", "ahmedSabah", 406,4, "digital elctronic 1", false, false);
  await createLecture(attendnceManagerRole!, "", "hasanWaheed", 416,4, "computer arch", false, false);
  await createLecture(attendnceManagerRole!, "", "israaAliAbdul", 1000,4, "os lab", true, true);
  await createLecture(attendnceManagerRole!, "", "ameerMusa", 1000,4, "computer networks", true, false);
  await createLecture(attendnceManagerRole!, "", "mohammedArif", 2,4, "digital elctronic lab", false, true);
  await createLecture(attendnceManagerRole!, "", "ayadIshoo", 3,4, "digital elctronic lab", false, true);
  await createLecture(attendnceManagerRole!, "", "zainabMahmoodFadil", 4,4, "digital structure lab", false, true);
  await createLecture(attendnceManagerRole!, "", "zainabSaeed", 5,4, "digital structure lab", false, true);
  await createLecture(attendnceManagerRole!, "", "dari", 404,4, "communication 1", false, false);
  await createLecture(attendnceManagerRole!, "", "AzharMalik", 416,4, "mathematics 3", false, false);

  await createLecture(attendnceManagerRole!, "", "zainabMahmood", 1000,3, "object oriented", true, false);
  await createLecture(attendnceManagerRole!, "", "riadh", 1000,3, "information theory", true, false);
  await createLecture(attendnceManagerRole!, "", "hasanWaheed", 416,3, "computer arch", false, false);
  await createLecture(attendnceManagerRole!, "", "ahmedSabah", 406,3, "digital elctronic 1", false, false);
  await createLecture(attendnceManagerRole!, "", "israaAliAbdul", 1000,3, "os lab", true, true);
  await createLecture(attendnceManagerRole!, "", "ghaidaa", 1000,3, "os 1", true, false);
  await createLecture(attendnceManagerRole!, "", "zainabMahmoodFadil", 4,3, "digital structure lab", false, true);
  await createLecture(attendnceManagerRole!, "", "zainabSaeed", 5,3, "digital structure lab", false, true);
  await createLecture(attendnceManagerRole!, "", "mohammedArif", 2,3, "digital elctronic lab", false, true);
  await createLecture(attendnceManagerRole!, "", "ayadIshoo", 3,3, "digital elctronic lab", false, true);
  await createLecture(attendnceManagerRole!, "", "azharMalik", 416,3, "mathematics 3", false, false);
  await createLecture(attendnceManagerRole!, "", "dari", 404,3, "communication 1", false, false);

  await createLecture(attendnceManagerRole!, "", "omarJaneh", 1000,6, "computer graphics", true, false);
  await createLecture(attendnceManagerRole!, "", "samanHameed", 1000,6, "advanced computer networks", true, false);
  await createLecture(attendnceManagerRole!, "", "riadh", 316,6, "advanced mathematics 1", false, false);
  await createLecture(attendnceManagerRole!, "", "basim", 404,6, "microprocessor", false, false);
  await createLecture(attendnceManagerRole!, "", "zinaJaafar", 8,6, "microprocessor lab", false, true);
  await createLecture(attendnceManagerRole!, "", "sajaDiaa", 6,6, "microprocessor lab", false, true);
  await createLecture(attendnceManagerRole!, "", "ammarAbdulameer", 7,6, "computer networks lab", false, true);
  await createLecture(attendnceManagerRole!, "", "aliEmad", 9,6, "computer networks lab", false, true); // aswar
  await createLecture(attendnceManagerRole!, "", "ibrahimAdel", 517,6, "signals and systems", false, false);
  await createLecture(attendnceManagerRole!, "", "zahraaAbbas", 518,6, "digital image processing", false, false);
  await createLecture(attendnceManagerRole!, "", "zainabSaeed", 1000,6, "database lab", true, true);
  await createLecture(attendnceManagerRole!, "", "safaaKamel", 1000,6, "database lab", true, true);
  await createLecture(attendnceManagerRole!, "", "bassam", 1000,6, "java programming", true, false);

  await createLecture(attendnceManagerRole!, "", "omarJaneh", 1000,5, "computer graphics", true, false);
  await createLecture(attendnceManagerRole!, "", "ghaidaa", 1000,5, "information systems", true, false);
  await createLecture(attendnceManagerRole!, "", "basim", 404,5, "microprocessor", false, false);
  await createLecture(attendnceManagerRole!, "", "riadh", 316,5, "advanced mathematics 1", false, false);
  await createLecture(attendnceManagerRole!, "", "ammarAbdulameer", 7,5, "computer networks lab", false, true);
  await createLecture(attendnceManagerRole!, "", "aliEmad", 9,5, "computer networks lab", false, true); // aswar
  await createLecture(attendnceManagerRole!, "", "zinaJaafar", 8,5, "microprocessor lab", false, true);
  await createLecture(attendnceManagerRole!, "", "sajaDiaa", 6,5, "microprocessor lab", false, true);
  await createLecture(attendnceManagerRole!, "", "zahraaAbbas", 518,5, "digital image processing", false, false);
  await createLecture(attendnceManagerRole!, "", "ibrahimAdel", 517,5, "signals and systems", false, false);
  await createLecture(attendnceManagerRole!, "", "zainabSaeed", 1000,5, "database lab", true, true);
  await createLecture(attendnceManagerRole!, "", "safaaKamel", 1000,5, "database lab", true, true);
  await createLecture(attendnceManagerRole!, "", "ameerMusa", 1000,5, "computer networks", true, false);

  await createLecture(attendnceManagerRole!, "", "salmaHameed", 1000,8, "queuing theory", true, false);
  await createLecture(attendnceManagerRole!, "", "mohamedNajim", 304,8, "soft computing", false, false);
  await createLecture(attendnceManagerRole!, "", "samanHameed", 518,8, "parallel processing", false, false);
  await createLecture(attendnceManagerRole!, "", "ahmedSaad", 517,8, "internet programming", false, false);
  await createLecture(attendnceManagerRole!, "", "aymanDawood", 518,8, "digital multimedia processing", false, false);
  await createLecture(attendnceManagerRole!, "", "abdulhakeem", 6,8, "web programming lab", false, true);
  await createLecture(attendnceManagerRole!, "", "saraMohammed", 1,8, "web programming lab", false, true);
  await createLecture(attendnceManagerRole!, "", "hudaAhmed", 4,8, "PLC lab", false, true);
  await createLecture(attendnceManagerRole!, "", "amthal", 5,8, "PLC lab", false, true); 
  await createLecture(attendnceManagerRole!, "", "bassam", 1000,8, "network protocol lab", true, true);
  await createLecture(attendnceManagerRole!, "", "ahmedMusa", 1000,8, "network protocol", true, false);

  await createLecture(attendnceManagerRole!, "", "ibrahimAdel", 1000,7, "biometrics", true, false);
  await createLecture(attendnceManagerRole!, "", "samanHameed", 518,7, "parallel processing", false, false);
  await createLecture(attendnceManagerRole!, "", "mohamedNajim", 304,7, "soft computing", false, false);
  await createLecture(attendnceManagerRole!, "", "aymanDawood", 518,7, "digital multimedia processing", false, false);
  await createLecture(attendnceManagerRole!, "", "ahmedSaad", 517,7, "internet programming", false, false);
  await createLecture(attendnceManagerRole!, "", "hudaAhmed", 4,7, "PLC lab", false, true);
  await createLecture(attendnceManagerRole!, "", "amthal", 5,7, "PLC lab", false, true); 
  await createLecture(attendnceManagerRole!, "", "abdulhakeem", 6,7, "web programming lab", false, true);
  await createLecture(attendnceManagerRole!, "", "saraMohammed", 1,7, "web programming lab", false, true);
  await createLecture(attendnceManagerRole!, "", "alza", 1000,7, "digital communication lab", true, true);
  await createLecture(attendnceManagerRole!, "", "salmaHameed", 1000,7, "data mining", true, false);
 // -----------------------------------------------------------------------------------------------------------
 // Evening

 await createLecture(attendnceManagerRole!, "", "rihabKalifa", 1000, 10, "programming c++ lab", true, true);
 await createLecture(attendnceManagerRole!, "", "latifaAbdullah", 1000, 10, "human rights", true, false);
 await createLecture(attendnceManagerRole!, "...", "dotsdots", 1000, 10, "english language", true, false);
 await createLecture(attendnceManagerRole!, "", "saifGhassan", 1000, 10, "algorithms", true, false);
 await createLecture(attendnceManagerRole!, "", "aliAbdulrazzaq", 1000, 10, "engineering drawing lab", true, true);
 await createLecture(attendnceManagerRole!, "", "sarmadAbdulHassan", 316, 10, "mathematics 1", false, false);
 await createLecture(attendnceManagerRole!, "", "saharAdel", 304, 10, "electrical", false, false);
 await createLecture(attendnceManagerRole!, "", "saddamKamel", 304, 10, "elctrical", false, false);
 await createLecture(attendnceManagerRole!, "", "laithKamel", 3, 10, "logic lab", false, true);
 await createLecture(attendnceManagerRole!, "", "saraMohammed", 2, 10, "logic lab", false, true);
 await createLecture(attendnceManagerRole!, "", "sarmadFoad", 2, 10, "elctrical lab", false, true);
 await createLecture(attendnceManagerRole!, "", "banKareem", 3, 10, "elctrical lab", false, true);
 await createLecture(attendnceManagerRole!, "", "randAli", 304, 10, "logic", false, false);

 await createLecture(attendnceManagerRole!, "", "rihabKalifa", 1000, 9, "programming c++ lab", true, true);
 await createLecture(attendnceManagerRole!, "", "latifaAbdullah", 1000, 9, "human rights", true, false);
 await createLecture(attendnceManagerRole!, "...", "dotsdots", 1000, 9, "english language", true, false);
 await createLecture(attendnceManagerRole!, "", "saifGhassan", 1000, 9, "algorithms", true, false);
 await createLecture(attendnceManagerRole!, "", "aliAbdulrazzaq", 1000, 9, "engineering drawing lab", true, true);
 await createLecture(attendnceManagerRole!, "", "saharAdel", 304, 9, "electrical", false, false);
 await createLecture(attendnceManagerRole!, "", "sarmadAbdulHassan", 316, 9, "mathematics 1", false, false);
 await createLecture(attendnceManagerRole!, "", "laithKamel", 3, 9, "logic lab", false, true);
 await createLecture(attendnceManagerRole!, "", "saraMohammed", 2, 9, "logic lab", false, true);
 await createLecture(attendnceManagerRole!, "", "saddamKamel", 304, 9, "elctrical", false, false);
 await createLecture(attendnceManagerRole!, "", "randAli", 304, 9, "logic", false, false);
 await createLecture(attendnceManagerRole!, "", "sarmadFoad", 2, 9, "elctrical lab", false, true);
 await createLecture(attendnceManagerRole!, "", "banKareem", 3, 9, "elctrical lab", false, true);


 await createLecture(attendnceManagerRole!, "", "israaAli", 1000, 12, "fundementals of os", true, false);
 await createLecture(attendnceManagerRole!, "", "zainabMahmood", 1000, 12, "object oriented", true, false);
 await createLecture(attendnceManagerRole!, "", "ahmedSabah", 406,12, "digital elctronic 1", false, false);
 await createLecture(attendnceManagerRole!, "", "hasanWaheed", 416,12, "computer arch", false, false);
 await createLecture(attendnceManagerRole!, "", "ayadIshoo", 1000,12, "os lab", true, true);
 await createLecture(attendnceManagerRole!, "", "ameerMusa", 1000,12, "computer networks", true, false);
 await createLecture(attendnceManagerRole!, "", "banKareem", 2,12, "digital elctronic lab", false, true);
 await createLecture(attendnceManagerRole!, "", "emanMatleb", 3,12, "digital elctronic lab", false, true);
 await createLecture(attendnceManagerRole!, "", "samaSalam", 4,12, "digital structure lab", false, true);
 await createLecture(attendnceManagerRole!, "", "noorKadim", 5,12, "digital structure lab", false, true);
 await createLecture(attendnceManagerRole!, "", "dari", 404,12, "communication 1", false, false);
 await createLecture(attendnceManagerRole!, "", "AzharMalik", 416,12, "mathematics 3", false, false);

 await createLecture(attendnceManagerRole!, "", "riadh", 1000,11, "information theory", true, false);
 await createLecture(attendnceManagerRole!, "", "zainabMahmood", 1000,11, "object oriented", true, false);
 await createLecture(attendnceManagerRole!, "", "hasanWaheed", 416,11, "computer arch", false, false);
 await createLecture(attendnceManagerRole!, "", "ahmedSabah", 406,11, "digital elctronic 1", false, false);
 await createLecture(attendnceManagerRole!, "", "ayadIshoo", 1000,11, "os lab", true, true);
 await createLecture(attendnceManagerRole!, "", "ghaidaa", 1000,11, "os 1", true, false);
 await createLecture(attendnceManagerRole!, "", "samaSalam", 4,11, "digital structure lab", false, true);
 await createLecture(attendnceManagerRole!, "", "noorKadim", 5,11, "digital structure lab", false, true);
 await createLecture(attendnceManagerRole!, "", "banKareem", 2,11, "digital elctronic lab", false, true);
 await createLecture(attendnceManagerRole!, "", "emanMatleb", 3,11, "digital elctronic lab", false, true);
 await createLecture(attendnceManagerRole!, "", "azharMalik", 416,11, "mathematics 3", false, false);
 await createLecture(attendnceManagerRole!, "", "dari", 404,11, "communication 1", false, false);

 await createLecture(attendnceManagerRole!, "", "samanHameed", 1000,14, "advanced computer networks", true, false);
 await createLecture(attendnceManagerRole!, "", "omarJaneh", 1000,14, "computer graphics", true, false);
 await createLecture(attendnceManagerRole!, "", "riadh", 316,14, "advanced mathematics 1", false, false);
 await createLecture(attendnceManagerRole!, "", "basim", 404,14, "microprocessor", false, false);
 await createLecture(attendnceManagerRole!, "", "zinaJaafar", 8,14, "microprocessor lab", false, true);
 await createLecture(attendnceManagerRole!, "", "rihabKalifa", 6,14, "microprocessor lab", false, true);
 await createLecture(attendnceManagerRole!, "", "bassamMohammed", 7,14, "computer networks lab", false, true);
 await createLecture(attendnceManagerRole!, "", "aliEmad", 9,14, "computer networks lab", false, true); // aswar
 await createLecture(attendnceManagerRole!, "", "ibrahimAdel", 517,14, "signals and systems", false, false);
 await createLecture(attendnceManagerRole!, "", "hasanJaleel", 518,14, "digital image processing", false, false);
 await createLecture(attendnceManagerRole!, "", "zainabSaeed", 1000,14, "database lab", true, true);
 await createLecture(attendnceManagerRole!, "", "safaaKamel", 1000,14, "database lab", true, true);
 await createLecture(attendnceManagerRole!, "", "bassam", 1000,14, "java programming", true, false);

 await createLecture(attendnceManagerRole!, "", "ghaidaa", 1000,13, "information systems", true, false);
 await createLecture(attendnceManagerRole!, "", "omarJaneh", 1000,13, "computer graphics", true, false);
 await createLecture(attendnceManagerRole!, "", "basim", 404,13, "microprocessor", false, false);
 await createLecture(attendnceManagerRole!, "", "riadh", 316,13, "advanced mathematics 1", false, false);
 await createLecture(attendnceManagerRole!, "", "bassamMohammed", 7,13, "computer networks lab", false, true);
 await createLecture(attendnceManagerRole!, "", "aliEmad", 9,13, "computer networks lab", false, true); // aswar
 await createLecture(attendnceManagerRole!, "", "zinaJaafar", 8,13, "microprocessor lab", false, true);
 await createLecture(attendnceManagerRole!, "", "rihabKalifa", 6,13, "microprocessor lab", false, true);
 await createLecture(attendnceManagerRole!, "", "hasanJaleel", 518,13, "digital image processing", false, false);
 await createLecture(attendnceManagerRole!, "", "ibrahimAdel", 517,13, "signals and systems", false, false);
 await createLecture(attendnceManagerRole!, "", "zainabSaeed", 1000,13, "database lab", true, true);
 await createLecture(attendnceManagerRole!, "", "safaaKamel", 1000,13, "database lab", true, true);
 await createLecture(attendnceManagerRole!, "", "ameerMusa", 1000,13, "computer networks", true, false);

 await createLecture(attendnceManagerRole!, "", "salmaHameed", 1000,16, "queuing theory", true, false);
 await createLecture(attendnceManagerRole!, "", "ahmedSaad", 517,16, "internet programming", false, false);
 await createLecture(attendnceManagerRole!, "", "aymanDawood", 518,16, "digital multimedia processing", false, false);
 await createLecture(attendnceManagerRole!, "", "mohamedNajim", 304,16, "soft computing", false, false);
 await createLecture(attendnceManagerRole!, "", "samanHameed", 518,16, "parallel processing", false, false);
 await createLecture(attendnceManagerRole!, "", "abdulhakeem", 6,16, "web programming lab", false, true);
 await createLecture(attendnceManagerRole!, "", "saraMohammed", 1,16, "web programming lab", false, true);
 await createLecture(attendnceManagerRole!, "", "omarNawfal", 4,16, "PLC lab", false, true);
 await createLecture(attendnceManagerRole!, "", "hudaAhmed", 5,16, "PLC lab", false, true); 
 await createLecture(attendnceManagerRole!, "", "bassam", 1000,16, "network protocol lab", true, true);
 await createLecture(attendnceManagerRole!, "", "ahmedMusa", 1000,16, "network protocol", true, false);

 await createLecture(attendnceManagerRole!, "", "ibrahimAdel", 1000,15, "biometrics", true, false);
 await createLecture(attendnceManagerRole!, "", "aymanDawood", 518,15, "digital multimedia processing", false, false);
 await createLecture(attendnceManagerRole!, "", "ahmedSaad", 517,15, "internet programming", false, false);
 await createLecture(attendnceManagerRole!, "", "samanHameed", 518,15, "parallel processing", false, false);
 await createLecture(attendnceManagerRole!, "", "mohamedNajim", 304,15, "soft computing", false, false);
 await createLecture(attendnceManagerRole!, "", "omarNawfal", 4,15, "PLC lab", false, true);
 await createLecture(attendnceManagerRole!, "", "hudaAhmed", 5,15, "PLC lab", false, true); 
 await createLecture(attendnceManagerRole!, "", "abdulhakeem", 6,15, "web programming lab", false, true);
 await createLecture(attendnceManagerRole!, "", "saraMohammed", 1,15, "web programming lab", false, true);
 await createLecture(attendnceManagerRole!, "", "alza", 1000,15, "digital communication lab", true, true);
 await createLecture(attendnceManagerRole!, "", "salmaHameed", 1000,15, "data mining", true, false);
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

const main = async () => {
  await createRoles();
  await createClasses();
  // await createLectures(); // TEMP: for testing only - will be deleted later
  await createDaysAndHours();
};

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
