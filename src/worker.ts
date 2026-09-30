import { Worker, NativeConnection } from "@temporalio/worker";
import * as activities from "./activities/hotelActivities";

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
  });

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("./workflows/hotelWorkflow"),
    activities,
    taskQueue: "hotel-orchestrator",
  });

  console.log("Temporal Worker started");

  await worker.run();
}

run().catch((error) => {
  console.error("Worker failed:", error);
  process.exit(1);
});