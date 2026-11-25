import { randomUUID } from "node:crypto";
import type { Database, User } from "../Database";

export default function UsersDao(db: Database) {
  const findAllUsers = () => db.users;
  const findUserById = (userId: string) =>
    db.users.find((user) => user._id === userId);
  const findUserByUsername = (username: string) =>
    db.users.find((user) => user.username === username);
  const findUserByCredentials = (username: string, password: string) =>
    db.users.find(
      (user) => user.username === username && user.password === password,
    );
  const findUsersByRole = (role: string) =>
    db.users.filter((user) => user.role === role);
  const createUser = (user: Partial<User>) => {
    const newUser = {
      firstName: "",
      lastName: "",
      email: "",
      role: "STUDENT",
      loginId: "",
      section: "",
      lastActivity: "",
      totalActivity: "",
      username: "",
      password: "",
      ...user,
      _id: randomUUID(),
    } as User;
    db.users = [...db.users, newUser];
    return newUser;
  };
  const updateUser = (userId: string, updates: Partial<User>) => {
    const existing = findUserById(userId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, _id: userId } as User;
    db.users = db.users.map((user) => (user._id === userId ? updated : user));
    return updated;
  };
  const deleteUser = (userId: string) => {
    const before = db.users.length;
    db.users = db.users.filter((user) => user._id !== userId);
    db.enrollments = db.enrollments.filter((e) => e.user !== userId);
    return db.users.length < before;
  };
  return {
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    findUsersByRole,
    createUser,
    updateUser,
    deleteUser,
  };
}
