import { Routes } from "@angular/router";

export const LAUNCHES_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/launches-list/launches-list").then((m) => m.LaunchList),
  },
  {
    path: "launch/:id",
    loadComponent: () =>
      import("./pages/launch-details/launch-details").then(
        (m) => m.LaunchDetails,
      ),
  },
];
