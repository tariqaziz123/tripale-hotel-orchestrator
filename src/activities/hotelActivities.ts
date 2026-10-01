import { SupplierHotel } from "../types/hotel";

const supplierAUrl =
  process.env.SUPPLIER_A_URL || "http://localhost:3000/supplierA/hotels";

const supplierBUrl =
  process.env.SUPPLIER_B_URL || "http://localhost:3000/supplierB/hotels";

async function fetchSupplierHotels(
  url: string,
  city: string,
  supplierName: string
): Promise<SupplierHotel[]> {
  const response = await fetch(
    `${url}?city=${encodeURIComponent(city)}`
  );

  if (!response.ok) {
    throw new Error(
      `${supplierName} returned HTTP ${response.status}`
    );
  }

  return response.json() as Promise<SupplierHotel[]>;
}

export async function fetchSupplierAHotels(
  city: string
): Promise<SupplierHotel[]> {
  console.log(`[Supplier A] Fetching hotels for city: ${city}`);

  try {
    const hotels = await fetchSupplierHotels(
      supplierAUrl,
      city,
      "Supplier A"
    );

    console.log(
      `[Supplier A] Received ${hotels.length} hotels`
    );

    return hotels;
  } catch (error) {
    console.error("[Supplier A] Failed:", error);
    throw error;
  }
}

export async function fetchSupplierBHotels(
  city: string
): Promise<SupplierHotel[]> {
  console.log(`[Supplier B] Fetching hotels for city: ${city}`);

  try {
    const hotels = await fetchSupplierHotels(
      supplierBUrl,
      city,
      "Supplier B"
    );

    console.log(
      `[Supplier B] Received ${hotels.length} hotels`
    );

    return hotels;
  } catch (error) {
    console.error("[Supplier B] Failed:", error);
    throw error;
  }
}