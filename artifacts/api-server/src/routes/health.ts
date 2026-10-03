import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Synergy API is running" });
});

export default router;
