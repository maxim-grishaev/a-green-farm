import { Client, LatLngLiteral, TravelMode } from "@googlemaps/google-maps-services-js";
import { splitBy } from "./splitBy";

export const GMS_CHUNK_SIZE = 25;
const fetchChunk = async (
  gmsClient: Client,
  apiKey: string,
  from: LatLngLiteral,
  toList: LatLngLiteral[],
): Promise<Array<number | undefined>> => {
  if (toList.length > GMS_CHUNK_SIZE || toList.length === 0) {
    throw new Error("Invalid request size");
  }
  const resp = await gmsClient.distancematrix({
    params: {
      key: apiKey,
      origins: [from],
      destinations: toList,
      mode: TravelMode.driving,
    },
  });

  const first = resp.data.rows[0].elements;
  return first.map(elem => elem.distance?.value);
};

export const createDistanceFetcher = (apiKey: string) => {
  const gmsClient = new Client({});
  return {
    client: gmsClient,
    fetchDistances: async (from: LatLngLiteral, toList: LatLngLiteral[]): Promise<Array<number | undefined>> => {
      const chunks = splitBy(GMS_CHUNK_SIZE, toList);
      const results = await Promise.all(chunks.map(chunk => fetchChunk(gmsClient, apiKey, from, chunk)));
      return results.flat();
    },
  };
};
