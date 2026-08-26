import { makeLaunch } from "@/testing/launch.fixtures";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideStore, Store } from "@ngrx/store";

import {
  loadLaunchesFailure,
  loadLaunchesSuccess,
} from "../../state/launch.actions";
import { launchReducer } from "../../state/launch.reducer";
import { LaunchList } from "./launches-list";

describe("LaunchList", () => {
  let component: LaunchList;
  let fixture: ComponentFixture<LaunchList>;
  let store: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideStore({ launch: launchReducer }), provideRouter([])],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(LaunchList);
    component = fixture.componentInstance;

    store.dispatch(
      loadLaunchesSuccess({
        launches: [
          makeLaunch({ flight_number: 1, mission_name: "FalconSat" }),
          makeLaunch({ flight_number: 2, mission_name: "DemoSat" }),
          makeLaunch({ flight_number: 3, mission_name: "Trailblazer" }),
        ],
      }),
    );
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders every launch held in the store", () => {
    expect(fixture.nativeElement.querySelectorAll("mat-card").length).toBe(3);
  });

  it("filters by mission name, ignoring case", async () => {
    component.onSearchChange("demo");
    await fixture.whenStable();

    expect(component.filteredLaunches().length).toBe(1);
    expect(component.filteredLaunches()[0].launch.mission_name).toBe("DemoSat");
  });

  it("renders the empty block when nothing matches", async () => {
    component.onSearchChange("no-such-mission");
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll("mat-card").length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain("No launches found");
  });

  it("dispatches toggleFavorite for the clicked launch", () => {
    const dispatch = vi.spyOn(store, "dispatch");

    component.onToggleFavorite(2);

    expect(dispatch).toHaveBeenCalledWith({
      type: "[Launch] Toggle Favorite",
      flightNumber: 2,
    });
  });
});

describe("LaunchList before any data arrives", () => {
  let fixture: ComponentFixture<LaunchList>;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore({ launch: launchReducer }), provideRouter([])],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(LaunchList);
  });

  it("shows a spinner while the first load is in flight", async () => {
    await fixture.whenStable();

    expect(fixture.componentInstance.showSpinner()).toBe(true);
    expect(fixture.nativeElement.querySelector("mat-spinner")).toBeTruthy();
  });

  it("shows the message when the load fails", async () => {
    await fixture.whenStable();

    store.dispatch(loadLaunchesFailure({ error: "network down" }));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector("mat-spinner")).toBeNull();
    expect(fixture.nativeElement.textContent).toContain("network down");
  });
});
