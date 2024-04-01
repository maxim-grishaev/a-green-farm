import { type DistanceMatrixResponse, type DistanceMatrixRowElement, Status } from "@googlemaps/google-maps-services-js";
import { createDistanceFetcher } from "../createDistanceFetcher";

describe("createDistanceFetcher", () => {
  it("should create a GMS client", () => {
    const apiKey = "test-api-key";
    const client = createDistanceFetcher(apiKey);
    expect(client).toBeDefined();
  });

  it("should fetch distances", async () => {
    const apiKey = "test-api-key";
    const gms = createDistanceFetcher(apiKey);

    jest.spyOn(gms.client, "distancematrix").mockResolvedValue({
      data: {
        rows: [
          {
            elements: [
              { distance: { text: "", value: 100 }, status: Status.OK } as DistanceMatrixRowElement,
              { status: Status.NOT_FOUND } as DistanceMatrixRowElement,
            ],
          },
        ],
      },
    } as DistanceMatrixResponse);

    const from = { lat: 0, lng: 0 };
    const toList = [
      { lat: 1, lng: 1 },
      { lat: 2, lng: 2 },
    ];
    const distances = await gms.fetchDistances(from, toList);
    expect(distances).toEqual([100, undefined]);
  });
});
