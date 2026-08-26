import {
  loadLaunches,
  toggleFavorite,
} from "@/app/features/launches/state/launch.actions";
import {
  selectAllLaunches,
  selectError,
  selectFavoriteIds,
  selectIsLoading,
} from "@/app/features/launches/state/launch.selectors";
import { DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-launches-list",
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./launches-list.html",
  styleUrl: "./launches-list.scss",
})
export class LaunchList implements OnInit {
  private store = inject(Store);

  query = signal("");

  private allLaunches = toSignal(this.store.select(selectAllLaunches), {
    requireSync: true,
  });
  private favoriteIds = toSignal(this.store.select(selectFavoriteIds), {
    requireSync: true,
  });

  error = toSignal(this.store.select(selectError), { requireSync: true });

  private loading = toSignal(this.store.select(selectIsLoading), {
    requireSync: true,
  });

  // only on the first load, otherwise coming back from the details page
  // hides the list behind a spinner for a moment
  showSpinner = computed(
    () => this.loading() && this.allLaunches().length === 0,
  );

  filteredLaunches = computed(() => {
    const query = this.query().toLowerCase();
    const favorites = new Set(this.favoriteIds());

    return this.allLaunches()
      .filter((launch) => launch.mission_name.toLowerCase().includes(query))
      .map((launch) => ({
        ...launch,
        isFavorite: favorites.has(launch.flight_number),
      }));
  });

  ngOnInit(): void {
    this.store.dispatch(loadLaunches());
  }

  onSearchChange(value: string): void {
    this.query.set(value);
  }

  onToggleFavorite(flightNumber: number): void {
    this.store.dispatch(toggleFavorite({ flightNumber }));
  }
}
