import { Router } from "express";
import { getSupplierAHotels } from "../suppliers/supplierA";
import { getSupplierBHotels } from "../suppliers/supplierB";

const router = Router();

router.get("/supplierA/hotels", async (req, res) => {
  const { city } = req.query;

  if (!city || typeof city !== "string") {
    return res.status(400).json({
      error: "city query parameter is required",
    });
  }

  try {
    const hotels = await getSupplierAHotels(city);
    return res.json(hotels);
  } catch (error) {
    console.error("Supplier A failed:", error);

    return res.status(500).json({
      error: "Supplier A failed",
    });
  }
});

router.get("/supplierB/hotels", async (req, res) => {
  const { city } = req.query;

  if (!city || typeof city !== "string") {
    return res.status(400).json({
      error: "city query parameter is required",
    });
  }

  try {
    const hotels = await getSupplierBHotels(city);
    return res.json(hotels);
  } catch (error) {
    console.error("Supplier B failed:", error);

    return res.status(500).json({
      error: "Supplier B failed",
    });
  }
});

export default router;