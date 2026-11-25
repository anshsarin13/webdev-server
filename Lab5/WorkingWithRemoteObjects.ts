import type { Express, Request, Response } from "express";

const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

// On your own: a module object with string properties
const moduleObject = {
  id: "CS5610",
  name: "Web Development",
  description: "Build full stack web applications with Next.js and Express",
  course: "CS5610",
};

export default function WorkingWithRemoteObjects(app: Express) {
  // Assignment object
  const getAssignment = (req: Request, res: Response) => {
    res.json(assignment);
  };
  const getAssignmentTitle = (req: Request, res: Response) => {
    res.json(assignment.title);
  };
  const setAssignmentTitle = (req: Request, res: Response) => {
    const { newTitle } = req.params;
    assignment.title = newTitle as string;
    res.json(assignment);
  };
  const setAssignmentScore = (req: Request, res: Response) => {
    const { newScore } = req.params;
    assignment.score = parseInt(newScore as string);
    res.json(assignment);
  };
  const setAssignmentCompleted = (req: Request, res: Response) => {
    const { completed } = req.params;
    assignment.completed = completed === "true";
    res.json(assignment);
  };
  app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);
  app.get("/lab5/assignment/score/:newScore", setAssignmentScore);
  app.get("/lab5/assignment/completed/:completed", setAssignmentCompleted);
  app.get("/lab5/assignment/title", getAssignmentTitle);
  app.get("/lab5/assignment", getAssignment);

  // Module object (on your own)
  const getModule = (req: Request, res: Response) => {
    res.json(moduleObject);
  };
  const getModuleName = (req: Request, res: Response) => {
    res.json(moduleObject.name);
  };
  const setModuleName = (req: Request, res: Response) => {
    const { newName } = req.params;
    moduleObject.name = newName as string;
    res.json(moduleObject);
  };
  const setModuleDescription = (req: Request, res: Response) => {
    const { newDescription } = req.params;
    moduleObject.description = newDescription as string;
    res.json(moduleObject);
  };
  app.get("/lab5/module/name/:newName", setModuleName);
  app.get("/lab5/module/description/:newDescription", setModuleDescription);
  app.get("/lab5/module/name", getModuleName);
  app.get("/lab5/module", getModule);
}
