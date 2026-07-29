import { listTeams, createTeam, updateTeam, deleteTeam, addTeamMember, removeTeamMember } from "./team.service.js";

export const getTeams = async (req, res) => {
  const data = await listTeams(req.user.id);
  res.json({ status: "success", data });
};

export const postTeam = async (req, res) => {
  const data = await createTeam(req.user.id, req.body);
  res.status(201).json({ status: "success", data });
};

export const patchTeam = async (req, res) => {
  const data = await updateTeam(req.user.id, req.params.id, req.body);
  res.json({ status: "success", data });
};

export const removeTeam = async (req, res) => {
  await deleteTeam(req.user.id, req.params.id);
  res.json({ status: "success", message: "Team deleted" });
};

export const postTeamMember = async (req, res) => {
  const data = await addTeamMember(req.user.id, req.params.id, req.body.workerId);
  res.status(201).json({ status: "success", data });
};

export const deleteTeamMember = async (req, res) => {
  await removeTeamMember(req.user.id, req.params.teamId, req.params.workerId);
  res.json({ status: "success", message: "Member removed" });
};
