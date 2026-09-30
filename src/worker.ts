import { Worker } from "@temporalio/worker";
import * as activities from "./activities/hotelActivities";

async function run() {
  const worker = await Worker.create({
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