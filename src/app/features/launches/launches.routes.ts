import { Routes } from "@angular/router";

export const LAUNCHES_ROUTES: Routes = [
  {
    path: "",
    // without a title the tab keeps saying the same thing on every route and
    // screen readers announce nothing when the page changes
    title: "SpaceX Launch Explorer",
    loadComponent: () =>
      import("./pages/launches-list/launches-list").then((m) => m.LaunchList),
  },
  {
    path: "launch/:id",
    title: "Launch details | SpaceX Launch Explorer",
    loadComponent: () =>
      import("./pages/launch-details/launch-details").then(
        (m) => m.LaunchDetails,
      ),
  },
];
