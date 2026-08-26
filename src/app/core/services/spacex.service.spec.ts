import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { environment } from "@/environments/environment";
import { SpacexService } from "./spacex.service";

describe("SpacexService", () => {
  let service: SpacexService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SpacexService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("requests the configured endpoint for past launches", () => {
    let received: unknown;
    service.getPastLaunches().subscribe((launches) => (received = launches));

    const request = httpMock.expectOne(environment.apiUrl);
    expect(request.request.method).toBe("GET");

    request.flush([]);
    expect(received).toEqual([]);
  });

  it("resolves a single launch by its flight_number", () => {
    let received: { mission_name: string } | undefined;
    service
      .getLaunchById("2")
      .subscribe((launch) => (received = launch as { mission_name: string }));

    httpMock.expectOne(environment.apiUrl).flush([
      { flight_number: 1, mission_name: "FalconSat" },
      { flight_number: 2, mission_name: "DemoSat" },
    ]);

    expect(received?.mission_name).toBe("DemoSat");
  });

  it("resolves to undefined when no launch matches", () => {
    let received: unknown = "untouched";
    service.getLaunchById("999").subscribe((launch) => (received = launch));

    httpMock
      .expectOne(environment.apiUrl)
      .flush([{ flight_number: 1, mission_name: "FalconSat" }]);

    expect(received).toBeUndefined();
  });
});
