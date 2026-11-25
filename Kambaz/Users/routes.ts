import type { Express, Request, Response } from "express";
import type { Database, User } from "../Database";
import UsersDao from "./dao";
import EnrollmentsDao from "../Enrollments/dao";

declare module "express-session" {
  interface SessionData {
    currentUser?: User;
  }
}

export default function UserRoutes(app: Express, db: Database) {
  const dao = UsersDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  // "current" in the path means the signed-in user.
  const resolveUserId = (req: Request) => {
    const { uid } = req.params as { uid: string };
    return uid === "current" ? req.session.currentUser?._id : uid;
  };

  const signup = (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    if (dao.findUserByUsername(username)) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session.currentUser = currentUser;
    res.json(currentUser);
  };

  const signin = (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};
    const currentUser = dao.findUserByCredentials(username, password);
    if (!currentUser) {
      res.status(401).json({ message: "Unable to login. Check your username and password." });
      return;
    }
    req.session.currentUser = currentUser;
    res.json(currentUser);
  };

  const signout = (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  const profile = (req: Request, res: Response) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const findAllUsers = (req: Request, res: Response) => {
    const { role } = req.query;
    if (typeof role === "string") {
      res.json(dao.findUsersByRole(role));
      return;
    }
    res.json(dao.findAllUsers());
  };

  const findUserById = (req: Request, res: Response) => {
    const user = dao.findUserById(req.params.userId as string);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
  };

  const createUser = (req: Request, res: Response) => {
    res.json(dao.createUser(req.body));
  };

  const updateUser = (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const updated = dao.updateUser(userId, req.body);
    if (!updated) {
      res.status(404).json({ message: `Unable to update user ${userId}` });
      return;
    }
    if (req.session.currentUser?._id === userId) {
      req.session.currentUser = updated;
    }
    res.json(updated);
  };

  const deleteUser = (req: Request, res: Response) => {
    const ok = dao.deleteUser(req.params.userId as string);
    res.sendStatus(ok ? 200 : 404);
  };

  // Enrollments
  const findCoursesForUser = (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    res.json(enrollmentsDao.findCoursesForUser(userId));
  };
  const enrollUserInCourse = (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    const { cid } = req.params as { cid: string };
    if (!db.courses.some((c) => c._id === cid)) {
      res.status(404).json({ message: `No course ${cid}` });
      return;
    }
    res.json(enrollmentsDao.enrollUserInCourse(userId, cid));
  };
  const unenrollUserFromCourse = (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    const { cid } = req.params as { cid: string };
    const ok = enrollmentsDao.unenrollUserFromCourse(userId, cid);
    if (!ok) {
      res.status(404).json({ message: "Not enrolled in that course" });
      return;
    }
    res.sendStatus(200);
  };

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/profile", profile);
  app.get("/api/users", findAllUsers);
  app.post("/api/users", createUser);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.get("/api/users/:uid/courses", findCoursesForUser);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}
