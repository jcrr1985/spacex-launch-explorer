import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("@/app/features/launches/launches.routes").then(
        (m) => m.LAUNCHES_ROUTES,
      ),
  },
];
