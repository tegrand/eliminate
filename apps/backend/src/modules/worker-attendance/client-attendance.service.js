import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

const getClientId = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) throw new AppError("Client profile not found", 404);
  return client.id;
};

/**
 * Get all workers assigned to this client's job requirements,
 * with their attendance records for a given date or month.
 */
export const getClientAttendance = async (userId, query) => {
  const clientId = await getClientId(userId);
  const { date, month, year, view = "daily" } = query;

  const now = new Date();
  const targetYear = year ? Number(year) : now.getFullYear();
  const targetMonth = month ? Number(month) - 1 : now.getMonth();
  const targetDate = date ? new Date(date) : new Date();

  // Find all accepted applications for this client's job requirements
  const applications = await prisma.jobApplication.findMany({
    where: {
      status: { in: ["ACCEPTED", "REPLACEMENT_REQUESTED", "REMOVAL_REQUESTED"] },
      jobRequirement: {
        clientId,
        deletedAt: null,
      },
    },
    include: {
      worker: {
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      },
      jobRequirement: {
        select: { title: true, requirementCode: true, shift: true, startTime: true },
      },
    },
  });

  if (applications.length === 0) {
    return { workers: [], summary: { present: 0, absent: 0, late: 0, earlyOut: 0, missing: 0 } };
  }

  const workerIds = [...new Set(applications.map((a) => a.workerId))];

  let dateFilter;
  if (view === "daily") {
    dateFilter = {
      gte: startOfDay(targetDate),
      lte: endOfDay(targetDate),
    };
  } else {
    dateFilter = {
      gte: startOfMonth(new Date(targetYear, targetMonth, 1)),
      lte: endOfMonth(new Date(targetYear, targetMonth, 1)),
    };
  }

  const attendanceRecords = await prisma.workerAttendance.findMany({
    where: {
      workerId: { in: workerIds },
      date: dateFilter,
    },
    orderBy: { date: "desc" },
  });

  // Map attendance by workerId
  const attendanceByWorker = {};
  attendanceRecords.forEach((r) => {
    if (!attendanceByWorker[r.workerId]) attendanceByWorker[r.workerId] = [];
    attendanceByWorker[r.workerId].push(r);
  });

  // Build worker list with attendance info
  const workerMap = {};
  applications.forEach((app) => {
    if (!workerMap[app.workerId]) {
      workerMap[app.workerId] = {
        workerId: app.workerId,
        workerCode: app.worker.workerCode,
        name: `${app.worker.user.firstName || ""} ${app.worker.user.lastName || ""}`.trim(),
        phone: app.worker.phone,
        jobRequirement: app.jobRequirement.title,
        requirementCode: app.jobRequirement.requirementCode,
        shift: app.jobRequirement.shift,
        shiftStartTime: app.jobRequirement.startTime,
        attendance: attendanceByWorker[app.workerId] || [],
      };
    }
  });

  const workers = Object.values(workerMap);

  // Compute summary for daily view
  const summary = { present: 0, absent: 0, late: 0, earlyOut: 0, missing: 0 };
  if (view === "daily") {
    workers.forEach((w) => {
      const todayRecord = w.attendance[0]; // date desc, so first is latest
      if (!todayRecord) {
        summary.missing++;
      } else if (todayRecord.status === "PRESENT") {
        summary.present++;
        // Late check-in: check-in after shift start (assume 09:00 default)
        if (todayRecord.checkInTime && w.shiftStartTime) {
          const shiftHour = parseInt(w.shiftStartTime.split(":")[0]);
          const shiftMin = parseInt(w.shiftStartTime.split(":")[1] || "0");
          const checkInDate = new Date(todayRecord.checkInTime);
          if (
            checkInDate.getHours() > shiftHour ||
            (checkInDate.getHours() === shiftHour && checkInDate.getMinutes() > shiftMin + 15)
          ) {
            summary.late++;
          }
        }
        // Early check-out: total hours < 7
        if (todayRecord.totalHours && todayRecord.totalHours < 7) {
          summary.earlyOut++;
        }
      } else {
        summary.absent++;
      }
    });
  }

  return { workers, summary };
};

/**
 * Get monthly attendance report for all workers of this client.
 */
export const getClientAttendanceReport = async (userId, query) => {
  const clientId = await getClientId(userId);
  const { month, year } = query;

  const now = new Date();
  const targetYear = year ? Number(year) : now.getFullYear();
  const targetMonth = month ? Number(month) - 1 : now.getMonth();

  const startDate = startOfMonth(new Date(targetYear, targetMonth, 1));
  const endDate = endOfMonth(new Date(targetYear, targetMonth, 1));

  const applications = await prisma.jobApplication.findMany({
    where: {
      status: { in: ["ACCEPTED", "REPLACEMENT_REQUESTED", "REMOVAL_REQUESTED"] },
      jobRequirement: { clientId, deletedAt: null },
    },
    include: {
      worker: {
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  const workerIds = [...new Set(applications.map((a) => a.workerId))];

  const attendanceRecords = await prisma.workerAttendance.findMany({
    where: {
      workerId: { in: workerIds },
      date: { gte: startDate, lte: endDate },
    },
  });

  // Group by worker
  const reportByWorker = {};
  applications.forEach((app) => {
    if (!reportByWorker[app.workerId]) {
      reportByWorker[app.workerId] = {
        workerId: app.workerId,
        name: `${app.worker.user.firstName || ""} ${app.worker.user.lastName || ""}`.trim(),
        workerCode: app.worker.workerCode,
        present: 0,
        absent: 0,
        halfDay: 0,
        onLeave: 0,
        totalHours: 0,
        overtimeHours: 0,
      };
    }
  });

  attendanceRecords.forEach((r) => {
    if (!reportByWorker[r.workerId]) return;
    const w = reportByWorker[r.workerId];
    if (r.status === "PRESENT") w.present++;
    else if (r.status === "ABSENT") w.absent++;
    else if (r.status === "HALF_DAY") w.halfDay++;
    else if (r.status === "ON_LEAVE") w.onLeave++;
    w.totalHours += r.totalHours || 0;
    w.overtimeHours += r.overtimeHours || 0;
  });

  return Object.values(reportByWorker);
};
