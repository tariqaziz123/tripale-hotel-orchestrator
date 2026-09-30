import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/hotelActivities";
import { HotelOffer } from "../types/hotel";

const { fetchSupplierAHotels, fetchSupplierBHotels } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: "10 seconds",
  });

export async function hotelWorkflow(
  city: string
): Promise<HotelOffer[]> {
  console.log(`Starting hotel workflow for ${city}`);

  const [supplierAHotels, supplierBHotels] = await Promise.all([
    fetchSupplierAHotels(city),
    fetchSupplierBHotels(city),
  ]);

  console.log(
    `Supplier results received: A=${supplierAHotels.length}, B=${supplierBHotels.length}`
  );

  const hotelMap = new Map<string, HotelOffer>();

  for (const hotel of supplierAHotels) {
    hotelMap.set(hotel.name, {
      ...hotel,
      supplier: "Supplier A",
    });
  }

  for (const hotel of supplierBHotels) {
    const existingHotel = hotelMap.get(hotel.name);

    if (!existingHotel || hotel.price < existingHotel.price) {
      hotelMap.set(hotel.name, {
        ...hotel,
        supplier: "Supplier B",
      });
    }
  }

  const result = Array.from(hotelMap.values());

  console.log(
    `Hotel workflow completed with ${result.length} unique hotels`
  );

  return result;
}