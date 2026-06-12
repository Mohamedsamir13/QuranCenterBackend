// repositories/groupRepository.js
const { db, admin } = require("../config/firebase");
const GroupModel = require("../models/groupModel");

const groupsCollection = db.collection("groups");

// ✅ Get all groups
exports.getAllGroups = async () => {
  const snapshot = await groupsCollection.get();
  const groups = snapshot.docs.map(GroupModel.fromFirestore);

  // Fetch all student documents to count and associate them
  const studentsSnapshot = await db.collection("students").get();
  const studentsGroupMap = {};
  studentsSnapshot.forEach((doc) => {
    const data = doc.data();
    const groupId = data.group;
    if (groupId) {
      if (!studentsGroupMap[groupId]) {
        studentsGroupMap[groupId] = [];
      }
      studentsGroupMap[groupId].push(doc.id);
    }
  });

  return groups.map((g) => {
    const computedIds = studentsGroupMap[g.id] || [];
    const mergedIds = Array.from(new Set([...(g.students || []), ...computedIds]));
    g.students = mergedIds;
    return g;
  });
};

// ✅ Get group by ID
exports.getGroupById = async (id) => {
  const doc = await groupsCollection.doc(id).get();
  if (!doc.exists) return null;
  const group = GroupModel.fromFirestore(doc);

  const studentsSnapshot = await db.collection("students").where("group", "==", id).get();
  const computedIds = [];
  studentsSnapshot.forEach((doc) => {
    computedIds.push(doc.id);
  });

  const mergedIds = Array.from(new Set([...(group.students || []), ...computedIds]));
  group.students = mergedIds;
  return group;
};

// ✅ Create group
exports.addGroup = async (data) => {
  const group = new GroupModel(data);
  const docRef = await groupsCollection.add(group.toFirestore());
  await docRef.update({ id: docRef.id });

  return { ...data, id: docRef.id };
};

// ✅ Update group
exports.updateGroup = async (id, data) => {
  const docRef = groupsCollection.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  await docRef.update(data);
  return { id, ...data };
};

// ✅ Delete group
exports.deleteGroup = async (id) => {
  const docRef = groupsCollection.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  await docRef.delete();
  return true;
};

// ✅ (اختياري) Add student to group
exports.addStudentToGroup = async (groupId, studentId) => {
  const docRef = groupsCollection.doc(groupId);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  await docRef.update({
    students: admin.firestore.FieldValue.arrayUnion(studentId),
  });

  return true;
};

// ✅ (اختياري) Remove student from group
exports.removeStudentFromGroup = async (groupId, studentId) => {
  const docRef = groupsCollection.doc(groupId);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  await docRef.update({
    students: admin.firestore.FieldValue.arrayRemove(studentId),
  });

  return true;
};
