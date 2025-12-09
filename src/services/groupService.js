// services/groupService.js
const groupRepo = require("../repositories/groupRepo");

exports.getGroups = async () => groupRepo.getAllGroups();
exports.getGroup = async (id) => groupRepo.getGroupById(id);
exports.createGroup = async (data) => groupRepo.addGroup(data);
exports.updateGroup = async (id, data) => groupRepo.updateGroup(id, data);
exports.deleteGroup = async (id) => groupRepo.deleteGroup(id);

exports.addStudentToGroup = async (groupId, studentId) =>
  groupRepo.addStudentToGroup(groupId, studentId);

exports.removeStudentFromGroup = async (groupId, studentId) =>
  groupRepo.removeStudentFromGroup(groupId, studentId);
