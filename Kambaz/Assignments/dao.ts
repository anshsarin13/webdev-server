import { randomUUID } from "node:crypto";
import type { Assignment, Database } from "../Database";

export default function AssignmentsDao(db: Database) {
  const findAssignmentsForCourse = (courseId: string) =>
    db.assignments.filter((assignment) => assignment.course === courseId);
  const findAssignmentById = (assignmentId: string) =>
    db.assignments.find((assignment) => assignment._id === assignmentId);
  const createAssignment = (assignment: Partial<Assignment>) => {
    const newAssignment = {
      title: "New Assignment",
      description: "",
      points: 100,
      due: "",
      available: "",
      ...assignment,
      _id: randomUUID(),
    } as Assignment;
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  };
  const updateAssignment = (assignmentId: string, updates: Partial<Assignment>) => {
    const existing = findAssignmentById(assignmentId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, _id: assignmentId } as Assignment;
    db.assignments = db.assignments.map((a) =>
      a._id === assignmentId ? updated : a,
    );
    return updated;
  };
  const deleteAssignment = (assignmentId: string) => {
    const before = db.assignments.length;
    db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
    return db.assignments.length < before;
  };
  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
