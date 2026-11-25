import { randomUUID } from "node:crypto";
import type { Database, Module } from "../Database";

export default function ModulesDao(db: Database) {
  const findModulesForCourse = (courseId: string) =>
    db.modules.filter((module) => module.course === courseId);
  const findModuleById = (moduleId: string) =>
    db.modules.find((module) => module._id === moduleId);
  const createModule = (module: Partial<Module>) => {
    const newModule = {
      description: "",
      lessons: [],
      ...module,
      _id: randomUUID(),
    } as Module;
    db.modules = [...db.modules, newModule];
    return newModule;
  };
  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    const existing = findModuleById(moduleId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, _id: moduleId } as Module;
    db.modules = db.modules.map((m) => (m._id === moduleId ? updated : m));
    return updated;
  };
  const deleteModule = (moduleId: string) => {
    const before = db.modules.length;
    db.modules = db.modules.filter((module) => module._id !== moduleId);
    return db.modules.length < before;
  };
  return { findModulesForCourse, findModuleById, createModule, updateModule, deleteModule };
}
