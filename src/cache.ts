import { redis } from "./redis";

const fetch = async <T>(key: string, fetcher: () => T, expires: number) => {
  const existing = await get<T>(key);
  if (existing !== null) return existing;
  return set(key, fetcher, expires);
};

const get = async <T>(key: string): Promise<T> => {
  const value = await redis.get(key);
  if (value === null) return null;
  return JSON.parse(value);
};

const set = async <T>(key: string, fetcher: () => T, expires: number) => {
  const value = await fetcher();
  await redis.set(key, JSON.stringify(value), "EX", expires);
  return value;
};

const del = async (key: string) => {
  await redis.del(key);
};

export default { fetch, set, get, del };
