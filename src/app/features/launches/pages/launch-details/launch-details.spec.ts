import { makeLaunch } from "@/testing/launch.fixtures";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideStore, Store } from "@ngrx/store";

import { loadLaunchesSuccess } from "../../state/launch.actions";
import { launchReducer } from "../../state/launch.reducer";
import { LaunchDetails } from "./launch-details";

describe("LaunchDetails", () => {
  let component: LaunchDetails;
  let fixture: ComponentFixture<LaunchDetails>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideStore({ launch: launchReducer }), provideRouter([])],
    });

    TestBed.inject(Store).dispatch(
      loadLaunchesSuccess({
        launches: [
          makeLaunch({
            flight_number: 4,
            mission_name: "RatSat",
            details: null,
          }),
        ],
      }),
    );

    fixture = TestBed.createComponent(LaunchDetails);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("id", "4");
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("resolves the launch matching the :id route parameter", () => {
    expect(component.launch()?.mission_name).toBe("RatSat");
    expect(fixture.nativeElement.textContent).toContain("RatSat");
  });

  it("falls back to a message when the mission has no description", () => {
    expect(fixture.nativeElement.textContent).toContain(
      "No mission description available.",
    );
  });

  it("toggles the favorite from the star button", async () => {
    const star = fixture.nativeElement.querySelector(
      ".favorite-button",
    ) as HTMLButtonElement;
    expect(component.isFavorite()).toBe(false);

    star.click();
    await fixture.whenStable();
    expect(component.isFavorite()).toBe(true);
    expect(star.getAttribute("aria-label")).toBe("Remove from favorites");

    star.click();
    await fixture.whenStable();
    expect(component.isFavorite()).toBe(false);
  });

  it("reports a not found state for an unknown flight number", async () => {
    fixture.componentRef.setInput("id", "999");
    await fixture.whenStable();

    expect(component.launch()).toBeUndefined();
    expect(fixture.nativeElement.textContent).toContain("Launch not found");
  });
});
