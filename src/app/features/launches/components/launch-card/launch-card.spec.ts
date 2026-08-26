import { makeLaunch } from "@/testing/launch.fixtures";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { LaunchCard } from "./launch-card";

describe("LaunchCard", () => {
  let component: LaunchCard;
  let fixture: ComponentFixture<LaunchCard>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(LaunchCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      "launch",
      makeLaunch({ flight_number: 6, mission_name: "RazakSat" }),
    );
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders the mission and links to its details page", () => {
    const link = fixture.nativeElement.querySelector("a.mission-link");

    expect(link.textContent.trim()).toBe("RazakSat");
    expect(link.getAttribute("href")).toBe("/launch/6");
  });

  it("shows an empty star until it is told otherwise", async () => {
    expect(iconText()).toBe("star_border");

    fixture.componentRef.setInput("isFavorite", true);
    await fixture.whenStable();

    expect(iconText()).toBe("star");
  });

  it("emits the flight number when the star is clicked", async () => {
    let emitted: number | undefined;
    component.toggleFavorite.subscribe((value) => (emitted = value));

    fixture.nativeElement.querySelector("mat-card-actions button").click();
    await fixture.whenStable();

    expect(emitted).toBe(6);
  });

  it("marks a failed launch", async () => {
    fixture.componentRef.setInput(
      "launch",
      makeLaunch({ launch_success: false }),
    );
    await fixture.whenStable();

    const chip = fixture.nativeElement.querySelector("mat-chip");
    expect(chip.textContent.trim()).toBe("Failure");
    expect(chip.classList.contains("status-error")).toBe(true);
  });

  function iconText(): string {
    return fixture.nativeElement
      .querySelector("mat-card-actions mat-icon")
      .textContent.trim();
  }
});
