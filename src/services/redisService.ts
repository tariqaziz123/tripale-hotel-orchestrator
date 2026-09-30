import Redis from "ioredis";
import { HotelOffer } from "../types/hotel";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
});

function getHotelKey(city: string): string {
  return `hotels:${city.toLowerCase()}`;
}

function getPriceKey(city: string): string {
  return `hotels:${city.toLowerCase()}:prices`;
}

export async function saveHotelOffers(
  city: string,
  hotels: HotelOffer[]
): Promise<void> {
  const hotelKey = getHotelKey(city);
  const priceKey = getPriceKey(city);

  await redis.del(hotelKey, priceKey);

  if (hotels.length === 0) {
    return;
  }

  const pipeline = redis.pipeline();

  for (const hotel of hotels) {
    pipeline.hset(
      hotelKey,
      hotel.name,
      JSON.stringify(hotel)
    );

    pipeline.zadd(
      priceKey,
      hotel.price,
      hotel.name
    );
  }

  await pipeline.exec();
}

export async function getHotelOffers(
  city: string
): Promise<HotelOffer[]> {
  const hotelKey = getHotelKey(city);

  const results = await redis.hvals(hotelKey);

  return results.map(
    (hotel) => JSON.parse(hotel) as HotelOffer
  );
}

export async function getHotelOffersByPrice(
  city: string,
  minPrice?: number,
  maxPrice?: number
): Promise<HotelOffer[]> {
  const priceKey = getPriceKey(city);
  const hotelKey = getHotelKey(city);

  const min = minPrice ?? 0;
  const max = maxPrice ?? "+inf";

  const hotelNames = await redis.zrangebyscore(
    priceKey,
    min,
    max
  );

  if (hotelNames.length === 0) {
    return [];
  }

  const pipeline = redis.pipeline();

  for (const hotelName of hotelNames) {
    pipeline.hget(hotelKey, hotelName);
  }

  const results = await pipeline.exec();

  if (!results) {
    return [];
  }

  return results
    .map(([, value]) => value)
    .filter((value): value is string => typeof value === "string")
    .map((value) => JSON.parse(value) as HotelOffer);
}