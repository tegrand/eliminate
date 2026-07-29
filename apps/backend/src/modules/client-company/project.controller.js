import { listProjects, createProject, updateProject, deleteProject } from "./project.service.js";

export const getProjects = async (req, res) => {
  const data = await listProjects(req.user.id);
  res.json({ status: "success", data });
};

export const postProject = async (req, res) => {
  const data = await createProject(req.user.id, req.body);
  res.status(201).json({ status: "success", data });
};

export const patchProject = async (req, res) => {
  const data = await updateProject(req.user.id, req.params.id, req.body);
  res.json({ status: "success", data });
};

export const removeProject = async (req, res) => {
  await deleteProject(req.user.id, req.params.id);
  res.json({ status: "success", message: "Project deleted" });
};
