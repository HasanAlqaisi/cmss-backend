import prisma from ".";

const main = async () => {
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

  // eslint-disable-next-line no-console
  console.log({
    adminRole,
    timetableRole,
    registrationRole,
    attendanceRole,
    inventoryRole,
  });
};

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
