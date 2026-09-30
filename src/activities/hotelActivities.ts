import { getSupplierAHotels } from "../suppliers/supplierA";
import { getSupplierBHotels } from "../suppliers/supplierB";
import { SupplierHotel } from "../types/hotel";

export async function fetchSupplierAHotels(
  city: string
): Promise<SupplierHotel[]> {
  try {
    console.log(`[Supplier A] Fetching hotels for ${city}`);

    const hotels = await getSupplierAHotels(city);

    console.log(
      `[Supplier A] Returned ${hotels.length} hotels for ${city}`
    );

    return hotels;
  } catch (error) {
    console.error(
      `[Supplier A] Failed for ${city}:`,
      error
    );

    throw error;
  }
}

export async function fetchSupplierBHotels(
  city: string
): Promise<SupplierHotel[]> {
  try {
    console.log(`[Supplier B] Fetching hotels for ${city}`);

    const hotels = await getSupplierBHotels(city);

    console.log(
      `[Supplier B] Returned ${hotels.length} hotels for ${city}`
    );

    return hotels;
  } catch (error) {
    console.error(
      `[Supplier B] Failed for ${city}:`,
      error
    );

    throw error;
  }
}