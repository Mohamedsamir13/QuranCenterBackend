// controllers/groupController.js
const groupService = require("../services/groupService");

// ✅ Get all groups
exports.getAll = async (req, res) => {
  try {
    const groups = await groupService.getGroups();
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    console.error("❌ Error fetching groups:", error);
    res.status(500).json({ success: false, message: "Failed to fetch groups" });
  }
};

// ✅ Get group by ID
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupService.getGroup(id);

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("❌ Error fetching group by ID:", error);
    res.status(500).json({ success: false, message: "Failed to fetch group" });
  }
};

// ✅ Create new group
exports.create = async (req, res) => {
  try {
    console.log("📥 Incoming Group Payload:", req.body);
    const { name, place, day, teacherId, students = [] } = req.body;

    if (!name || !place || !day) {
      return res.status(400).json({
        success: false,
        message: "name, place and day are required",
      });
    }

    const newGroup = await groupService.createGroup({
      name,
      place,
      day,
      teacherId: teacherId || null,
      students,
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: newGroup,
    });
  } catch (error) {
    console.error("❌ Error creating group:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create group",
    });
  }
};

// ✅ Update group
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updated = await groupService.updateGroup(id, updateData);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data: updated,
    });
  } catch (e) {
    console.error("❌ Error updating group:", e);
    res.status(500).json({ success: false, message: "Failed to update group" });
  }
};

// ✅ Delete group
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await groupService.deleteGroup(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (e) {
    console.error("❌ Error deleting group:", e);
    res.status(500).json({ success: false, message: "Failed to delete group" });
  }
};

// ✅ Add student to group
exports.addStudent = async (req, res) => {
  try {
    const { id } = req.params; // groupId
    const { studentId } = req.body;

    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "studentId is required" });
    }

    const ok = await groupService.addStudentToGroup(id, studentId);

    if (!ok) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student added to group successfully",
    });
  } catch (e) {
    console.error("❌ Error adding student to group:", e);
    res.status(500).json({
      success: false,
      message: "Failed to add student to group",
    });
  }
};

// ✅ Remove student from group
exports.removeStudent = async (req, res) => {
  try {
    const { id } = req.params; // groupId
    const { studentId } = req.body;

    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "studentId is required" });
    }

    const ok = await groupService.removeStudentFromGroup(id, studentId);

    if (!ok) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student removed from group successfully",
    });
  } catch (e) {
    console.error("❌ Error removing student from group:", e);
    res.status(500).json({
      success: false,
      message: "Failed to remove student from group",
    });
  }
};
