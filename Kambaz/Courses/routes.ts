import type { Express, Request, Response } from "express";
import type { Database } from "../Database";
import CoursesDao from "./dao";
import EnrollmentsDao from "../Enrollments/dao";
import ModulesDao from "../Modules/dao";
import AssignmentsDao from "../Assignments/dao";

export default function CourseRoutes(app: Express, db: Database) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const modulesDao = ModulesDao(db);
  const assignmentsDao = AssignmentsDao(db);

  // Courses
  const findAllCourses = (req: Request, res: Response) => {
    res.json(dao.findAllCourses());
  };
  const findCourseById = (req: Request, res: Response) => {
    const course = dao.findCourseById(req.params.courseId as string);
    if (!course) {
      res.sendStatus(404);
      return;
    }
    res.json(course);
  };
  const createCourse = (req: Request, res: Response) => {
    const course = dao.createCourse(req.body);
    const currentUser = req.session.currentUser;
    if (currentUser) {
      enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    }
    res.json(course);
  };
  const deleteCourse = (req: Request, res: Response) => {
    const ok = dao.deleteCourse(req.params.courseId as string);
    if (!ok) {
      res.status(404).json({ message: `Unable to delete course ${req.params.courseId}` });
      return;
    }
    res.sendStatus(200);
  };
  const updateCourse = (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const updated = dao.updateCourse(courseId, req.body);
    if (!updated) {
      res.status(404).json({ message: `Unable to update course ${courseId}` });
      return;
    }
    res.json(updated);
  };
  // People enrolled in a course
  const findUsersForCourse = (req: Request, res: Response) => {
    res.json(enrollmentsDao.findUsersForCourse(req.params.courseId as string));
  };
  // All enrollment records
  const findAllEnrollments = (req: Request, res: Response) => {
    res.json(enrollmentsDao.findAllEnrollments());
  };

  // Modules of a course
  const findModulesForCourse = (req: Request, res: Response) => {
    res.json(modulesDao.findModulesForCourse(req.params.courseId as string));
  };
  const createModuleForCourse = (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    if (!dao.findCourseById(courseId)) {
      res.status(404).json({ message: `No course ${courseId}` });
      return;
    }
    res.json(modulesDao.createModule({ ...req.body, course: courseId }));
  };

  // Assignments of a course
  const findAssignmentsForCourse = (req: Request, res: Response) => {
    res.json(assignmentsDao.findAssignmentsForCourse(req.params.courseId as string));
  };
  const createAssignmentForCourse = (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    if (!dao.findCourseById(courseId)) {
      res.status(404).json({ message: `No course ${courseId}` });
      return;
    }
    res.json(assignmentsDao.createAssignment({ ...req.body, course: courseId }));
  };

  app.get("/api/courses", findAllCourses);
  app.post("/api/courses", createCourse);
  app.get("/api/enrollments", findAllEnrollments);
  app.get("/api/courses/:courseId", findCourseById);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
}
