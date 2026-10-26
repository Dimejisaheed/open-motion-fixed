import { Router } from "express";
import { z } from "zod";
import { validate, validated } from "../middleware/validate.js";
import { runAsync } from "../../utils/async.js";
import {
  findDuplicateComponents,
  applyDedupPlan,
  listUndoHistory,
  performUndo,
  performRedo,
  type DuplicateGroup,
} from "../services/batchOpsService.js";
import {
  batchUpdateComponents,
  batchDeleteProjectComponents,
} from "../services/componentService.js";
import type { ComponentPatch } from "../../db/repositories/components.js";
import { ComponentInputSchema } from "./components.js";

/**
 * Batch router — multi-component batch operations for a project.
 *
 * Mounted at /api/projects/:id/batch (see server/app.ts). This file was
 * imported by app.ts but never committed upstream, so the server could
 * not build at all. It wires the existing batchOpsService (duplicate
 * detection, dedup plans, server-side undo/redo) and the component
 * batch update/delete helpers to HTTP, using the same validate/runAsync
 * conventions as the sibling routes.
 *
 * Note: Router({ mergeParams: true }) is required — :id comes from the
 * mount path in app.ts, not from a path defined in this router.
 */
const batchRouter = Router({ mergeParams: true });

const DedupSchema = z.object({
  groups: z.array(
    z.object({
      keepId: z.string(),
      candidateIds: z.array(z.string()),
      score: z.number(),
      kind: z.enum(["exact", "near"]),
      note: z.string(),
    }),
  ),
});

const BatchUpdateSchema = z.object({
  updates: z.array(
    z.object({
      componentId: z.string(),
      patch: ComponentInputSchema,
    }),
  ),
});

const BatchDeleteSchema = z.object({
  componentIds: z.array(z.string()).min(1),
});

/** GET /api/projects/:id/batch/duplicates — find duplicate components. */
batchRouter.get(
  "/duplicates",
  runAsync(async (req, res) => {
    const nearThreshold =
      typeof req.query.nearThreshold === "string"
        ? Number(req.query.nearThreshold)
        : undefined;
    const groups = findDuplicateComponents(
      req.params.id,
      nearThreshold !== undefined && !Number.isNaN(nearThreshold)
        ? { nearThreshold }
        : {},
    );
    res.json({ projectId: req.params.id, groups });
  }),
);

/** POST /api/projects/:id/batch/dedup — apply a dedup plan. */
batchRouter.post(
  "/dedup",
  validate(DedupSchema),
  runAsync(async (req, res) => {
    const { groups } = validated<{ groups: DuplicateGroup[] }>(req);
    res.json(applyDedupPlan(req.params.id, groups));
  }),
);

/** PATCH /api/projects/:id/batch/components — batch-update components. */
batchRouter.patch(
  "/components",
  validate(BatchUpdateSchema),
  runAsync(async (req, res) => {
    const { updates } = validated<{
      updates: Array<{ componentId: string; patch: ComponentPatch }>;
    }>(req);
    res.json(batchUpdateComponents(req.params.id, updates));
  }),
);

/** DELETE /api/projects/:id/batch/components — batch-delete components. */
batchRouter.delete(
  "/components",
  validate(BatchDeleteSchema),
  runAsync(async (req, res) => {
    const { componentIds } = validated<{ componentIds: string[] }>(req);
    const removed = batchDeleteProjectComponents(req.params.id, componentIds);
    res.json({ removed });
  }),
);

/** GET /api/projects/:id/batch/undo — list undo history (last 20). */
batchRouter.get(
  "/undo",
  runAsync(async (req, res) => {
    res.json({ projectId: req.params.id, history: listUndoHistory(req.params.id) });
  }),
);

/** POST /api/projects/:id/batch/undo — undo the most recent batch entry. */
batchRouter.post(
  "/undo",
  runAsync(async (req, res) => {
    const result = performUndo(req.params.id);
    if (!result) {
      res.status(404).json({ error: "nothing to undo" });
      return;
    }
    res.json(result);
  }),
);

/** POST /api/projects/:id/batch/redo — redo the most recent undone entry. */
batchRouter.post(
  "/redo",
  runAsync(async (req, res) => {
    const result = performRedo(req.params.id);
    if (!result) {
      res.status(404).json({ error: "nothing to redo" });
      return;
    }
    res.json(result);
  }),
);

export default batchRouter;
