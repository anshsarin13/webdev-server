import { randomUUID } from "node:crypto";
import type { Course, Database } from "../Database";

export default function CoursesDao(db: Database) {
  const findAllCourses = () => db.courses;
  const findCourseById = (courseId: string) =>
    db.courses.find((course) => course._id === courseId);
  const createCourse = (course: Partial<Course>) => {
    const newCourse = { ...course, _id: randomUUID() } as Course;
    db.courses = [...db.courses, newCourse];
    return newCourse;
  };
  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    const existing = findCourseById(courseId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, _id: courseId } as Course;
    db.courses = db.courses.map((c) => (c._id === courseId ? updated : c));
    return updated;
  };
  // Deleting a course also removes what hangs off it.
  const deleteCourse = (courseId: string) => {
    const before = db.courses.length;
    db.courses = db.courses.filter((course) => course._id !== courseId);
    db.modules = db.modules.filter((m) => m.course !== courseId);
    db.assignments = db.assignments.filter((a) => a.course !== courseId);
    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
    return db.courses.length < before;
  };
  return { findAllCourses, findCourseById, createCourse, updateCourse, deleteCourse };
}
