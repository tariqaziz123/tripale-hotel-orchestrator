import Redis from "ioredis";
import { HotelOffer } from "../types/hotel";

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

export async function saveHotelOffers(
  city: string,
  hotels: HotelOffer[]
): Promise<void> {
  const key = `hotels:${city.toLowerCase()}`;

  await redis.del(key);

  if (hotels.length === 0) {
    return;
  }

  const pipeline = redis.pipeline();

  for (const hotel of hotels) {
    pipeline.hset(
      key,
      hotel.name,
      JSON.stringify(hotel)
    );
  }

  await pipeline.exec();
}

export async function getHotelOffers(
  city: string
): Promise<HotelOffer[]> {
  const key = `hotels:${city.toLowerCase()}`;

  const results = await redis.hvals(key);

  return results.map((hotel) => JSON.parse(hotel) as HotelOffer);
}