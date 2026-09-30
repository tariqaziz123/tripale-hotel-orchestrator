import { SupplierHotel } from "../types/hotel";

export async function getSupplierAHotels(
  city: string
): Promise<SupplierHotel[]> {
  const hotels: Record<string, SupplierHotel[]> = {
    delhi: [
      {
        name: "Holtin",
        price: 5500,
        commissionPct: 15
      },
      {
        name: "Radison",
        price: 5900,
        commissionPct: 13
      },
      {
        name: "Taj Palace",
        price: 8500,
        commissionPct: 18
      }
    ],
    mumbai: [
      {
        name: "Taj Mumbai",
        price: 7000,
        commissionPct: 15
      },
      {
        name: "Sea View Hotel",
        price: 4800,
        commissionPct: 12
      }
    ]
  };

  return hotels[city.toLowerCase()] ?? [];
}