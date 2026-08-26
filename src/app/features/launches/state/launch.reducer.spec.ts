import { makeLaunch } from "@/testing/launch.fixtures";
import * as LaunchActions from "./launch.actions";
import { initialState, launchReducer, LaunchState } from "./launch.reducer";

describe("launchReducer", () => {
  describe("loading lifecycle", () => {
    it("flags loading and clears a previous error on loadLaunches", () => {
      const state: LaunchState = { ...initialState, error: "boom" };

      const next = launchReducer(state, LaunchActions.loadLaunches());

      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    it("stores the launches on success", () => {
      const launches = [makeLaunch({ flight_number: 7 })];

      const next = launchReducer(
        { ...initialState, loading: true },
        LaunchActions.loadLaunchesSuccess({ launches }),
      );

      expect(next.loading).toBe(false);
      expect(next.launches).toEqual(launches);
    });

    it("stores the message on failure", () => {
      const next = launchReducer(
        { ...initialState, loading: true },
        LaunchActions.loadLaunchesFailure({ error: "network down" }),
      );

      expect(next.loading).toBe(false);
      expect(next.error).toBe("network down");
    });
  });

  describe("toggleFavorite", () => {
    it("adds a flight number that is not yet a favorite", () => {
      const next = launchReducer(
        initialState,
        LaunchActions.toggleFavorite({ flightNumber: 3 }),
      );

      expect(next.favoriteIds).toEqual([3]);
    });

    it("removes a flight number that is already a favorite", () => {
      const state: LaunchState = { ...initialState, favoriteIds: [3, 8] };

      const next = launchReducer(
        state,
        LaunchActions.toggleFavorite({ flightNumber: 3 }),
      );

      expect(next.favoriteIds).toEqual([8]);
    });

    it("leaves the other favorites untouched", () => {
      const state: LaunchState = { ...initialState, favoriteIds: [1, 2, 3] };

      const next = launchReducer(
        state,
        LaunchActions.toggleFavorite({ flightNumber: 2 }),
      );

      expect(next.favoriteIds).toEqual([1, 3]);
    });

    it("never mutates the previous state", () => {
      const state: LaunchState = { ...initialState, favoriteIds: [1] };
      const snapshot = [...state.favoriteIds];

      const next = launchReducer(
        state,
        LaunchActions.toggleFavorite({ flightNumber: 2 }),
      );

      expect(state.favoriteIds).toEqual(snapshot);
      expect(next).not.toBe(state);
      expect(next.favoriteIds).not.toBe(state.favoriteIds);
    });
  });
});
