import fs from 'fs/promises';
import path from 'path';
import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const getWorkerByUserId = async (userId) => {
  const worker = await prisma.worker.findUnique({
    where: { userId }
  });
  if (!worker) throw new AppError("Worker profile not found", 404);
  return worker;
};

export const getMyDocuments = async (userId) => {
  const worker = await getWorkerByUserId(userId);
  return prisma.workerDocument.findMany({
    where: { workerId: worker.id },
    orderBy: { createdAt: "desc" }
  });
};

export const uploadDocument = async (userId, file, body) => {
  const worker = await getWorkerByUserId(userId);
  
  if (!file) throw new AppError("No file provided", 400);
  if (!body.documentType) throw new AppError("Document type is required", 400);

  // File is already saved by multer, we just need the path.
  // In a real app we'd upload to S3, but here we serve statically from /uploads/documents
  const documentUrl = `/uploads/documents/${file.filename}`;

  return prisma.workerDocument.create({
    data: {
      workerId: worker.id,
      documentType: body.documentType,
      documentUrl,
      fileName: file.originalname,
      status: "PENDING_VERIFICATION"
    }
  });
};

export const replaceDocument = async (userId, documentId, file) => {
  const worker = await getWorkerByUserId(userId);
  
  if (!file) throw new AppError("No file provided for replacement", 400);

  const existingDoc = await prisma.workerDocument.findFirst({
    where: { id: documentId, workerId: worker.id }
  });

  if (!existingDoc) throw new AppError("Document not found", 404);

  // Optionally delete the old file from disk here
  // const oldPath = path.join(process.cwd(), existingDoc.documentUrl);
  // try { await fs.unlink(oldPath); } catch(e) {}

  const documentUrl = `/uploads/documents/${file.filename}`;

  return prisma.workerDocument.update({
    where: { id: documentId },
    data: {
      documentUrl,
      fileName: file.originalname,
      status: "PENDING_VERIFICATION"
    }
  });
};

export const deleteDocument = async (userId, documentId) => {
  const worker = await getWorkerByUserId(userId);

  const existingDoc = await prisma.workerDocument.findFirst({
    where: { id: documentId, workerId: worker.id }
  });

  if (!existingDoc) throw new AppError("Document not found", 404);

  // Delete from DB
  await prisma.workerDocument.delete({
    where: { id: documentId }
  });

  // Try to delete from disk
  // const oldPath = path.join(process.cwd(), existingDoc.documentUrl);
  // try { await fs.unlink(oldPath); } catch(e) {}

  return { success: true };
};
