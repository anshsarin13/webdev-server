import type { Express, Request, Response } from "express";
import type { Database } from "../Database";
import ModulesDao from "./dao";

export default function ModuleRoutes(app: Express, db: Database) {
  const dao = ModulesDao(db);
  const findModuleById = (req: Request, res: Response) => {
    const module = dao.findModuleById(req.params.moduleId as string);
    if (!module) {
      res.sendStatus(404);
      return;
    }
    res.json(module);
  };
  const updateModule = (req: Request, res: Response) => {
    const moduleId = req.params.moduleId as string;
    const updated = dao.updateModule(moduleId, req.body);
    if (!updated) {
      res.status(404).json({ message: `Unable to update module ${moduleId}` });
      return;
    }
    res.json(updated);
  };
  const deleteModule = (req: Request, res: Response) => {
    const moduleId = req.params.moduleId as string;
    if (!dao.deleteModule(moduleId)) {
      res.status(404).json({ message: `Unable to delete module ${moduleId}` });
      return;
    }
    res.sendStatus(200);
  };
  app.get("/api/modules/:moduleId", findModuleById);
  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
}
