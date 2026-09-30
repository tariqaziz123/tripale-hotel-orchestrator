import { SupplierHotel } from "../types/hotel";

export async function getSupplierBHotels(
  city: string
): Promise<SupplierHotel[]> {
  const hotels: Record<string, SupplierHotel[]> = {
    delhi: [
      {
        name: "Holtin",
        price: 5340,
        commissionPct: 20
      },
      {
        name: "Radison",
        price: 6100,
        commissionPct: 14
      },
      {
        name: "The Leela",
        price: 9000,
        commissionPct: 16
      }
    ],
    mumbai: [
      {
        name: "Taj Mumbai",
        price: 6800,
        commissionPct: 17
      },
      {
        name: "Marine Hotel",
        price: 5200,
        commissionPct: 10
      }
    ]
  };

  return hotels[city.toLowerCase()] ?? [];
}