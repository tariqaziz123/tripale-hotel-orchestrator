import express from "express";
import { Connection, Client } from "@temporalio/client";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/hotels", async (req, res) => {
  const city = req.query.city;

  if (!city || typeof city !== "string") {
    return res.status(400).json({
      error: "city query parameter is required",
    });
  }

  try {
    const connection = await Connection.connect({
      address: "localhost:7233",
    });

    const client = new Client({
      connection,
    });

    const workflowId = `hotel-search-${city}-${Date.now()}`;

    const result = await client.workflow.execute("hotelWorkflow", {
      taskQueue: "hotel-orchestrator",
      workflowId,
      args: [city],
    });

    return res.json(result);
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