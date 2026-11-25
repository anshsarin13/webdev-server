import type { Express, Request, Response } from "express";
import type { Database } from "../Database";
import AssignmentsDao from "./dao";

export default function AssignmentRoutes(app: Express, db: Database) {
  const dao = AssignmentsDao(db);
  const findAssignmentById = (req: Request, res: Response) => {
    const assignment = dao.findAssignmentById(req.params.assignmentId as string);
    if (!assignment) {
      res.sendStatus(404);
      return;
    }
    res.json(assignment);
  };
  const updateAssignment = (req: Request, res: Response) => {
    const assignmentId = req.params.assignmentId as string;
    const updated = dao.updateAssignment(assignmentId, req.body);
    if (!updated) {
      res.status(404).json({ message: `Unable to update assignment ${assignmentId}` });
      return;
    }
    res.json(updated);
  };
  const deleteAssignment = (req: Request, res: Response) => {
    const assignmentId = req.params.assignmentId as string;
    if (!dao.deleteAssignment(assignmentId)) {
      res.status(404).json({ message: `Unable to delete assignment ${assignmentId}` });
      return;
    }
    res.sendStatus(200);
  };
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
