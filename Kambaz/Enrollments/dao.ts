import { randomUUID } from "node:crypto";
import type { Database } from "../Database";

export default function EnrollmentsDao(db: Database) {
  const findAllEnrollments = () => db.enrollments;
  const findEnrollmentsForUser = (userId: string) =>
    db.enrollments.filter((e) => e.user === userId);
  const findCoursesForUser = (userId: string) => {
    const courseIds = new Set(
      db.enrollments.filter((e) => e.user === userId).map((e) => e.course),
    );
    return db.courses.filter((course) => courseIds.has(course._id));
  };
  const findUsersForCourse = (courseId: string) => {
    const userIds = new Set(
      db.enrollments.filter((e) => e.course === courseId).map((e) => e.user),
    );
    return db.users.filter((user) => userIds.has(user._id));
  };
  const findEnrollment = (userId: string, courseId: string) =>
    db.enrollments.find((e) => e.user === userId && e.course === courseId);
  const enrollUserInCourse = (userId: string, courseId: string) => {
    const existing = findEnrollment(userId, courseId);
    if (existing) return existing;
    const enrollment = { _id: randomUUID(), user: userId, course: courseId };
    db.enrollments = [...db.enrollments, enrollment];
    return enrollment;
  };
  const unenrollUserFromCourse = (userId: string, courseId: string) => {
    const before = db.enrollments.length;
    db.enrollments = db.enrollments.filter(
      (e) => !(e.user === userId && e.course === courseId),
    );
    return db.enrollments.length < before;
  };
  return {
    findAllEnrollments,
    findEnrollmentsForUser,
    findCoursesForUser,
    findUsersForCourse,
    findEnrollment,
    enrollUserInCourse,
    unenrollUserFromCourse,
  };
}
