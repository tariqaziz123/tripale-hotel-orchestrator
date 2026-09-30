import { Router } from "express";
import { getSupplierAHotels } from "../suppliers/supplierA";
import { getSupplierBHotels } from "../suppliers/supplierB";

const router = Router();

router.get("/health", async (_req, res) => {
  const checks = {
    supplierA: "healthy",
    supplierB: "healthy",
  };

  try {
    await getSupplierAHotels("delhi");
  } catch {
    checks.supplierA = "unhealthy";
  }

  try {
    await getSupplierBHotels("delhi");
  } catch {
    checks.supplierB = "unhealthy";
  }

  const healthy =
    checks.supplierA === "healthy" &&
    checks.supplierB === "healthy";

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "healthy" : "unhealthy",
    suppliers: checks,
  });
});

export default router;