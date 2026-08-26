import { makeLaunch } from "@/testing/launch.fixtures";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideStore, Store } from "@ngrx/store";

import { LaunchDetails } from "./pages/launch-details/launch-details";
import { LaunchList } from "./pages/launches-list/launches-list";
import { loadLaunchesSuccess } from "./state/launch.actions";
import { launchReducer } from "./state/launch.reducer";

// both pages share the same store here, same as when the router swaps them
describe("favorites across the list and details views", () => {
  const launches = [
    makeLaunch({ flight_number: 1, mission_name: "FalconSat" }),
    makeLaunch({ flight_number: 2, mission_name: "DemoSat" }),
  ];

  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore({ launch: launchReducer }), provideRouter([])],
    });

    store = TestBed.inject(Store);
    // no effects in this TestBed, so fill the store by hand
    store.dispatch(loadLaunchesSuccess({ launches }));
  });

  function starOf(element: HTMLElement): string {
    return (
      element.querySelector("mat-card-actions mat-icon")?.textContent ?? ""
    );
  }

  it("marks a launch as favorite from the list and shows it in the details", async () => {
    const list = TestBed.createComponent(LaunchList);
    await list.whenStable();

    const cards = list.nativeElement.querySelectorAll("mat-card");
    expect(cards.length).toBe(2);

    const favoriteButton = cards[1].querySelector(
      "mat-card-actions button",
    ) as HTMLButtonElement;
    expect(starOf(cards[1]).trim()).toBe("star_border");

    favoriteButton.click();
    await list.whenStable();

    expect(starOf(cards[1]).trim()).toBe("star");

    // same store, new component, like navigating to the details page
    const details = TestBed.createComponent(LaunchDetails);
    details.componentRef.setInput("id", "2");
    await details.whenStable();

    expect(details.componentInstance.launch()?.mission_name).toBe("DemoSat");
    expect(details.componentInstance.isFavorite()).toBe(true);
  });

  it("removing a favorite in the details view shows up in the list", async () => {
    const details = TestBed.createComponent(LaunchDetails);
    details.componentRef.setInput("id", "1");
    await details.whenStable();

    details.componentInstance.onToggleFavorite();
    await details.whenStable();
    expect(details.componentInstance.isFavorite()).toBe(true);

    details.componentInstance.onToggleFavorite();
    await details.whenStable();
    expect(details.componentInstance.isFavorite()).toBe(false);

    const list = TestBed.createComponent(LaunchList);
    await list.whenStable();

    const cards = list.nativeElement.querySelectorAll("mat-card");
    expect(starOf(cards[0]).trim()).toBe("star_border");
  });

  it("keeps favorites while the search filters the list", async () => {
    const list = TestBed.createComponent(LaunchList);
    await list.whenStable();

    const cards = list.nativeElement.querySelectorAll("mat-card");
    (
      cards[0].querySelector("mat-card-actions button") as HTMLButtonElement
    ).click();
    await list.whenStable();

    list.componentInstance.onSearchChange("falcon");
    await list.whenStable();

    const filtered = list.nativeElement.querySelectorAll("mat-card");
    expect(filtered.length).toBe(1);
    expect(starOf(filtered[0]).trim()).toBe("star");
  });
});
