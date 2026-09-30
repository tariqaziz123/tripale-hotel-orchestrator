import express from "express";
import { getTemporalClient } from "./services/temporalClient";
import {
  saveHotelOffers,
  getHotelOffersByPrice,
} from "./services/redisService";
import healthRouter from "./routes/health";
import supplierRouter from "./routes/suppliers";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(healthRouter);
app.use(supplierRouter);
app.get("/api/hotels", async (req, res) => {
  const { city, minPrice, maxPrice } = req.query;

  if (!city || typeof city !== "string") {
    return res.status(400).json({
      error: "city query parameter is required",
    });
  }

  const parsedMinPrice =
    minPrice !== undefined ? Number(minPrice) : undefined;

  const parsedMaxPrice =
    maxPrice !== undefined ? Number(maxPrice) : undefined;

  if (
    (parsedMinPrice !== undefined && Number.isNaN(parsedMinPrice)) ||
    (parsedMaxPrice !== undefined && Number.isNaN(parsedMaxPrice))
  ) {
    return res.status(400).json({
      error: "minPrice and maxPrice must be valid numbers",
    });
  }

  if (
    parsedMinPrice !== undefined &&
    parsedMaxPrice !== undefined &&
    parsedMinPrice > parsedMaxPrice
  ) {
    return res.status(400).json({
      error: "minPrice cannot be greater than maxPrice",
    });
  }

  try {
    const client = await getTemporalClient();

    const workflowId = `hotel-search-${city}-${Date.now()}`;

    const hotels = await client.workflow.execute("hotelWorkflow", {
      taskQueue: "hotel-orchestrator",
      workflowId,
      args: [city],
    });

    const hasPriceFilter =
      parsedMinPrice !== undefined ||
      parsedMaxPrice !== undefined;

    if (hasPriceFilter) {
      await saveHotelOffers(city, hotels);

      const filteredHotels = await getHotelOffersByPrice(
        city,
        parsedMinPrice,
        parsedMaxPrice
      );

      return res.json(filteredHotels);
    }

    return res.json(hotels);
  } catch (error) {
    console.error("Hotel search failed:", error);

    return res.status(500).json({
      error: "Failed to fetch hotel offers",
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});