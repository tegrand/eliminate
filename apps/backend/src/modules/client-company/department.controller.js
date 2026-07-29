import { listDepartments, createDepartment, updateDepartment, deleteDepartment } from "./department.service.js";

export const getDepartments = async (req, res) => {
  const data = await listDepartments(req.user.id);
  res.json({ status: "success", data });
};

export const postDepartment = async (req, res) => {
  const data = await createDepartment(req.user.id, req.body);
  res.status(201).json({ status: "success", data });
};

export const patchDepartment = async (req, res) => {
  const data = await updateDepartment(req.user.id, req.params.id, req.body);
  res.json({ status: "success", data });
};

export const removeDepartment = async (req, res) => {
  await deleteDepartment(req.user.id, req.params.id);
  res.json({ status: "success", message: "Department deleted" });
};
