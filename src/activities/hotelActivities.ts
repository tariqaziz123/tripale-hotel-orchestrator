import { getSupplierAHotels } from "../suppliers/supplierA";
import { getSupplierBHotels } from "../suppliers/supplierB";
import { SupplierHotel } from "../types/hotel";

export async function fetchSupplierAHotels(
  city: string
): Promise<SupplierHotel[]> {
  return getSupplierAHotels(city);
}

export async function fetchSupplierBHotels(
  city: string
): Promise<SupplierHotel[]> {
  return getSupplierBHotels(city);
}