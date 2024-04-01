import { type DistanceMatrixResponseData } from "@googlemaps/google-maps-services-js";
import { splitBy } from "./splitBy";
import { LatLng } from "./latLng";

// Just for illustration purposes
// https://maps.googleapis.com/maps/api/distancematrix/json
// ?destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626
// &origins=40.6655101%2C-73.89188969999998
// &key=YOUR_API_KEY

export const GMS_CHUNK_SIZE = 25;
const stringifyLatLng = (latLng: LatLng): string => `${latLng.lat},${latLng.lng}`;

const fetchChunk = async (apiKey: string, from: LatLng, toList: LatLng[]): Promise<number[]> => {
  if (toList.length > GMS_CHUNK_SIZE || toList.length === 0) {
    throw new Error("Invalid request size");
  }
  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.append("key", apiKey);
  url.searchParams.append("origins", stringifyLatLng(from));
  url.searchParams.append("destinations", toList.map(stringifyLatLng).join("|"));
  url.searchParams.append("mode", "driving");

  const resp = await fetch(url.toString());
  const json = (await resp.json()) as DistanceMatrixResponseData;
  const first = json.rows[0].elements;
  return first.map(elem => elem.distance?.value);
};

export const createRawDistanceFetcher = (apiKey: string) => {
  return {
    fetchDistances: async (from: LatLng, toList: LatLng[]): Promise<number[]> => {
      const chunks = splitBy(GMS_CHUNK_SIZE, toList);
      const results = await Promise.all(chunks.map(chunk => fetchChunk(apiKey, from, chunk)));
      return results.flat();
    },
  };
};
