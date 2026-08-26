import { TestBed } from "@angular/core/testing";

describe("Spacex", () => {
  let service: Spacex;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Spacex);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
