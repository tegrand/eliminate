import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";
import { startOfDay, endOfDay, differenceInMinutes, startOfMonth, endOfMonth } from "date-fns";

const getWorkerByUserId = async (userId) => {
  const worker = await prisma.worker.findUnique({
    where: { userId }
  });
  if (!worker) throw new AppError("Worker profile not found", 404);
  return worker;
};

export const checkIn = async (userId) => {
  const worker = await getWorkerByUserId(userId);
  const today = startOfDay(new Date());

  const existing = await prisma.workerAttendance.findUnique({
    where: { workerId_date: { workerId: worker.id, date: today } }
  });

  if (existing && existing.checkInTime) {
    throw new AppError("You have already checked in today", 400);
  }

  if (existing) {
    // If somehow a record exists without check-in (e.g. marked absent)
    return prisma.workerAttendance.update({
      where: { id: existing.id },
      data: { checkInTime: new Date(), status: "PRESENT" }
    });
  }

  return prisma.workerAttendance.create({
    data: {
      workerId: worker.id,
      date: today,
      checkInTime: new Date(),
      status: "PRESENT"
    }
  });
};

export const checkOut = async (userId) => {
  const worker = await getWorkerByUserId(userId);
  const today = startOfDay(new Date());

  const existing = await prisma.workerAttendance.findUnique({
    where: { workerId_date: { workerId: worker.id, date: today } }
  });

  if (!existing || !existing.checkInTime) {
    throw new AppError("You must check in first", 400);
  }
  if (existing.checkOutTime) {
    throw new AppError("You have already checked out today", 400);
  }

  const checkOutTime = new Date();
  const diffMinutes = differenceInMinutes(checkOutTime, existing.checkInTime);
  const totalHours = diffMinutes / 60;
  
  // Standard 8 hours for overtime calculation
  const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

  return prisma.workerAttendance.update({
    where: { id: existing.id },
    data: {
      checkOutTime,
      totalHours: Number(totalHours.toFixed(2)),
      overtimeHours: Number(overtimeHours.toFixed(2))
    }
  });
};

export const markStatus = async (userId, status) => {
  const worker = await getWorkerByUserId(userId);
  const today = startOfDay(new Date());

  const validStatuses = ["PRESENT", "ABSENT", "HALF_DAY", "ON_LEAVE"];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid attendance status", 400);
  }

  const existing = await prisma.workerAttendance.findUnique({
    where: { workerId_date: { workerId: worker.id, date: today } }
  });

  if (existing) {
    return prisma.workerAttendance.update({
      where: { id: existing.id },
      data: { status }
    });
  }

  return prisma.workerAttendance.create({
    data: {
      workerId: worker.id,
      date: today,
      status
    }
  });
};

export const getHistory = async (userId, { month, year }) => {
  const worker = await getWorkerByUserId(userId);
  
  const currentDate = new Date();
  const targetMonth = month ? Number(month) - 1 : currentDate.getMonth();
  const targetYear = year ? Number(year) : currentDate.getFullYear();
  
  const startDate = startOfMonth(new Date(targetYear, targetMonth, 1));
  const endDate = endOfMonth(new Date(targetYear, targetMonth, 1));

  return prisma.workerAttendance.findMany({
    where: {
      workerId: worker.id,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { date: "desc" }
  });
};

export const getSummary = async (userId, { month, year }) => {
  const worker = await getWorkerByUserId(userId);
  
  const currentDate = new Date();
  const targetMonth = month ? Number(month) - 1 : currentDate.getMonth();
  const targetYear = year ? Number(year) : currentDate.getFullYear();
  
  const startDate = startOfMonth(new Date(targetYear, targetMonth, 1));
  const endDate = endOfMonth(new Date(targetYear, targetMonth, 1));

  const records = await prisma.workerAttendance.findMany({
    where: {
      workerId: worker.id,
      date: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  const summary = {
    present: 0,
    absent: 0,
    halfDay: 0,
    onLeave: 0,
    totalOvertimeHours: 0,
    totalWorkingHours: 0
  };

  records.forEach(r => {
    if (r.status === "PRESENT") summary.present++;
    if (r.status === "ABSENT") summary.absent++;
    if (r.status === "HALF_DAY") summary.halfDay++;
    if (r.status === "ON_LEAVE") summary.onLeave++;
    
    summary.totalOvertimeHours += r.overtimeHours || 0;
    summary.totalWorkingHours += r.totalHours || 0;
  });

  return summary;
};

export const getLeaves = async (userId) => {
  const worker = await getWorkerByUserId(userId);
  return prisma.leaveRequest.findMany({
    where: { workerId: worker.id },
    orderBy: { createdAt: "desc" }
  });
};

export const applyLeave = async (userId, data) => {
  const worker = await getWorkerByUserId(userId);
  
  return prisma.leaveRequest.create({
    data: {
      workerId: worker.id,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      leaveType: data.leaveType,
      reason: data.reason
    }
  });
};
