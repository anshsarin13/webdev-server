import courses from "./courses.json";
import modules from "./modules.json";
import assignments from "./assignments.json";
import users from "./users.json";
import enrollments from "./enrollments.json";

export type Course = (typeof courses)[number];
export type Module = {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: { _id: string; name: string; description: string; module: string }[];
};
export type Assignment = {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  due: string;
  available: string;
  until?: string;
};
export type User = (typeof users)[number];
export type Enrollment = (typeof enrollments)[number];

export type Database = {
  courses: Course[];
  modules: Module[];
  assignments: Assignment[];
  users: User[];
  enrollments: Enrollment[];
};

// In-memory collections, copied from the seed JSON. Changes persist while the
// server is running; a restart resets them to the seed data (MongoDB: Chapter 6).
const db: Database = {
  courses: structuredClone(courses),
  modules: structuredClone(modules) as Module[],
  assignments: structuredClone(assignments) as Assignment[],
  users: structuredClone(users),
  enrollments: structuredClone(enrollments),
};

export default db;
