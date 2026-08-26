import { Launch } from "@/app/core/models/launch.model";
import { createReducer, on } from "@ngrx/store";
import * as LaunchActions from "./launch.actions";

export interface LaunchState {
  launches: Launch[];
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
}

export const initialState: LaunchState = {
  launches: [],
  favoriteIds: [],
  loading: false,
  error: null,
};

export const launchReducer = createReducer(
  initialState,
  on(LaunchActions.loadLaunches, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(LaunchActions.loadLaunchesSuccess, (state, { launches }) => ({
    ...state,
    loading: false,
    launches,
  })),
  on(LaunchActions.loadLaunchesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(LaunchActions.toggleFavorite, (state, { flightNumber }) => ({
    ...state,
    favoriteIds: state.favoriteIds.includes(flightNumber)
      ? state.favoriteIds.filter((id) => id !== flightNumber)
      : [...state.favoriteIds, flightNumber],
  })),
);
