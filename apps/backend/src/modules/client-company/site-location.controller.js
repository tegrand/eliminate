import { listSites, createSite, updateSite, deleteSite } from "./site-location.service.js";

export const getSites = async (req, res) => {
  const data = await listSites(req.user.id, req.query.projectId);
  res.json({ status: "success", data });
};

export const postSite = async (req, res) => {
  const data = await createSite(req.user.id, req.body);
  res.status(201).json({ status: "success", data });
};

export const patchSite = async (req, res) => {
  const data = await updateSite(req.user.id, req.params.id, req.body);
  res.json({ status: "success", data });
};

export const removeSite = async (req, res) => {
  await deleteSite(req.user.id, req.params.id);
  res.json({ status: "success", message: "Site deleted" });
};
