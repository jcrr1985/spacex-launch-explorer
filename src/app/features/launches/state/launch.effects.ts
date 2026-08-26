import { SpacexService } from "@/app/core/services/spacex.service";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import * as LaunchActions from "./launch.actions";

@Injectable()
export class LaunchEffects {
  loadLaunches$ = createEffect(
    (actions$ = inject(Actions), spaceXService = inject(SpacexService)) =>
      actions$.pipe(
        ofType(LaunchActions.loadLaunches),
        switchMap(() =>
          spaceXService.getPastLaunches().pipe(
            map((launches) => LaunchActions.loadLaunchesSuccess({ launches })),
            catchError((error) =>
              of(
                LaunchActions.loadLaunchesFailure({
                  error: error.message || "Error loading launches",
                }),
              ),
            ),
          ),
        ),
      ),
  );
}
