import { env } from "../env";
export const API_URL = env.VITE_API_URL;

export function toSearchParams(
  dataQuery: Record<string, any>
): URLSearchParams {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(dataQuery)) {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else if (value) {
      searchParams.append(key, value);
    }
  }
  return searchParams;
}

export async function fetchPestle(): Promise<string[]> {
  return fetch(API_URL + "/api/v1/pestles").then((res) => res.json());
}

export async function fetchSectors(): Promise<string[]> {
  return fetch(API_URL + "/api/v1/sectors").then((res) => res.json());
}
export async function fetchTopics(): Promise<string[]> {
  return fetch(API_URL + "/api/v1/topics").then((res) => res.json());
}

