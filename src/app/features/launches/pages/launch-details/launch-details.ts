import {
  loadLaunches,
  toggleFavorite,
} from "@/app/features/launches/state/launch.actions";
import {
  selectAllLaunches,
  selectFavoriteIds,
  selectIsLoading,
} from "@/app/features/launches/state/launch.selectors";
import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-launch-details",
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./launch-details.html",
  styleUrl: "./launch-details.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchDetails {
  private store = inject(Store);

  // comes from the :id route param, see withComponentInputBinding()
  id = input.required<string>();

  private flightNumber = computed(() => Number(this.id()));

  private allLaunches = toSignal(this.store.select(selectAllLaunches), {
    requireSync: true,
  });
  private favoriteIds = toSignal(this.store.select(selectFavoriteIds), {
    requireSync: true,
  });

  loading = toSignal(this.store.select(selectIsLoading), {
    requireSync: true,
  });

  launch = computed(() =>
    this.allLaunches().find(
      (launch) => launch.flight_number === this.flightNumber(),
    ),
  );

  isFavorite = computed(() => this.favoriteIds().includes(this.flightNumber()));

  constructor() {
    // opening /launch/5 directly leaves the store empty, so load here.
    // coming from the list it is already filled, no need to load again.
    if (this.allLaunches().length === 0) {
      this.store.dispatch(loadLaunches());
    }
  }

  onToggleFavorite(): void {
    this.store.dispatch(toggleFavorite({ flightNumber: this.flightNumber() }));
  }
}
